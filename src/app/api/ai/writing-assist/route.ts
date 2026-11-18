import { NextRequest, NextResponse } from "next/server";
import { assistBlogWriting } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, text, extraContext, token } = body;

    // Xác thực token admin đơn giản
    const adminSecret = process.env.ADMIN_SECRET_KEY || "thinh2026";
    if (token !== adminSecret) {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập tính năng AI Assistant của Admin." },
        { status: 401 }
      );
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Vui lòng cung cấp nội dung cần hỗ trợ." },
        { status: 400 }
      );
    }

    if (type !== "outline" && type !== "polish" && type !== "meta") {
      return NextResponse.json(
        { error: "Loại yêu cầu không hợp lệ (outline, polish, meta)." },
        { status: 400 }
      );
    }

    const response = await assistBlogWriting(type, text, extraContext);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (err) {
    console.error("Lỗi API Writing Assist:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi gọi AI trợ lý soạn thảo.",
      },
      { status: 500 }
    );
  }
}
