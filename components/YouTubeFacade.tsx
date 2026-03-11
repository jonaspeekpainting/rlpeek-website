"use client";

import { useState } from "react";
import { Box } from "@mantine/core";

const VIDEO_ID = "yRXdkSUL4Ps";
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/sddefault.jpg`;

export function YouTubeFacade() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <Box
        component="div"
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
          maxWidth: "100%",
          borderRadius: 8,
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
          title="RL Peek Painting"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={() => setPlaying(true)}
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        maxWidth: "100%",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        display: "block",
        width: "100%",
        background: "var(--mantine-color-gray-2)",
      }}
      aria-label="Play RL Peek Painting video"
    >
      <img
        src={THUMBNAIL}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loading="lazy"
        decoding="async"
      />
      <Box
        component="span"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 68,
          height: 48,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        aria-hidden
      >
        <svg viewBox="0 0 68 48" width="68" height="48" style={{ marginLeft: 4 }}>
          <path fill="#f00" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.1 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.46 0 24 0 24s.06 10.54 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.9-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.54 68 24 68 24s-.06-10.54-1.48-16.26z" />
          <path fill="#fff" d="M45 24L27 14v20" />
        </svg>
      </Box>
    </Box>
  );
}
