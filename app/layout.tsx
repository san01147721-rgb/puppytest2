import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 스마트 펫 집사 - 킁킁이 대시보드",
  description: "실시간 AI 케어 시스템으로 킁킁이를 지켜보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
