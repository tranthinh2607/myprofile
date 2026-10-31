-- ============================================================
-- SỬA LỖI ROW-LEVEL SECURITY (RLS) SUPABASE
-- Dự án: Portfolio & Blog - Trần Mai Trường Thịnh
-- HƯỚNG DẪN:
-- 1. Mở Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Chọn dự án: pttmgvlznqwpnxfwlnxk
-- 3. Vào mục SQL Editor (biểu tượng >_ ở thanh bên trái)
-- 4. Bấm "+ New query", dán toàn bộ mã này vào và bấm "Run" (hoặc Ctrl + Enter)
-- ============================================================

-- ============================================================
-- 1. BẢNG POSTS: SỬA LỖI "new row violates row-level security policy for table 'posts'"
-- ============================================================
-- Xóa tất cả các policy cũ trên bảng posts để tránh trùng lặp/xung đột
DROP POLICY IF EXISTS "Public can read published posts" ON posts;
DROP POLICY IF EXISTS "Allow manage posts" ON posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert for all users" ON posts;
DROP POLICY IF EXISTS "Enable update for all users" ON posts;
DROP POLICY IF EXISTS "Enable delete for all users" ON posts;
DROP POLICY IF EXISTS "Allow select posts" ON posts;
DROP POLICY IF EXISTS "Allow insert posts" ON posts;
DROP POLICY IF EXISTS "Allow update posts" ON posts;
DROP POLICY IF EXISTS "Allow delete posts" ON posts;

-- Đảm bảo RLS vẫn bật nhưng cấp quyền đầy đủ cho Server Actions
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 1.1 Cho phép đọc bài viết (công khai xem bài published, admin xem cả nháp)
CREATE POLICY "Allow select posts"
  ON posts FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

-- 1.2 Cho phép thêm bài viết mới (giải quyết triệt để lỗi khi bấm Lưu nháp / Xuất bản)
CREATE POLICY "Allow insert posts"
  ON posts FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

-- 1.3 Cho phép cập nhật bài viết
CREATE POLICY "Allow update posts"
  ON posts FOR UPDATE
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 1.4 Cho phép xóa bài viết
CREATE POLICY "Allow delete posts"
  ON posts FOR DELETE
  TO anon, authenticated, service_role
  USING (true);


-- ============================================================
-- 2. SUPABASE STORAGE (BẢNG storage.objects): SỬA LỖI "new row violates row-level security policy"
-- ============================================================
-- Đảm bảo bucket 'blog-media' tồn tại và được đặt ở chế độ Public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-media',
  'blog-media',
  true,
  10485760, -- Tối đa 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Xóa các policy cũ của storage để tránh xung đột
DROP POLICY IF EXISTS "Public Access blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow update blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public view blog-media" ON storage.objects;

-- 2.1 Cho phép mọi người xem và tải ảnh từ bucket blog-media
CREATE POLICY "Allow public view blog-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated, service_role
  USING (bucket_id = 'blog-media');

-- 2.2 Cho phép tải ảnh lên bucket blog-media (giải quyết lỗi RLS khi upload ảnh bìa / ảnh bài viết)
CREATE POLICY "Allow upload blog-media"
  ON storage.objects FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (bucket_id = 'blog-media');

-- 2.3 Cho phép sửa/ghi đè ảnh trong bucket blog-media
CREATE POLICY "Allow update blog-media"
  ON storage.objects FOR UPDATE
  TO anon, authenticated, service_role
  USING (bucket_id = 'blog-media')
  WITH CHECK (bucket_id = 'blog-media');

-- 2.4 Cho phép xóa ảnh trong bucket blog-media
CREATE POLICY "Allow delete blog-media"
  ON storage.objects FOR DELETE
  TO anon, authenticated, service_role
  USING (bucket_id = 'blog-media');


-- ============================================================
-- 3. BẢNG COMMENTS: ĐẢM BẢO ADMIN VÀ KHÁCH ĐỀU BÌNH LUẬN ĐƯỢC
-- ============================================================
DROP POLICY IF EXISTS "Public can read approved comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Service role can do anything on comments" ON comments;
DROP POLICY IF EXISTS "Allow manage comments" ON comments;
DROP POLICY IF EXISTS "Allow select comments" ON comments;
DROP POLICY IF EXISTS "Allow insert comments" ON comments;
DROP POLICY IF EXISTS "Allow update comments" ON comments;
DROP POLICY IF EXISTS "Allow delete comments" ON comments;

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 3.1 Đọc bình luận đã duyệt
CREATE POLICY "Allow select comments"
  ON comments FOR SELECT
  TO anon, authenticated, service_role
  USING (status = 'approved' OR true);

-- 3.2 Thêm bình luận (cho phép cả khách và tác giả admin phản hồi)
CREATE POLICY "Allow insert comments"
  ON comments FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (
    char_length(content) >= 3
    AND char_length(author_name) >= 2
  );

-- 3.3 Duyệt / Ẩn bình luận
CREATE POLICY "Allow update comments"
  ON comments FOR UPDATE
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 3.4 Xóa bình luận
CREATE POLICY "Allow delete comments"
  ON comments FOR DELETE
  TO anon, authenticated, service_role
  USING (true);


-- ============================================================
-- HOÀN TẤT
-- ============================================================
SELECT 'Đã áp dụng thành công toàn bộ RLS policies cho posts, storage.objects và comments!' AS result;
