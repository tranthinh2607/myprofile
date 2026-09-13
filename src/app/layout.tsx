import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/layout/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tranmaitruongthinh.dev"),
  title: "Trần Mai Trường Thịnh | Software Engineer & Computer Engineer",
  description:
    "Hồ sơ Năng lực & Portfolio của Trần Mai Trường Thịnh (Software Engineer & Computer Engineer / IT Help Desk). Giải Nhì Olympic Tin học Sinh viên (Lập trình & CSDL), GPA 3.45/4.0 HUTECH, Next.js, React 19, TypeScript, Google Gemini AI & Quản trị Hệ thống.",
  keywords: [
    "Trần Mai Trường Thịnh",
    "Software Engineer",
    "Computer Engineer",
    "IT Help Desk",
    "Full-Stack Developer",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Google Gemini AI",
    "CHECK-LICENCE",
    "Olympic Tin học",
    "HUTECH",
  ],
  authors: [{ name: "Trần Mai Trường Thịnh" }],
  creator: "Trần Mai Trường Thịnh",
  openGraph: {
    title: "Trần Mai Trường Thịnh | Software Engineer & Computer Engineer",
    description:
      "Kỹ sư Phần mềm & Kỹ sư Máy tính / IT Help Desk với nền tảng giải thuật vững chắc (Giải Nhì Olympic Tin học Sinh viên), đam mê phát triển Web hiện đại và quản trị hệ thống máy tính.",
    url: "https://tranmaitruongthinh.dev",
    siteName: "Trần Mai Trường Thịnh Portfolio",
    images: [
      {
        url: "/images/about/thinh-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Trần Mai Trường Thịnh - Senior Full-Stack & System Engineer",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth dark`}
    >
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-emerald-500 selection:text-black">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
