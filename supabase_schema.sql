-- ============================================================
-- SUPABASE BLOG SYSTEM - COMPLETE MIGRATION SCRIPT
-- Portfolio: Trần Mai Trường Thịnh
-- Chạy toàn bộ script này trong Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. BẢNG POSTS (Bài viết Blog)
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  slug          TEXT        UNIQUE NOT NULL,
  excerpt       TEXT,
  content       TEXT        NOT NULL DEFAULT '',
  cover_image   TEXT,
  status        VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  view_count    INT         NOT NULL DEFAULT 0,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug       ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_status     ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_published  ON posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags       ON posts USING GIN (tags);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 2. BẢNG COMMENTS (Bình luận)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID        NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  parent_id     UUID        REFERENCES comments (id) ON DELETE CASCADE,
  author_name   TEXT        NOT NULL CHECK (char_length(author_name) >= 2),
  author_email  TEXT        NOT NULL CHECK (author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  content       TEXT        NOT NULL CHECK (char_length(content) >= 3),
  is_admin      BOOLEAN     NOT NULL DEFAULT FALSE,
  status        VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'hidden')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id   ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_status    ON comments (status);

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 3.1 Posts policies
DROP POLICY IF EXISTS "Public can read published posts" ON posts;
DROP POLICY IF EXISTS "Allow manage posts" ON posts;
DROP POLICY IF EXISTS "Allow select posts" ON posts;
DROP POLICY IF EXISTS "Allow insert posts" ON posts;
DROP POLICY IF EXISTS "Allow update posts" ON posts;
DROP POLICY IF EXISTS "Allow delete posts" ON posts;

CREATE POLICY "Allow select posts"
  ON posts FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

CREATE POLICY "Allow insert posts"
  ON posts FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

CREATE POLICY "Allow update posts"
  ON posts FOR UPDATE
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete posts"
  ON posts FOR DELETE
  TO anon, authenticated, service_role
  USING (true);

-- 3.2 Storage (blog-media bucket) policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-media',
  'blog-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public view blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow update blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete blog-media" ON storage.objects;

CREATE POLICY "Allow public view blog-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated, service_role
  USING (bucket_id = 'blog-media');

CREATE POLICY "Allow upload blog-media"
  ON storage.objects FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (bucket_id = 'blog-media');

CREATE POLICY "Allow update blog-media"
  ON storage.objects FOR UPDATE
  TO anon, authenticated, service_role
  USING (bucket_id = 'blog-media')
  WITH CHECK (bucket_id = 'blog-media');

CREATE POLICY "Allow delete blog-media"
  ON storage.objects FOR DELETE
  TO anon, authenticated, service_role
  USING (bucket_id = 'blog-media');

-- 3.3 Comments policies
DROP POLICY IF EXISTS "Public can read approved comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Service role can do anything on comments" ON comments;
DROP POLICY IF EXISTS "Allow manage comments" ON comments;
DROP POLICY IF EXISTS "Allow select comments" ON comments;
DROP POLICY IF EXISTS "Allow insert comments" ON comments;
DROP POLICY IF EXISTS "Allow update comments" ON comments;
DROP POLICY IF EXISTS "Allow delete comments" ON comments;

CREATE POLICY "Allow select comments"
  ON comments FOR SELECT
  TO anon, authenticated, service_role
  USING (status = 'approved' OR true);

CREATE POLICY "Allow insert comments"
  ON comments FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (
    char_length(content) >= 3
    AND char_length(author_name) >= 2
  );

CREATE POLICY "Allow update comments"
  ON comments FOR UPDATE
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete comments"
  ON comments FOR DELETE
  TO anon, authenticated, service_role
  USING (true);

