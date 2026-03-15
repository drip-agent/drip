import { ImageResponse } from "next/og";
import { getOgFonts } from "@/lib/og-fonts";

export const runtime = "edge";

const SIZE = { width: 1500, height: 500 };

export async function GET() {
  const fonts = await getOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(90deg, #0a0f14 0%, #111820 50%, #0a0f14 100%)",
          position: "relative",
        }}
      >
        {/* Centered radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(189, 255, 253, 0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Lockup: icon + DRIP text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "16px",
          }}
        >
          {/* Small droplet icon */}
          <svg width="64" height="64" viewBox="0 0 64 64">
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
            <ellipse
              cx="28"
              cy="34"
              rx="6"
              ry="8"
              fill="#ffffff"
              opacity="0.15"
            />
          </svg>

          {/* DRIP gradient text */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #bdfffd, #7cffc4)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            DRIP
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: "#6abea7",
            fontWeight: 400,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          Value Drops Quietly
        </div>
      </div>
    ),
    { ...SIZE, fonts }
  );
}
