"use client";

import { Card, Typography } from "antd";
import Image from "next/image";

const { Title, Text } = Typography;

type PostCardProps = {
  title: string;
  image: string;
  date: string;
  author: string;
  summary: string;
};

export default function PostCard({
  title,
  image,
  date,
  author,
  summary,
}: PostCardProps) {
  return (
    <Card
      className="post-card"
      hoverable
      style={{
        width: "100%",
        maxWidth: 500,
        height: 420, // ✅ 카드 높이 고정
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      cover={
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 180, // ✅ 이미지 영역 높이 고정
            overflow: "hidden",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Image
            src={image}
            alt={title}
            fill // ✅ 부모를 기준으로 꽉 채움 (position: absolute)
            style={{
              objectFit: "contain",
              borderRadius: "8px 8px 0 0",
            }}
          />
        </div>
      }
    >
      <div>
        <Title level={4} style={{ marginBottom: 8 }}>
          {title}
        </Title>
        <p
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: 15,
            color: "#555",
            minHeight: 72, // ✅ 줄 수 고정 (3줄 * 24px)
          }}
        >
          {summary}
        </p>
      </div>
      <div>
        <Text type="secondary">{date}</Text>
        <br />
        <Text strong>{author}</Text>
      </div>
    </Card>
  );
}
