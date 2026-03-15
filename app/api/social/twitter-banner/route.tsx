import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1500, height: 500 };

/**
 * Twitter/X header banner — 1500×500
 * Dark background with antigravity droplets and DRIP branding
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
          background: "linear-gradient(135deg, #0a0f14 0%, #0f1a22 40%, #0d1318 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow spots */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(189,255,253,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "300px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,255,196,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(189,255,253,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(189,255,253,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Left section — Antigravity droplet */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: "80px",
          }}
        >
          {/* Inverted droplet shape using CSS */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(135deg)",
              background: "linear-gradient(135deg, #bdfffd, #7cffc4)",
              boxShadow: "0 0 60px rgba(189,255,253,0.2), 0 0 120px rgba(189,255,253,0.08)",
            }}
          />
          {/* Small ascending drops */}
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(135deg)",
                background: "#9ffff5",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(135deg)",
                background: "#bdfffd",
                opacity: 0.35,
              }}
            />
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#7cffc4",
                opacity: 0.3,
              }}
            />
          </div>
        </div>

        {/* Right section — Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "12px",
              background: "linear-gradient(135deg, #bdfffd 0%, #7cffc4 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1,
            }}
          >
            DRIP
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "6px",
              color: "#6abea7",
              marginTop: "12px",
              textTransform: "uppercase",
            }}
          >
            Research Intelligence
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "3px",
                color: "#5e6973",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: "1px solid rgba(189,255,253,0.12)",
                borderRadius: "4px",
              }}
            >
              $DRIP
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "3px",
                color: "#5e6973",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: "1px solid rgba(189,255,253,0.12)",
                borderRadius: "4px",
              }}
            >
              drip.surf
            </div>
          </div>
        </div>

        {/* Floating particles across the banner */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "180px",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#bdfffd",
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "100px",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#9ffff5",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "120px",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#7cffc4",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "400px",
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            background: "#bdfffd",
            opacity: 0.15,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
