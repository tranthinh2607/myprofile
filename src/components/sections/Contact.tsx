"use client";

import React, { useState } from "react";
import { personalInfo } from "@/data/profile-data";
import { useToast } from "@/components/layout/Toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Terminal,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon, XIcon } from "@/components/icons/SocialIcons";

export function Contact() {
  const { showToast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const copyToClipboard = async (text: string, type: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
        showToast("Đã sao chép Email vào bộ nhớ tạm!", "success");
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
        showToast("Đã sao chép Số điện thoại vào bộ nhớ tạm!", "success");
      }
    } catch {
      showToast("Không thể sao chép. Vui lòng chọn thủ công.", "info");
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên của bạn.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng cung cấp địa chỉ email liên hệ.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung trao đổi kỹ thuật hoặc mô tả dự án.";
    } else if (formData.message.trim().length < 15) {
      newErrors.message = "Nội dung cần tối thiểu 15 ký tự để trao đổi rõ ràng.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gửi tin nhắn thất bại, vui lòng thử lại.");
      }

      setIsSuccess(true);
      showToast(result.message || "Tin nhắn đã được gửi và lưu trữ thành công!", "success");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setTimeout(() => setIsSuccess(false), 8000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi kết nối, vui lòng thử lại sau.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950/90 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono">
            <span>// DIRECT COMMUNICATION CHANNEL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-sans">
            Kết Nối & Thảo Luận Cơ Hội Hợp Tác
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Sẵn sàng trao đổi về các vị trí Senior Full-Stack, System Architect, hoặc các bài toán tư vấn tối ưu hóa hiệu năng hệ thống chịu tải cao.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact & Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-7 space-y-6">
              <h3 className="text-lg font-bold text-zinc-100 font-sans flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Thông Tin Kỹ Sư Trực Tiếp
              </h3>

              {/* Email Card with Copy */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3 group">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] font-mono text-zinc-400 block">Email Chính Thức</span>
                  <span className="text-xs sm:text-sm font-mono text-zinc-200 truncate block">
                    {personalInfo.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(personalInfo.email, "email")}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors shrink-0"
                  aria-label="Sao chép Email"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>

              {/* Phone Card with Copy */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3 group">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-mono text-zinc-400 block">Số Điện Thoại / Zalo</span>
                  <span className="text-xs sm:text-sm font-mono text-zinc-200">
                    {personalInfo.phone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(personalInfo.phone, "phone")}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors shrink-0"
                  aria-label="Sao chép Số điện thoại"
                >
                  {copiedPhone ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>

              {/* Location & Response Time */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Địa điểm</span>
                  </div>
                  <div className="text-zinc-200 font-semibold">{personalInfo.location}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Phản hồi SLA</span>
                  </div>
                  <div className="text-zinc-200 font-semibold">&lt; 24 giờ làm việc</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap gap-2">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                >
                  <GithubIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                  <span>GitHub</span>
                </a>
                {personalInfo.facebook && (
                  <a
                    href={personalInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                  >
                    <FacebookIcon className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors shrink-0" />
                    <span>Facebook</span>
                  </a>
                )}
                {personalInfo.instagram && (
                  <a
                    href={personalInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                  >
                    <InstagramIcon className="w-4 h-4 text-zinc-400 group-hover:text-pink-400 transition-colors shrink-0" />
                    <span>Instagram</span>
                  </a>
                )}
                {personalInfo.x && (
                  <a
                    href={personalInfo.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                  >
                    <XIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                    <span>X</span>
                  </a>
                )}
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium font-sans text-zinc-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/40 group"
                >
                  <LinkedinIcon className="w-4 h-4 text-zinc-400 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Client-Validated Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-zinc-100 font-sans">
                Gửi Tin Nhắn / Yêu Cầu Hợp Tác Kỹ Thuật
              </h3>

              {isSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Tin nhắn đã được tiếp nhận thành công!</p>
                    <p className="text-zinc-300 font-sans">
                      Cảm ơn bạn đã liên hệ. Tôi sẽ phân tích yêu cầu và phản hồi lại qua email trong vòng 24 giờ.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 block">
                      Họ và tên <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border text-xs font-sans text-zinc-200 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                        errors.name
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-zinc-800 focus:border-emerald-500/70"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[11px] font-mono text-red-400">{errors.name}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 block">
                      Email của bạn <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border text-xs font-sans text-zinc-200 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-zinc-800 focus:border-emerald-500/70"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] font-mono text-red-400">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300 block">
                    Nội dung chi tiết <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mô tả dự án, yêu cầu kỹ thuật, tech stack hoặc thông tin trao đổi..."
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border text-xs font-sans text-zinc-200 placeholder:text-zinc-400 focus:outline-none transition-colors resize-y ${
                      errors.message
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-zinc-800 focus:border-emerald-500/70"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[11px] font-mono text-red-400">{errors.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>Đang xử lý gửi tin nhắn...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Tin Nhắn Trực Tiếp Cho Kỹ Sư</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
