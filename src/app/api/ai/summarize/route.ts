import { NextRequest, NextResponse } from "next/server";
import { summarizeArticleWithAI } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content } = body;

    if (!content || typeof content !== "string" || content.trim().length < 50) {
      return NextResponse.json(
        { error: "Nội dung bài viết quá ngắn để tóm tắt." },
        { status: 400 }
      );
    }

    const summary = await summarizeArticleWithAI(title || "Bài viết", content);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (err) {
    console.error("Lỗi API summarize:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi tạo tóm tắt bằng Gemini AI.",
      },
      { status: 500 }
    );
  }
}
