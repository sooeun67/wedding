"use client";

import { useEffect, useRef } from "react";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 페이지가 로드되면 자동재생 시도
    const playAudio = () => {
      audio.play().catch(err => {
        console.log("브라우저에서 자동재생이 차단되었습니다:", err);
      });
    };

    // iOS/모바일은 첫 터치 후에만 재생되므로, 초기 시도 + 이벤트 리스너 추가
    playAudio();
    document.addEventListener("click", playAudio, { once: true });
    document.addEventListener("touchstart", playAudio, { once: true });

    return () => {
      document.removeEventListener("click", playAudio);
      document.removeEventListener("touchstart", playAudio);
    };
  }, []);

  return (
    <audio ref={audioRef} src="/music/wedding.mp3" loop />
  );
};

export default MusicPlayer;
