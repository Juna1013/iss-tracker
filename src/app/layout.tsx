import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISS位置追跡システム",
  description: "国際宇宙ステーションの現在位置をリアルタイムで追跡",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
