import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3002";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: "이미지 의미 편집실",
    description: "같은 이미지의 편집 방법과 전달 효과를 비교하는 초등 5~6학년 국어·미술 학습실",
    openGraph: {
      title: "이미지 의미 편집실",
      description: "무엇이 더 보이고, 먼저 눈에 띄고, 어떻게 느껴질까요?",
      images: [{ url: new URL("/og.png", base).toString(), width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "이미지 의미 편집실",
      description: "같은 이미지, 다른 편집, 달라지는 전달 효과",
      images: [new URL("/og.png", base).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
