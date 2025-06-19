"use client";

import { Layout, Avatar, Button } from "antd";
import Image from "next/image";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Header } = Layout;

export default function AppHeader() {
  const router = useRouter();

  const handleWrite = () => {
    router.push("/write"); // ✏️ 글 작성 페이지로 이동
  };
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // 쿠키 포함해서 요청
      });

      if (res.ok) {
        router.push("/login"); // 로그인 페이지로 리디렉션
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };
  return (
    <Header style={styles.header}>
      {/* 왼쪽: 로고 */}
      <Link href="/main">
        <div style={styles.logo}>
          <Image
            src="/board.png"
            alt="Board 로고"
            width={120}
            height={200}
            style={{
              objectFit: "contain",
              borderRadius: 8,
              cursor: "pointer",
            }}
          />
        </div>
      </Link>

      {/* 오른쪽: 글쓰기 버튼 + 유저 정보 */}
      <div style={styles.user}>
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={handleWrite}
          style={styles.writeButton}
        >
          글 작성
        </Button>
        {/* <Avatar
          icon={<UserOutlined />}
          style={{ marginLeft: 16, marginRight: 8 }}
        /> */}
        <Button style={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </Header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    maxWidth: "1440px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "0px 24px 30px 0px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    marginRight: 24,
    width: 200,
    height: 150,
  },
  user: {
    display: "flex",
    alignItems: "center",
  },
  writeButton: {
    backgroundColor: "#5f0080",
    borderColor: "#5f0080",
    color: "white",
    fontWeight: "bold",
    borderRadius: 8,
    height: 40,
    padding: "0 16px",
  },
  logoutButton: {
    marginLeft: "5%",
    backgroundColor: "white",
    borderColor: "#5f0080",
    color: "#5f0080",
    fontWeight: "bold",
    borderRadius: 8,
    height: 40,
    padding: "0 16px",
  },
};
