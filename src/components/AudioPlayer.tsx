"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(err => {
        console.warn("자동재생이 막혔습니다:", err);
      });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 2000 }}>
      <audio ref={audioRef} src="/music/wedding.mp3" autoPlay loop />
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
          fontSize: "20px"
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
