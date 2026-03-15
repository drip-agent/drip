import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 800, height: 800 };

/**
 * Twitter/X profile picture — 800×800
 * Antigravity droplet on dark background
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0a0f14 0%, #0f1a22 50%, #0d1318 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Center glow aura */}
        <div
          style={{
            position: "absolute",
            top: "150px",
            left: "200px",
            width: "400px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(189,255,253,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Main antigravity droplet — large, center */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "-40px",
          }}
        >
          {/* Inverted droplet (point down = floating up) */}
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(135deg)",
              background: "linear-gradient(135deg, #bdfffd 0%, #9ffff5 40%, #7cffc4 100%)",
              boxShadow:
                "0 0 80px rgba(189,255,253,0.2), 0 0 160px rgba(189,255,253,0.08), inset -20px -20px 40px rgba(255,255,255,0.08)",
            }}
          />

          {/* Ascending micro-drops below main */}
          <div
            style={{
              display: "flex",
              gap: "30px",
              marginTop: "40px",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(135deg)",
                background: "#9ffff5",
                opacity: 0.55,
              }}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(135deg)",
                background: "#bdfffd",
                opacity: 0.4,
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#7cffc4",
                opacity: 0.35,
              }}
            />
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#bdfffd",
                opacity: 0.25,
              }}
            />
          </div>

          {/* Ripple lines */}
          <div
            style={{
              width: "120px",
              height: "3px",
              borderRadius: "50%",
              marginTop: "30px",
              background:
                "linear-gradient(90deg, transparent, rgba(159,255,245,0.15), transparent)",
            }}
          />
          <div
            style={{
              width: "80px",
              height: "2px",
              borderRadius: "50%",
              marginTop: "8px",
              background:
                "linear-gradient(90deg, transparent, rgba(189,255,253,0.1), transparent)",
            }}
          />
        </div>

        {/* Subtle floating particles */}
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "180px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#bdfffd",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "200px",
            left: "140px",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#7cffc4",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "250px",
            left: "120px",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#9ffff5",
            opacity: 0.18,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
