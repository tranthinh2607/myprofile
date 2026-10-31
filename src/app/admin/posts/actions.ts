"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { verifyAdminToken } from "@/lib/supabase/server";

import { generateSlug, estimateReadingTime } from "@/lib/blog-utils";

// Tạo admin client không generic để tránh lỗi TypeScript với Supabase query builders
function getAdminClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Xác thực admin
async function requireAdmin(token: string) {
  if (!verifyAdminToken(token)) {
    throw new Error("Unauthorized: Admin access required");
  }
}

// ============================================================
// CREATE POST
// ============================================================
export async function createPost(
  token: string,
  data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    cover_image?: string;
    status: "draft" | "published";
    tags: string[];
  }
) {
  await requireAdmin(token);
  const supabase = getAdminClient();
  const slug = data.slug?.trim() || generateSlug(data.title);

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title: data.title.trim(),
      slug,
      excerpt: data.excerpt?.trim() || null,
      content: data.content,
      cover_image: data.cover_image || null,
      status: data.status,
      tags: data.tags,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "42501" || error.message?.includes("row-level security")) {
      return {
        success: false,
        error: "Lỗi RLS (42501): Vui lòng chạy file fix_rls_policies.sql trong Supabase SQL Editor hoặc thêm SUPABASE_SERVICE_ROLE_KEY bí mật vào .env.local",
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { success: true, post: post as any };
}

// ============================================================
// UPDATE POST
// ============================================================
export async function updatePost(
  token: string,
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    cover_image?: string | null;
    status?: "draft" | "published";
    tags?: string[];
  }
) {
  await requireAdmin(token);
  const supabase = getAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("posts")
    .select("slug, status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "Bài viết không tồn tại" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {};
  if (data.title !== undefined) update.title = data.title.trim();
  if (data.slug !== undefined) update.slug = data.slug.trim() || generateSlug(data.title || "");
  if (data.excerpt !== undefined) update.excerpt = data.excerpt?.trim() || null;
  if (data.content !== undefined) update.content = data.content;
  if (data.cover_image !== undefined) update.cover_image = data.cover_image;
  if (data.status !== undefined) {
    update.status = data.status;
    if (data.status === "published" && existing.status === "draft") {
      update.published_at = new Date().toISOString();
    }
  }
  if (data.tags !== undefined) update.tags = data.tags;

  const { data: post, error } = await supabase
    .from("posts")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "42501" || error.message?.includes("row-level security")) {
      return {
        success: false,
        error: "Lỗi RLS (42501): Vui lòng chạy file fix_rls_policies.sql trong Supabase SQL Editor hoặc thêm SUPABASE_SERVICE_ROLE_KEY bí mật vào .env.local",
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  if (post && (post as Record<string, string>).slug !== existing.slug) {
    revalidatePath(`/blog/${(post as Record<string, string>).slug}`);
  }
  revalidatePath("/admin/posts");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { success: true, post: post as any };
}

// ============================================================
// DELETE POST
// ============================================================
export async function deletePost(token: string, id: string) {
  await requireAdmin(token);
  const supabase = getAdminClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/blog");
  if (existing && (existing as Record<string, string>).slug) {
    revalidatePath(`/blog/${(existing as Record<string, string>).slug}`);
  }
  revalidatePath("/admin/posts");
  return { success: true };
}

// ============================================================
// GET ALL POSTS (Admin)
// ============================================================
export async function getAllPostsAdmin(token: string) {
  await requireAdmin(token);
  const supabase = getAdminClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, status, tags, view_count, created_at, published_at, excerpt, cover_image")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message, posts: [] };

  const postsWithComments = await Promise.all(
    (posts || []).map(async (post) => {
      const p = post as Record<string, unknown>;
      const { count } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", p.id as string)
        .eq("status", "approved");
      return { ...p, comment_count: count || 0 };
    })
  );

  return { success: true, posts: postsWithComments };
}

// ============================================================
// UPLOAD ẢNH LÊN SUPABASE STORAGE
// ============================================================
export async function uploadCoverImage(token: string, formData: FormData) {
  await requireAdmin(token);
  const supabase = getAdminClient();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { success: false, error: "Không có file được chọn" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File quá lớn (tối đa 5MB)" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("blog-media")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) {
    if (error.message?.includes("row-level security")) {
      return {
        success: false,
        error: "Lỗi RLS Storage: Vui lòng chạy file fix_rls_policies.sql trong Supabase SQL Editor để mở quyền tải ảnh lên bucket blog-media",
      };
    }
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from("blog-media")
    .getPublicUrl(data.path);

  return { success: true, url: urlData.publicUrl };
}

// ============================================================
// UPLOAD ẢNH NỘI DUNG BÀI VIẾT LÊN SUPABASE STORAGE
// ============================================================
export async function uploadPostImage(token: string, formData: FormData) {
  await requireAdmin(token);
  const supabase = getAdminClient();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { success: false, error: "Không có file được chọn" };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "File quá lớn (tối đa 10MB)" };
  }

  const ext = file.name ? file.name.split(".").pop()?.toLowerCase() || "png" : "png";
  const fileName = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  let { data, error } = await supabase.storage
    .from("blog-media")
    .upload(fileName, file, { contentType: file.type || "image/png", upsert: false });

  if (error && (error.message.includes("Bucket not found") || error.message.includes("bucket"))) {
    try {
      await supabase.storage.createBucket("blog-media", { public: true });
      const retry = await supabase.storage
        .from("blog-media")
        .upload(fileName, file, { contentType: file.type || "image/png", upsert: false });
      data = retry.data;
      error = retry.error;
    } catch {
      // bỏ qua
    }
  }

  if (error || !data) {
    if (error?.message?.includes("row-level security")) {
      return {
        success: false,
        error: "Lỗi RLS Storage: Vui lòng chạy file fix_rls_policies.sql trong Supabase SQL Editor để mở quyền tải ảnh lên bucket blog-media",
      };
    }
    return { success: false, error: error?.message || "Lỗi upload ảnh" };
  }

  const { data: urlData } = supabase.storage
    .from("blog-media")
    .getPublicUrl(data.path);

  return { success: true, url: urlData.publicUrl };
}


// ============================================================
// ADMIN COMMENT
// ============================================================
export async function addAdminComment(
  token: string,
  data: { post_id: string; content: string; parent_id?: string }
) {
  await requireAdmin(token);
  const supabase = getAdminClient();

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      post_id: data.post_id,
      parent_id: data.parent_id || null,
      author_name: "Trường Thịnh (Tác giả)",
      author_email: "admin@tranmaitruongthinh.dev",
      content: data.content.trim(),
      is_admin: true,
      status: "approved",
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, comment };
}

// ============================================================
// TOGGLE COMMENT STATUS
// ============================================================
export async function toggleCommentStatus(
  token: string,
  commentId: string,
  status: "approved" | "hidden"
) {
  await requireAdmin(token);
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", commentId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============================================================
// DELETE COMMENT
// ============================================================
export async function deleteComment(token: string, commentId: string) {
  await requireAdmin(token);
  const supabase = getAdminClient();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
