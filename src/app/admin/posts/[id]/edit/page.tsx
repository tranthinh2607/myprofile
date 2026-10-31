"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostEditor } from "../../PostEditor";
import type { Post } from "@/types/supabase";
import { Loader2 } from "lucide-react";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token") || "";
    if (!saved) {
      router.push("/admin/posts");
      return;
    }
    setToken(saved);

    // Fetch post data via API
    async function fetchPost() {
      try {
        const res = await fetch(
          `/api/admin/posts/${params.id}?token=${encodeURIComponent(saved)}`
        );
        const data = await res.json();
        if (data.success) {
          setPost(data.post);
        } else {
          setError(data.error || "Không tìm thấy bài viết");
        }
      } catch {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-300">
        <p className="font-mono text-sm">{error || "Bài viết không tồn tại"}</p>
      </div>
    );
  }

  return <PostEditor mode="edit" initialPost={post} token={token} />;
}
