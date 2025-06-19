// src/app/layout.tsx
import "./globals.css";
import "github-markdown-css/github-markdown-light.css";
import "antd/dist/reset.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "borad",
  description: "Create Next App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div style={styles.container}>{children}</div>
      </body>
    </html>
  );
}

const styles = {
  container: {
    padding: "32px 24px",
    maxWidth: "1440px",
    margin: "0 auto",
    // padding: "0 16px", // 모바일에서 여백
    minHeight: "100vh",
    backgroundColor: "#fff", // 필요시
  },
};
