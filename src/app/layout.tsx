'use client';

import React from 'react';
import { weddingConfig } from '../config/wedding-config';
import Watermark from '../lib/watermark';
import { GlobalStyle } from '../styles/globalStyles';
import CacheManager from '../components/CacheManager';
import AudioPlayer from "../components/AudioPlayer";
import ImageProtection from "../components/ImageProtection";

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
        
        {/* 📌 Open Graph 메타 태그 (카카오톡, 슬랙 썸네일) - 다중 설정 */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={weddingConfig.meta.title} />
        <meta property="og:description" content={weddingConfig.meta.description} />
        
        {/* 📌 이미지 URL 다중 설정 (카카오톡 호환성) - 타임스탬프로 캐시 방지 */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="엄규철과 김유진의 웨딩 청첩장" />
        
        {/* 📌 URL 및 사이트 정보 */}
        <meta property="og:url" content="https://ekckyj-wedding.vercel.app" />
        <meta property="og:site_name" content="웨딩 청첩장" />
        
        {/* 📌 Twitter Card 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={weddingConfig.meta.title} />
        <meta name="twitter:description" content={weddingConfig.meta.description} />
        <meta name="twitter:image" content={`https://ekckyj-wedding.vercel.app${weddingConfig.meta.ogImage}`} />
        <meta name="twitter:image:alt" content="엄규철과 김유진의 웨딩 청첩장" />
        
        {/* 📌 카카오톡 전용 메타 태그 */}
        <meta name="kakao:title" content={weddingConfig.meta.title} />
        <meta name="kakao:description" content={weddingConfig.meta.description} />
        <meta name="kakao:image" content={`https://ekckyj-wedding.vercel.app${weddingConfig.meta.ogImage}`} />
        
        {/* 📌 추가 호환성 메타 태그 */}
        <meta name="application-name" content="웨딩 청첩장" />
        <meta name="apple-mobile-web-app-title" content="웨딩 청첩장" />
        <meta name="msapplication-TileImage" content={`https://ekckyj-wedding.vercel.app${weddingConfig.meta.ogImage}`} />
        <meta name="msapplication-TileColor" content="#f8f6f0" />
        
        {/* 📌 추가 Open Graph 메타 태그 */}
        <meta property="og:updated_time" content={new Date().toISOString()} />
        <meta property="og:see_also" content="https://ekckyj-wedding.vercel.app" />
        
        {/* 📌 카카오톡 모바일 호환성을 위한 추가 메타 태그 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 📌 이미지 캐시 방지를 위한 타임스탬프 */}
        <meta property="og:image" content={`https://ekckyj-wedding.vercel.app${weddingConfig.meta.ogImage}?v=${Date.now()}`} />
        <meta property="og:image:url" content={`https://ekckyj-wedding.vercel.app${weddingConfig.meta.ogImage}?v=${Date.now()}`} />
        <meta property="og:image:secure_url" content={`https://ekckyj-wedding.vercel.app${weddingConfig.meta.ogImage}?v=${Date.now()}`} />
        
        {/* 📌 추가 메타 태그 */}
        <meta name="author" content="엄규철 & 김유진" />
        <meta name="keywords" content="웨딩, 결혼식, 청첩장, 엄규철, 김유진, 2026" />
        <meta property="og:locale" content="ko_KR" />
        
        {/* 📌 추가 보안 메타 태그 */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

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
        <ImageProtection />

        <div className="jwk-watermark" aria-hidden="true">
          JWK-Wedding-{watermarkId}-NonCommercial
        </div>
        <Watermark />
        {children}
      </body>
    </html>
  );
}
