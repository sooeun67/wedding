"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true); // 시작은 음소거

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // 첫 사용자 클릭 시 음소거 해제 & 재생 허용
      const enableSound = () => {
        audio.muted = false;
        audio.play().catch(err => {
          console.warn("자동재생 실패:", err);
        });
        setMuted(false);
        document.removeEventListener("click", enableSound);
      };
      document.addEventListener("click", enableSound, { once: true });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 2000 }}>
      <audio ref={audioRef} src="/music/wedding.mp3" autoPlay loop muted />
      <button
        onClick={toggleMute}
        style={{
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          cursor: "pointer",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.8)";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.6)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