-- ============================================================
-- 4. HÀM TĂNG VIEW COUNT
-- ============================================================
CREATE OR REPLACE FUNCTION increment_post_view(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_post_view(TEXT) TO anon, authenticated;

-- ============================================================
-- 5. BẬT REALTIME CHO COMMENTS
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- ============================================================
-- 6. DỮ LIỆU BÀI VIẾT MẪU VỚI HÌNH ẢNH & VIDEO TRỰC QUAN
-- ============================================================
INSERT INTO posts (title, slug, excerpt, cover_image, content, status, tags, published_at)
VALUES (
  'Xây dựng Portfolio với Next.js 16 và Supabase',
  'xay-dung-portfolio-voi-nextjs-16-va-supabase',
  'Khám phá hành trình xây dựng Portfolio cá nhân hiện đại với Next.js 16 App Router, tích hợp Supabase Realtime, Storage và video/ảnh minh họa trực quan.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
  E'## 1. Giới thiệu tổng quan\n\nTrong kỷ nguyên Web hiện đại, việc sở hữu một Portfolio cá nhân không chỉ dừng lại ở việc giới thiệu thông tin đơn thuần mà còn là **minh chứng thực tế** cho năng lực làm chủ công nghệ, tư duy thiết kế hệ thống và trải nghiệm người dùng (UX).\n\n![Kiến trúc phát triển phần mềm hiện đại với Next.js và Cloud Backend](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop)\n\nBài viết này chia sẻ chi tiết hành trình mình thiết kế, xây dựng và tối ưu Portfolio cá nhân đạt chuẩn cao cấp với **Next.js 16 (App Router, Turbopack, React 19)** và **Supabase (PostgreSQL, Storage, Realtime, Row Level Security)**.\n\n---\n\n## 2. Video Trực Quan: Tìm Hiểu Kiến Trúc App Router & Server Actions\n\nDưới đây là video giới thiệu trực quan về cách Next.js xử lý việc render phía Server, truyền dữ liệu không độ trễ và quản lý trạng thái:\n\n<iframe src=\"https://www.youtube-nocookie.com/embed/Sklc_fQBmcs\" title=\"Khám phá kiến trúc Next.js App Router\" allowfullscreen></iframe>\n\n> [!NOTE]\n> **Điểm đột phá:** Với React Server Components, toàn bộ mã nguồn xử lý dữ liệu nặng và kết nối Database trực tiếp chạy trên máy chủ, client chỉ nhận về HTML và JSON siêu nhẹ, triệt tiêu hoàn toàn bundle size thừa thãi.\n\n---\n\n## 3. Bản thiết kế Kiến trúc & Luồng dữ liệu\n\nDưới đây là sơ đồ luồng hoạt động giữa Client, Next.js Server Components và Supabase Cloud:\n\n![Sơ đồ kiến trúc luồng dữ liệu bảo mật với Supabase RLS](https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1400&auto=format&fit=crop)\n\n### Bảng so sánh hiệu năng:\n\n| Tiêu chí kỹ thuật | Giải pháp truyền thống (SPA / CSR) | Next.js 16 + Supabase (RSC & ISR) |\n| :--- | :--- | :--- |\n| **First Contentful Paint (FCP)** | 1.8s - 3.2s (Chờ tải toàn bộ JS) | **~150ms** (HTML render sẵn) |\n| **Bảo mật cơ sở dữ liệu** | Phụ thuộc hoàn toàn vào API trung gian | Phân quyền đa lớp với **Row Level Security (RLS)** |\n| **Bình luận & Thảo luận** | Phải ấn F5 reload để cập nhật | Tức thì nhờ **Supabase Realtime Channel** |\n| **Tối ưu SEO / Social Sharing** | Khó index, OG Image tĩnh | Tự động sinh **Dynamic OpenGraph Meta** |\n\n---\n\n## 4. Tích hợp Hệ thống Thảo luận Trực tiếp (Supabase Realtime)\n\nMột trong những tính năng thú vị nhất trên Blog cá nhân này là hệ thống bình luận hai cấp với khả năng cập nhật theo thời gian thực (Realtime WebSockets).\n\n![Trải nghiệm thảo luận kỹ thuật trực tiếp không cần reload trang](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop)\n\nĐoạn mã lắng nghe sự kiện bình luận mới qua Supabase Channel:\n\n```typescript\nconst channel = supabase\n  .channel(`comments-post-${postId}`)\n  .on(\n    \'postgres_changes\',\n    { event: \'INSERT\', schema: \'public\', table: \'comments\', filter: `post_id=eq.${postId}` },\n    (payload) => {\n      // Tự động bổ sung bình luận mới vào danh sách mà không cần F5\n      console.log(\'Bình luận mới:\', payload.new);\n    }\n  )\n  .subscribe();\n```\n\n---\n\n## 5. Kết luận & Định hướng tiếp theo\n\nSự kết hợp giữa **Next.js 16**, **Tailwind CSS v4** và **Supabase** tạo nên một nền tảng vững chắc, linh hoạt và tốc độ cực kỳ ấn tượng. Các bạn có thể thoải mái để lại bình luận hoặc câu hỏi ở phần thảo luận bên dưới nhé!',
  'published',
  ARRAY['Next.js', 'Supabase', 'Portfolio', 'TypeScript'],
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  cover_image = EXCLUDED.cover_image,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

SELECT 'Setup completed successfully!' as result;
