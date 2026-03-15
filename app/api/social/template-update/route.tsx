import { ImageResponse } from "next/og";
import { getOgFonts } from "@/lib/og-fonts";

export const runtime = "edge";

const SIZE = { width: 1200, height: 675 };

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
          background: "#111820",
          padding: "48px 56px",
          position: "relative",
        }}
      >
        {/* Subtle centered glow */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(189, 255, 253, 0.06) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top: Logo + BUILD LOG badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Small droplet icon */}
          <svg width="32" height="32" viewBox="0 0 64 64">
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
          </svg>

          {/* BUILD LOG badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #bdfffd",
              borderRadius: "4px",
              padding: "4px 12px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              color: "#bdfffd",
              letterSpacing: "0.08em",
            }}
          >
            BUILD LOG
          </div>
        </div>

        {/* Center: Title area */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              color: "#ffffff",
              lineHeight: 1.2,
              display: "flex",
              textAlign: "center",
            }}
          >
            Day N: Title Here
          </div>
        </div>

        {/* Gradient accent line */}
        <div
          style={{
            width: "100%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #bdfffd, #7cffc4, transparent)",
            marginBottom: "20px",
            display: "flex",
          }}
        />

        {/* Bottom: metadata */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "16px",
            color: "#5e6973",
          }}
        >
          <div style={{ display: "flex" }}>March 2026</div>
          <div style={{ display: "flex" }}>#DRIP #BuildInPublic</div>
          <div style={{ display: "flex" }}>drip.surf</div>
        </div>
      </div>
    ),
    { ...SIZE, fonts }
  );
}
