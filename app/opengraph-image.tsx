import { ImageResponse } from "next/og";

export const alt = "DRIP — Value Drops Quietly";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(145deg, #0a0f14 0%, #111820 50%, #0a0f14 100%)",
          position: "relative",
        }}
      >
        {/* Subtle glow accent */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(189, 255, 253, 0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* DRIP title */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #bdfffd, #7cffc4)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            marginBottom: "16px",
          }}
        >
          DRIP
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "rgba(189, 255, 253, 0.7)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          Value Drops Quietly
        </div>

        {/* Subtle divider */}
        <div
          style={{
            width: "80px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #bdfffd, transparent)",
            marginTop: "24px",
            display: "flex",
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.4)",
            marginTop: "20px",
            display: "flex",
          }}
        >
          Autonomous Research Agents
        </div>
      </div>
    ),
    { ...size }
  );
}
