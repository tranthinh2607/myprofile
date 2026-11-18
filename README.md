# Trần Mai Trường Thịnh - Portfolio & Professional Profile

<p align="center">
  <img src="public/images/about/thinh-portrait.jpg" alt="Trần Mai Trường Thịnh" width="130" style="border-radius: 50%; border: 3px solid #10b981;" />
</p>

<p align="center">
  <b>Kỹ Sư Phần Mềm | Software Engineer</b><br />
  Đại học Công nghệ TP.HCM (HUTECH) • Giải Nhì Olympic Tin học Sinh viên 2023 (Lập trình & CSDL)
</p>

<p align="center">
  <a href="https://github.com/tranthinh2607"><img src="https://img.shields.io/badge/GitHub-tranthinh2607-181717?style=flat&logo=github" alt="GitHub" /></a>
  <a href="https://facebook.com/tmtthinh204"><img src="https://img.shields.io/badge/Facebook-tmtthinh204-1877F2?style=flat&logo=facebook" alt="Facebook" /></a>
  <a href="mailto:tranmaitruongthinh2607@gmail.com"><img src="https://img.shields.io/badge/Email-tranmaitruongthinh2607%40gmail.com-EA4335?style=flat&logo=gmail" alt="Email" /></a>
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript" alt="TypeScript" />
</p>

---

## 📌 Giới Thiệu (About Me)

Kỹ sư phần mềm xuất thân từ nền tảng giải thuật và cơ sở dữ liệu vững chắc. Tôi tập trung vào việc viết mã nguồn sạch, tối ưu hóa hiệu năng ứng dụng và tích hợp các giải pháp trí tuệ nhân tạo vào giải quyết bài toán thực tế. 

Với tư duy kỹ thuật toàn diện từ mạng máy tính, hệ thống đến phần mềm, tôi hướng đến việc xây dựng các sản phẩm công nghệ có trải nghiệm mượt mà, vận hành ổn định và dễ dàng mở rộng.

---

## 🚀 Tính Năng Nổi Bật Của Website (Key Features)

- **Thiết kế tối giản & hiện đại:** Giao diện Dark theme cao cấp (phong cách *Linear / Vercel*), viền kính mờ (glassmorphism), typography sắc nét và chuẩn mực.
- **Tiểu sử & Hành trình 3 giai đoạn:** Tái hiện chân thực chặng đường phát triển từ tự học máy tính (2020–2022) ➔ Giảng đường HUTECH & Trợ giảng tin học quốc tế (2022–2026) ➔ Kỹ sư phần mềm thực chiến (2026–Nay) với hình ảnh thực tế.
- **Dự án sản phẩm thực chiến:** Trưng bày các dự án có link GitHub và Live Demo:
  - [IC3 GS6 Testing Platform](https://ic3-gs6.vercel.app/) - Nền tảng ôn luyện & thi thử chứng chỉ tin học quốc tế trực tuyến.
  - [AI Trip Planner](https://ai-trip-planner-web-snowy.vercel.app/) - Ứng dụng lập lịch trình du lịch thông minh với Google Gemini AI.
  - [AI Mock Interview](https://github.com/tranthinh2607/ai-mock-interview) - Hệ thống mô phỏng phỏng vấn kỹ thuật với AI & Web Speech API.
  - [CHECK-LICENCE](https://github.com/tranthinh2607/CHECK-LICENCE) - Công cụ tự động hóa rà soát và kiểm tra bản quyền hệ thống & phần mềm.
- **Chứng chỉ kỹ thuật thực tế:** Trưng bày 100% chứng chỉ được cấp bởi Google, Cisco Networking Academy, University of Michigan kèm bản xem trước và file PDF gốc có thể tải về.
- **Tối ưu hóa hiệu năng:** Xây dựng trên nền tảng Next.js 16 App Router mới nhất, Core Web Vitals tối ưu, responsive 100% trên mọi thiết bị.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Hạng mục | Công nghệ chính |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components) |
| **Thư viện UI** | [React 19](https://react.dev/) |
| **Ngôn ngữ** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/) (`@theme inline`, Dark mode) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment & Hosting**| [Vercel](https://vercel.com/) |

---

## 📂 Cấu Trúc Thư Mục (Project Structure)

```text
myprofile/
├── public/
│   └── images/
│       ├── about/          # Hình ảnh thực tế các giai đoạn học tập & làm việc
│       ├── chung chi/      # Ảnh chứng chỉ và file PDF gốc (Google, Cisco, Michigan)
│       └── project.jpg     # Ảnh đại diện cho các dự án thực tế
├── src/
│   ├── app/
│   │   ├── globals.css     # Cấu hình Tailwind CSS v4 & Theme variables
│   │   ├── layout.tsx      # Root Layout & Metadata SEO
│   │   └── page.tsx        # Trang chủ lắp ráp các Section
│   ├── components/
│   │   ├── icons/          # Social Icons SVG đồng bộ (GitHub, Facebook, etc.)
│   │   ├── layout/         # Header (Navbar) & Footer
│   │   └── sections/       # Hero, Metrics, Journey (Tiểu sử), Projects, Certificates, Contact
│   ├── data/
│   │   └── profile-data.ts # Nguồn dữ liệu trung tâm (Single Source of Truth)
│   └── types/
│       └── profile.ts      # TypeScript interfaces định nghĩa cấu trúc dữ liệu
├── package.json
└── README.md
```

---

## 💻 Cài Đặt & Chạy Môi Trường Phát Triển (Getting Started)

### 1. Yêu cầu tiên quyết
- [Node.js](https://nodejs.org/) (phiên bản 18.18 trở lên hoặc Node 20+)
- Trình quản lý gói: `npm`, `pnpm`, hoặc `yarn`

### 2. Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### 3. Chạy server phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### 4. Build sản phẩm (Production)
```bash
npm run build
npm run start
```

---

## 📬 Thông Tin Liên Hệ (Contact & Connect)

- **Họ và tên:** TRẦN MAI TRƯỜNG THỊNH
- **Địa điểm:** TP. Hồ Chí Minh, Việt Nam
- **Số điện thoại:** (+84) 395 243 133
- **Email:** [tranmaitruongthinh2607@gmail.com](mailto:tranmaitruongthinh2607@gmail.com)
- **GitHub:** [https://github.com/tranthinh2607](https://github.com/tranthinh2607)
- **Facebook:** [https://facebook.com/tmtthinh204](https://facebook.com/tmtthinh204)

---

<p align="center">
  <sub>© 2026 Trần Mai Trường Thịnh. Thiết kế & phát triển với Next.js & Tailwind CSS.</sub>
</p>