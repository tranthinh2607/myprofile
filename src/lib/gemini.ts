import { personalInfo, projectsData, certificatesData, skillCategories } from "@/data/profile-data";

/**
 * Lấy Gemini API Key an toàn từ biến môi trường máy chủ
 */
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return apiKey;
}

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role?: "user" | "model";
  parts: GeminiPart[];
}

interface CallGeminiOptions {
  contents: GeminiContent[];
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

/**
 * Gọi Gemini REST API chuẩn mực từ server-side
 */
export async function callGemini(options: CallGeminiOptions): Promise<string> {
  const apiKey = getGeminiApiKey();

  const body: Record<string, unknown> = {
    contents: options.contents,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 2048,
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  if (options.responseMimeType) {
    (body.generationConfig as Record<string, unknown>).responseMimeType = options.responseMimeType;
  }

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      (errorData as { error?: { message?: string } })?.error?.message ||
      `Gemini API request failed with status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Không nhận được nội dung phản hồi từ mô hình Gemini.");
  }

  return text;
}

/**
 * Tạo prompt hệ thống chứa toàn bộ tri thức hồ sơ năng lực của Trần Mai Trường Thịnh
 */
export function buildThinhSystemPrompt(): string {
  const projectsSummary = projectsData
    .map(
      (p) =>
        `- ${p.title} (Vai trò: ${p.role}): ${p.summary} | Công nghệ: ${p.technologies.join(
          ", "
        )}${p.demoUrl ? ` | Demo: ${p.demoUrl}` : ""}${p.githubUrl ? ` | GitHub: ${p.githubUrl}` : ""}`
    )
    .join("\n");

  const certsSummary = certificatesData
    .map(
      (c) =>
        `- ${c.title} (Cấp bởi ${c.issuer}, ${c.issueDate})${
          c.credentialId ? ` [ID: ${c.credentialId}]` : ""
        } | Kỹ năng: ${c.skills.join(", ")}`
    )
    .join("\n");

  const skillsSummary = skillCategories
    .map((sc) => `${sc.category}: ${sc.skills.map((s) => s.name).join(", ")}`)
    .join("\n");

  return `Bạn là "Thịnh AI" (AI Digital Twin) - Trợ lý trí tuệ nhân tạo đại diện chính thức của TRẦN MAI TRƯỜNG THỊNH trên website cá nhân Portfolio & Blog (https://tranmaitruongthinh.dev).

THÔNG TIN CHÍNH XÁC VỀ TRẦN MAI TRƯỜNG THỊNH:
- Họ tên: TRẦN MAI TRƯỜNG THỊNH
- Chức danh: Software Engineer & Computer Engineer (Kỹ sư Phần mềm & Kỹ sư Máy tính)
- Học vấn: Tốt nghiệp Kỹ sư Công nghệ Thông tin (Hạng Giỏi), GPA 3.45 / 4.0 tại Trường Đại học Công nghệ TP.HCM (HUTECH), khóa 2022 - 2026.
- Giải thưởng học thuật tiêu biểu: Giải Nhì Olympic Tin học Sinh viên (Chuyên đề Lập trình & Cơ sở dữ liệu) năm 2023. Tư duy thuật toán vững, xử lý dữ liệu và cấu trúc giải thuật tối ưu.
- Địa điểm: TP. Hồ Chí Minh, Việt Nam (Sẵn sàng làm việc trực tiếp tại TP.HCM hoặc Remote).
- Email: ${personalInfo.email}
- Điện thoại: ${personalInfo.phone}
- GitHub: ${personalInfo.github}
- Định hướng & Trọng tâm kỹ thuật:
  + Phát triển Web Full-Stack hiện đại với Next.js 16 (App Router, Turbopack, Server Actions), React 19, TypeScript, Tailwind CSS v4.
  + Cơ sở dữ liệu & Backend: Supabase (PostgreSQL, Row-Level Security, Storage, Edge Functions).
  + Tích hợp Trí tuệ nhân tạo (AI Engineering): Google Gemini API, GenAI, Speech API.
  + Quản trị hệ thống, mạng máy tính & IT Help Desk: Am hiểu kiến trúc mạng (Cisco Certified), cấu hình và kiểm tra bản quyền hệ thống (Windows/Linux Scripting).

DANH SÁCH DỰ ÁN THỰC TẾ:
${projectsSummary}

DANH SÁCH VĂN BẰNG & CHỨNG CHỈ QUỐC TẾ:
${certsSummary}

KỸ NĂNG CHUYÊN MÔN:
${skillsSummary}

NGUYÊN TẮC GIAO TIẾP CỦA BẠN:
1. Luôn xưng hô lịch sự, chuyên nghiệp, tự tin nhưng khiêm tốn, văn phong mạch lạc, chuẩn mực của một kỹ sư công nghệ.
2. Trả lời bằng Tiếng Việt chuẩn mực (hoặc Tiếng Anh nếu người dùng hỏi bằng Tiếng Anh).
3. Luôn trung thực với các sự thật trên, KHÔNG BỊA ĐẶT thông tin không có trong hồ sơ.
4. Khi người dùng là Nhà tuyển dụng hỏi về kỹ năng, kinh nghiệm hoặc gửi Mô tả công việc (Job Description / JD):
   - Phân tích cặn kẽ xem năng lực của Thịnh đáp ứng những điểm nào trong JD.
   - Nêu bật các điểm mạnh cốt lõi: Nền tảng Olympic Tin học giải thuật vững vàng, GPA Giỏi HUTECH, thành thạo Next.js/React/TypeScript/Supabase/AI, sở hữu chứng chỉ quốc tế từ IBM, Google, Cisco.
   - Luôn sẵn lòng cung cấp thông tin liên hệ (${personalInfo.email} / ${personalInfo.phone}) và gợi ý tải file CV gốc (/TRANMAITRUONGTHINH.pdf).
5. Định dạng câu trả lời rõ ràng bằng Markdown (dùng bullet points, in đậm từ khóa quan trọng).`;
}

/**
 * Tóm tắt nội dung bài viết kỹ thuật bằng Gemini AI (TL;DR)
 */
function parseJsonSafely<T>(rawText: string, fallback: T): T {
  try {
    return JSON.parse(rawText.trim());
  } catch {
    const stripped = rawText
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    try {
      return JSON.parse(stripped);
    } catch {
      const first = rawText.indexOf("{");
      const last = rawText.lastIndexOf("}");
      if (first !== -1 && last !== -1 && last > first) {
        try {
          return JSON.parse(rawText.substring(first, last + 1));
        } catch {}
      }
    }
  }
  return fallback;
}

export async function summarizeArticleWithAI(
  title: string,
  content: string
): Promise<{
  tldr: string[];
  keyTakeaways: string[];
  estimatedReadTime: number;
  highlightTag: string;
}> {
  // Lược bớt markdown và giới hạn 15,000 ký tự để tối ưu tốc độ
  const truncatedContent = content.slice(0, 15000);

  const prompt = `Bạn là một chuyên gia kỹ thuật phần mềm. Hãy đọc bài viết dưới đây và tạo bản tóm tắt súc tích, đắt giá:

TIÊU ĐỀ: "${title}"
NỘI DUNG:
${truncatedContent}

YÊU CẦU:
Trả về DUY NHẤT một đối tượng JSON hợp lệ (không kèm markdown code block, không kèm chữ thừa) theo đúng cấu trúc sau:
{
  "tldr": [
    "Ý tóm tắt 1 (ngắn gọn, tối đa 2 câu)",
    "Ý tóm tắt 2 (ngắn gọn, tối đa 2 câu)",
    "Ý tóm tắt 3 (ngắn gọn, tối đa 2 câu)"
  ],
  "keyTakeaways": [
    "Bài học / Điểm kỹ thuật cốt lõi 1",
    "Bài học / Điểm kỹ thuật cốt lõi 2",
    "Bài học / Điểm kỹ thuật cốt lõi 3"
  ],
  "estimatedReadTime": 5,
  "highlightTag": "Từ khóa cốt lõi nhất (VD: Next.js 16 / Supabase RLS / Gemini AI)"
}`;

  const rawJson = await callGemini({
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: "Bạn là trợ lý phân tích và tóm tắt bài viết kỹ thuật công nghệ. Luôn trả về định dạng JSON thuần.",
    temperature: 0.3,
    maxOutputTokens: 1024,
    responseMimeType: "application/json",
  });

  const fallback = {
    tldr: [
      "Bài viết chia sẻ kiến thức chuyên sâu về kỹ thuật phần mềm và kiến trúc hệ thống hiện đại.",
      "Hướng dẫn triển khai chi tiết các giải pháp thực tế với Next.js và Supabase.",
      "Tổng hợp kinh nghiệm thực chiến và tối ưu hiệu năng ứng dụng.",
    ],
    keyTakeaways: [
      "Nắm vững kiến trúc phần mềm chuẩn mực",
      "Áp dụng giải pháp tối ưu cho hệ thống thực tế",
    ],
    estimatedReadTime: 5,
    highlightTag: "Kỹ Thuật",
  };

  const parsed = parseJsonSafely<Record<string, unknown>>(rawJson, {});

  return {
    tldr: Array.isArray(parsed.tldr) && parsed.tldr.length > 0 ? (parsed.tldr as string[]) : fallback.tldr,
    keyTakeaways:
      Array.isArray(parsed.keyTakeaways) && parsed.keyTakeaways.length > 0
        ? (parsed.keyTakeaways as string[])
        : fallback.keyTakeaways,
    estimatedReadTime:
      typeof parsed.estimatedReadTime === "number" ? parsed.estimatedReadTime : fallback.estimatedReadTime,
    highlightTag: typeof parsed.highlightTag === "string" ? parsed.highlightTag : fallback.highlightTag,
  };
}

/**
 * Trợ lý AI hỗ trợ viết bài trong Cổng Quản Trị Admin
 */
export async function assistBlogWriting(
  type: "outline" | "polish" | "meta",
  text: string,
  extraContext?: string
): Promise<{ result: string; meta?: { excerpt: string; tags: string[] } }> {
  if (type === "outline") {
    const prompt = `Hãy lập một dàn ý bài viết kỹ thuật chuyên sâu theo tiêu đề sau: "${text}".
Yêu cầu:
- Viết bằng Markdown.
- Gồm: Lời mở đầu, các phần chính (H2, H3), ví dụ thực tế / đoạn code minh họa nếu phù hợp, và Kết luận.
- Định dạng rõ ràng, chuyên nghiệp.`;

    const result = await callGemini({
      contents: [{ parts: [{ text: prompt }] }],
      temperature: 0.6,
      maxOutputTokens: 2048,
    });
    return { result };
  }

  if (type === "polish") {
    const prompt = `Hãy chỉnh sửa và trau chuốt lại đoạn văn sau cho mượt mà, chuẩn ngữ pháp kỹ thuật, chuyên nghiệp nhưng vẫn dễ hiểu:
"${text}"`;

    const result = await callGemini({
      contents: [{ parts: [{ text: prompt }] }],
      temperature: 0.3,
      maxOutputTokens: 2048,
    });
    return { result };
  }

  // Type: meta (Tự động sinh excerpt và tags cho bài viết)
  const prompt = `Hãy đọc nội dung bài viết dưới đây (Tiêu đề: "${extraContext || ""}") và sinh siêu dữ liệu:
"${text.slice(0, 5000)}"

Trả về DUY NHẤT một đối tượng JSON hợp lệ:
{
  "excerpt": "Đoạn mô tả ngắn gọn hấp dẫn 1-2 câu để làm trích dẫn bài viết, dưới 160 ký tự.",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}`;

  const rawJson = await callGemini({
    contents: [{ parts: [{ text: prompt }] }],
    temperature: 0.4,
    responseMimeType: "application/json",
  });

  const parsed = parseJsonSafely<Record<string, unknown>>(rawJson, {});
  const excerpt = typeof parsed.excerpt === "string" ? parsed.excerpt : text.slice(0, 150) + "...";
  const tags = Array.isArray(parsed.tags) && parsed.tags.length > 0 ? (parsed.tags as string[]) : ["Kỹ thuật", "Next.js"];

  return {
    result: excerpt,
    meta: {
      excerpt,
      tags,
    },
  };
}
