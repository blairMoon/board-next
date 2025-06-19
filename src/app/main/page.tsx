import { Row, Col, Typography } from "antd";
import PostCard from "../../components/PostCard";
import AppHeader from "./../../components/header";
import Link from "next/link";

const { Title } = Typography;

interface Post {
  id: number;
  title: string;
  thumbnail?: string;
  content: string;

  createdAt: string;
  author: {
    name: string;
  };
}

export default async function MainPage() {
  let posts: Post[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
      cache: "no-store", // 🔁 SSR을 위해 캐싱 비활성화
    });
    posts = await res.json();
    console.log("✅ 게시글 목록:", posts);
  } catch (err) {
    console.error("❌ 게시글 가져오기 실패:", err);
  }
  const stripMarkdown = (markdown: string) => {
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // 이미지 제거
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크 텍스트만 남기기
      .replace(/[#>*`~\-_\+=]+/g, "") // 제목, 인용, 코드, 리스트 기호 제거
      .replace(/\n{2,}/g, "\n") // 연속된 줄바꿈 하나로
      .replace(/\n/g, " ") // 줄바꿈 제거
      .trim();
  };
  const truncate = (text: string, maxLength = 100) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div style={styles.container}>
      <AppHeader />
      <Row gutter={[24, 24]}>
        {posts.map((post) => (
          <Col key={post.id} xs={24} sm={12} md={8}>
            <Link href={`/posts/${post.id}`} style={{ display: "block" }}>
              <PostCard
                id={post.id}
                title={post.title}
                image={post.thumbnail || "/login.png"}
                date={new Date(post.createdAt).toLocaleDateString()}
                author={post.author.name}
                summary={truncate(stripMarkdown(post.content), 100)} // ✅ 추가
              />
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1440,
    margin: "0 auto",
  },
};
