import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "replied";
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "messages.json");

// Đảm bảo thư mục data và file messages.json tồn tại
async function ensureDbExists(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // File chưa tồn tại, khởi tạo mảng rỗng
      await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Lỗi khởi tạo Database:", error);
  }
}

/**
 * Lấy toàn bộ danh sách tin nhắn, sắp xếp theo thời gian mới nhất
 */
export async function getAllMessages(): Promise<ContactMessage[]> {
  await ensureDbExists();
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    const data: ContactMessage[] = JSON.parse(raw);
    return data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Lỗi đọc messages từ database:", error);
    return [];
  }
}

/**
 * Lưu tin nhắn mới vào cơ sở dữ liệu
 */
export async function saveMessage(
  payload: Omit<ContactMessage, "id" | "status" | "createdAt">
): Promise<ContactMessage> {
  await ensureDbExists();
  const messages = await getAllMessages();

  const newMessage: ContactMessage = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    message: payload.message.trim(),
    status: "unread",
    ip: payload.ip,
    userAgent: payload.userAgent,
    createdAt: new Date().toISOString(),
  };

  messages.unshift(newMessage);

  // Ghi nguyên tử (atomic write)
  const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(messages, null, 2), "utf-8");
  await fs.rename(tempFile, DB_FILE);

  return newMessage;
}

/**
 * Cập nhật trạng thái tin nhắn (unread / read / replied)
 */
export async function updateMessageStatus(
  id: string,
  status: "unread" | "read" | "replied"
): Promise<boolean> {
  await ensureDbExists();
  const messages = await getAllMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return false;

  messages[index].status = status;

  const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(messages, null, 2), "utf-8");
  await fs.rename(tempFile, DB_FILE);

  return true;
}

/**
 * Xóa tin nhắn theo ID
 */
export async function deleteMessage(id: string): Promise<boolean> {
  await ensureDbExists();
  const messages = await getAllMessages();
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;

  const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(filtered, null, 2), "utf-8");
  await fs.rename(tempFile, DB_FILE);

  return true;
}
