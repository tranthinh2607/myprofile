import { NextRequest, NextResponse } from "next/server";
import {
  saveMessage,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
} from "@/lib/db";

// In-memory rate limiting map: IP -> timestamp[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 phút
const MAX_REQUESTS_PER_WINDOW = 5; // Tối đa 5 tin nhắn / 10 phút

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Lọc các timestamp còn trong cửa sổ 10 phút
  const validTimestamps = timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

// Hàm làm sạch dữ liệu đầu vào chống XSS
function sanitizeInput(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * POST /api/contact - Nhận tin nhắn liên hệ kỹ thuật từ người dùng
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // 1. Kiểm tra Rate Limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng chờ ít phút trước khi thử lại.",
        },
        { status: 429 }
      );
    }

    // 2. Phân tích dữ liệu JSON
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Dữ liệu gửi lên không hợp lệ." },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // 3. Xác thực đầu vào (Validation)
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Họ và tên cần có tối thiểu 2 ký tự.",
        },
        { status: 400 }
      );
    }
    if (name.trim().length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Họ và tên không được vượt quá 100 ký tự.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      !emailRegex.test(email.trim()) ||
      email.trim().length > 120
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Địa chỉ email không hợp lệ.",
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 15) {
      return NextResponse.json(
        {
          success: false,
          error: "Nội dung tin nhắn cần tối thiểu 15 ký tự.",
        },
        { status: 400 }
      );
    }
    if (message.trim().length > 3000) {
      return NextResponse.json(
        {
          success: false,
          error: "Nội dung tin nhắn không được vượt quá 3000 ký tự.",
        },
        { status: 400 }
      );
    }

    // 4. Lưu vào Database
    const saved = await saveMessage({
      name: sanitizeInput(name),
      email: email.trim().toLowerCase(),
      message: sanitizeInput(message),
      ip,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tin nhắn của bạn đã được tiếp nhận và lưu trữ thành công!",
        data: {
          id: saved.id,
          createdAt: saved.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi API /api/contact:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi máy chủ trong quá trình xử lý tin nhắn.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact - Lấy danh sách tin nhắn (Dành cho Quản trị viên / Kỹ sư)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token =
      searchParams.get("token") || request.headers.get("x-admin-token");

    const ADMIN_SECRET = process.env.ADMIN_SECRET || "thinh2026";
    if (token !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: "Bạn không có quyền truy cập dữ liệu này." },
        { status: 401 }
      );
    }

    const messages = await getAllMessages();
    return NextResponse.json({
      success: true,
      total: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Lỗi GET /api/contact:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi đọc dữ liệu." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/contact - Cập nhật trạng thái tin nhắn (read, replied, unread)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token =
      searchParams.get("token") || request.headers.get("x-admin-token");

    const ADMIN_SECRET = process.env.ADMIN_SECRET || "thinh2026";
    if (token !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: "Không có quyền thao tác." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body?.id || !body?.status) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID hoặc trạng thái mới." },
        { status: 400 }
      );
    }

    const updated = await updateMessageStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy tin nhắn cần cập nhật." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật trạng thái thành công.",
    });
  } catch (error) {
    console.error("Lỗi PATCH /api/contact:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi cập nhật." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact - Xóa tin nhắn
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token =
      searchParams.get("token") || request.headers.get("x-admin-token");

    const ADMIN_SECRET = process.env.ADMIN_SECRET || "thinh2026";
    if (token !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: "Không có quyền thao tác." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const id = body?.id || searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID tin nhắn." },
        { status: 400 }
      );
    }

    const deleted = await deleteMessage(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy tin nhắn để xóa." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa tin nhắn thành công.",
    });
  } catch (error) {
    console.error("Lỗi DELETE /api/contact:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi xóa tin nhắn." },
      { status: 500 }
    );
  }
}
