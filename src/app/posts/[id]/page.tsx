"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Modal, Typography, Card, Spin, message, Button, Space } from "antd";
import ReactMarkdown from "react-markdown";
import AppHeader from "./../../../components/header";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { Title, Text } = Typography;
const { confirm } = Modal;

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorId: number; // <- 직접 추가 가능
  author: {
    id: number;
    name: string;
  };
}

interface User {
  id: number;
  name: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 게시글 가져오기
  useEffect(() => {
    if (!id) return;
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("게시글 불러오기 실패");
        return res.json();
      })
      .then((data) => setPost(data))
      .catch(() => message.error("게시글을 불러오는 데 실패했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  // 로그인된 사용자 정보 가져오기
  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include", // ✅ 쿠키 자동 첨부 (HttpOnly 쿠키를 위해 꼭 필요)
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => setCurrentUser(user))
      .catch(() => console.warn("로그인 사용자 정보 불러오기 실패"));
  }, []);

  const showDeleteConfirm = () => {
    confirm({
      title: "🗑 정말 삭제하시겠어요?",
      icon: <ExclamationCircleFilled style={{ color: "#5f0080" }} />,
      content: "이 작업은 되돌릴 수 없습니다.",
      okText: "삭제하기",
      cancelText: "취소",
      okType: "danger",
      centered: true,
      // 스타일 커스터마이징
      style: {
        borderRadius: 12,
      },
      okButtonProps: {
        style: {
          backgroundColor: "#5f0080",
          borderColor: "#5f0080",
        },
      },
      cancelButtonProps: {
        style: {
          borderRadius: 8,
        },
      },
      async onOk() {
        try {
          const res = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error();
          message.success("삭제 완료!");
          router.push("/main");
        } catch {
          message.error("삭제 실패");
        }
      },
      onCancel() {
        console.log("삭제 취소");
      },
    });
  };
  if (loading) {
    return (
      <div style={styles.container}>
        <AppHeader />
        <Spin tip="게시글 불러오는 중..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={styles.container}>
        <AppHeader />
        <Title level={4}>❌ 게시글을 찾을 수 없습니다.</Title>
      </div>
    );
  }

  const isAuthor = currentUser && currentUser.id === post.authorId;
  console.log(currentUser.id);
  console.log(post.authorId);
  return (
    <div style={styles.container}>
      <AppHeader />

      <Card style={styles.card}>
        <div style={styles.headerRow}>
          <Title level={2} style={{ margin: 0, fontSize: "48px" }}>
            {post.title}
          </Title>
          {isAuthor && (
            <Space>
              <Button
                style={{
                  backgroundColor: "white", // 원하는 보라색
                  color: "#5f0080", // 글자색
                  borderColor: "#9280ae", // 테두리색
                }}
                type="primary"
                onClick={() => router.push(`/write?id=${post.id}`)}
              >
                수정
              </Button>
              <Button
                danger
                style={{
                  backgroundColor: "white", // 원하는 보라색
                  color: "#ca5753", // 글자색
                  borderColor: "#ca5753", // 테두리색
                }}
                onClick={showDeleteConfirm}
              >
                삭제
              </Button>
            </Space>
          )}
        </div>

        <Text type="secondary">
          {post.author.name} | {new Date(post.createdAt).toLocaleDateString()}
        </Text>

        <div className="markdown-body" style={styles.content}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1440,
    margin: "0 auto",
    padding: "0px 24px 30px 0px",
  },
  card: {
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  content: {
    marginTop: 24,
    lineHeight: 1.7,
    fontSize: 16,
  },
};
