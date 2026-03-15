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
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f14",
          position: "relative",
        }}
      >
        {/* Strong centered radial glow */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(189, 255, 253, 0.15) 0%, rgba(124, 255, 196, 0.06) 35%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Large DRIP gradient text */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: 700,
            fontFamily: "Space Grotesk",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #bdfffd, #7cffc4)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            marginBottom: "20px",
          }}
        >
          DRIP
        </div>

        {/* Announcement title placeholder */}
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            fontFamily: "Space Grotesk",
            color: "#ffffff",
            display: "flex",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Announcement Title Here
        </div>

        {/* Subtle divider */}
        <div
          style={{
            width: "80px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #bdfffd, transparent)",
            marginBottom: "24px",
            display: "flex",
          }}
        />

        {/* Bottom: URL */}
        <div
          style={{
            fontSize: "18px",
            color: "#6abea7",
            display: "flex",
          }}
        >
          drip.surf
        </div>
      </div>
    ),
    { ...SIZE, fonts }
  );
}
