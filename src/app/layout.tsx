'use client';

import React from 'react';
import { weddingConfig } from '../config/wedding-config';
import Watermark from '../lib/watermark';
import { GlobalStyle } from '../styles/globalStyles';
import CacheManager from '../components/CacheManager';
import AudioPlayer from "../components/AudioPlayer";

const watermarkId = weddingConfig.meta._jwk_watermark_id || 'JWK-NonCommercial';
const metaDescription = '웨딩 청첩장 - 비상업적 용도';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="ko">
      <head>
        {/* 📌 폰트 프리로드 유지 */}
        <link
          rel="preload"
          href="/fonts/PlayfairDisplay-Italic.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MaruBuri-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        
        {/* 📌 중요 이미지 프리로드 (메인 이미지) */}
        <link
          rel="preload"
          href={weddingConfig.main.image}
          as="image"
          type="image/jpeg"
        />
        
        {/* 📌 갤러리 첫 번째 이미지들 프리로드 */}
        {weddingConfig.gallery.images.slice(0, 3).map((image, index) => (
          <link
            key={index}
            rel="preload"
            href={image}
            as="image"
            type="image/jpeg"
          />
        ))}
        <meta name="generator" content={`Wedding-Template-${watermarkId}`} />
        <meta name="description" content={metaDescription} />

        {/* 📌 핀치줌 방지 (갤러리 확대 모드 제외용은 따로 제어 가능) */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        
        {/* 📌 DNS 프리페치로 연결 속도 개선 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* 📌 연결 프리페치 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <GlobalStyle />
        <CacheManager />
        <AudioPlayer />

        <div className="jwk-watermark" aria-hidden="true">
          JWK-Wedding-{watermarkId}-NonCommercial
        </div>
        <Watermark />
        {children}
      </body>
    </html>
  );
}
