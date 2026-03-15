import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 800, height: 800 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f14",
          position: "relative",
        }}
      >
        {/* Radial glow behind icon */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "640px",
            height: "640px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(189, 255, 253, 0.12) 0%, rgba(124, 255, 196, 0.06) 40%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Water droplet icon — inlined from logo-icon.svg */}
        <svg
          width="320"
          height="320"
          viewBox="0 0 64 64"
          style={{ position: "relative" }}
        >
          <defs>
            <linearGradient id="drip-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bdfffd" />
              <stop offset="100%" stopColor="#7cffc4" />
            </linearGradient>
          </defs>
          <path
            d="M32 4 C32 4, 14 26, 14 38 A18 18 0 0 0 50 38 C50 26, 32 4, 32 4Z"
            fill="url(#drip-g)"
          />
          <ellipse cx="28" cy="34" rx="6" ry="8" fill="#ffffff" opacity="0.15" />
        </svg>
      </div>
    ),
    { ...SIZE }
  );
}
