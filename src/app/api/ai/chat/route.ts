import { NextRequest, NextResponse } from "next/server";
import { callGemini, buildThinhSystemPrompt } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập câu hỏi hoặc nội dung tin nhắn." },
        { status: 400 }
      );
    }

    // Xây dựng lịch sử hội thoại chuẩn định dạng Gemini API
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      // Giới hạn 10 tin nhắn gần nhất để tối ưu context
      const recentHistory = history.slice(-10);
      for (const item of recentHistory) {
        if (item.text && (item.role === "user" || item.role === "model")) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Thêm tin nhắn mới nhất của người dùng
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    const systemInstruction = buildThinhSystemPrompt();

    const reply = await callGemini({
      contents,
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 2048,
    });

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("Lỗi API Thịnh AI Chat:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi trao đổi với Trợ lý AI.",
      },
      { status: 500 }
    );
  }
}
