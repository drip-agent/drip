import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 675 };

/**
 * Teaser image for Twitter — 1200×675 (16:9)
 * Shows terminal + branding, optimized for engagement
 */
export function GET() {
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
          background: "linear-gradient(160deg, #0a0f14 0%, #0f1a22 40%, #0d1318 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "monospace",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(189,255,253,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(189,255,253,0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow spots */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(189,255,253,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,255,196,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Terminal card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "860px",
            background: "rgba(15, 20, 25, 0.9)",
            border: "1px solid rgba(189,255,253,0.12)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(189,255,253,0.06), 0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Terminal chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(189,255,253,0.08)",
            }}
          >
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(255,95,86,0.7)" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(255,189,46,0.7)" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(39,201,63,0.7)" }} />
            <span style={{ marginLeft: "12px", fontSize: "12px", color: "#5e6973" }}>
              drip-agent — terminal
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "20px 24px" }}>
            {/* Command */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ color: "#7cffc4" }}>❯</span>
              <span style={{ color: "#bdfffd" }}>npx drip-agent research anthropic.com</span>
            </div>
            {/* Loading */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ color: "#5e6973" }}>⠿</span>
              <span style={{ color: "#6abea7" }}>Researching anthropic.com...</span>
            </div>
            {/* Blank */}
            <div style={{ height: "4px" }} />
            {/* Header */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ color: "#9ffff5" }}>  💧 Company Research: Anthropic</span>
            </div>
            <div style={{ height: "2px" }} />
            {/* Data rows */}
            <span style={{ color: "#9ffff5" }}>  Industry:     Artificial Intelligence</span>
            <span style={{ color: "#9ffff5" }}>  Founded:      2021</span>
            <span style={{ color: "#9ffff5" }}>  Employees:    1,000-5,000</span>
            <span style={{ color: "#9ffff5" }}>  Funding:      $7.3B raised</span>
            <span style={{ color: "#9ffff5" }}>  Tech Stack:   Python, React, Kubernetes, GCP</span>
            <div style={{ height: "2px" }} />
            <span style={{ color: "#9ffff5" }}>  Cost: ~$0.05 via AgentCash</span>
          </div>
        </div>

        {/* Branding below terminal */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "28px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "6px",
              background: "linear-gradient(135deg, #bdfffd, #7cffc4)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            DRIP
          </span>
          <span style={{ color: "#5e6973", fontSize: "14px" }}>|</span>
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "3px",
              color: "#6abea7",
              textTransform: "uppercase",
            }}
          >
            Research Intelligence
          </span>
          <span style={{ color: "#5e6973", fontSize: "14px" }}>|</span>
          <span style={{ fontSize: "13px", color: "#5e6973" }}>drip.surf</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
