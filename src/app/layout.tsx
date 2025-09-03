'use client';

import React, { useEffect, useState } from 'react';
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
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement | null;
    if (audio) {
      // 첫 사용자 클릭 시 음소거 해제 및 재생
      const enableSound = () => {
        audio.muted = false;
        audio.play().catch((err) => console.warn('자동 재생 실패:', err));
        setIsMuted(false);
        document.removeEventListener('click', enableSound);
      };
      document.addEventListener('click', enableSound, { once: true });
    }
  }, []);

  const toggleMute = () => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement | null;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
    }
  };

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
        <meta name="generator" content={`Wedding-Template-${watermarkId}`} />
        <meta name="description" content={metaDescription} />

        {/* 📌 핀치줌 방지 (갤러리 확대 모드 제외용은 따로 제어 가능) */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body>
        <GlobalStyle />
        <CacheManager />

        {/* 🎶 배경 음악 */}
        <audio id="bg-music" src="/music/wedding.mp3" autoPlay loop muted />

        {/* 🔊 음소거/해제 버튼 */}
        <button
          onClick={toggleMute}
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: 1000,
            padding: '0.6rem 1rem',
            borderRadius: '9999px',
            border: 'none',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {isMuted ? '🔇 음악 켜기' : '🔊 음악 끄기'}
        </button>

        <div className="jwk-watermark" aria-hidden="true">
          JWK-Wedding-{watermarkId}-NonCommercial
        </div>
        <Watermark />
        <AudioPlayer />
        {children}
      </body>
    </html>
  );
}
