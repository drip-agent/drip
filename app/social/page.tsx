import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "DRIP — Social Media Kit",
  description:
    "Branded social assets for X/Twitter — profile picture, banner, post templates, and OG image. Preview, download, and use.",
};

/* ─── Social asset data (D019 pattern) ─── */

const socialAssets = [
  {
    name: "Profile Picture",
    description: "Square avatar for X/Twitter profile. Centered droplet icon on dark background with aqua radial glow.",
    width: 800,
    height: 800,
    useCase: "X profile picture, Discord avatar, GitHub avatar",
    route: "/api/social/profile",
    filename: "drip-profile-800x800.png",
  },
  {
    name: "Banner",
    description: "Wide header banner for X/Twitter profile. DRIP lockup centered with tagline, safe zone optimized.",
    width: 1500,
    height: 500,
    useCase: "X profile banner, LinkedIn cover",
    route: "/api/social/banner",
    filename: "drip-banner-1500x500.png",
  },
  {
    name: "Build Update Template",
    description: "Post image for build-in-public updates. BUILD LOG badge with title area, date, hashtag, and URL.",
    width: 1200,
    height: 675,
    useCase: "X post image for build updates, changelog announcements",
    route: "/api/social/template-update",
    filename: "drip-template-update-1200x675.png",
  },
  {
    name: "Announcement Template",
    description: "Post image for major announcements. Large gradient DRIP text with supporting text area and URL.",
    width: 1200,
    height: 675,
    useCase: "X post image for launches, major features, milestones",
    route: "/api/social/template-announcement",
    filename: "drip-template-announcement-1200x675.png",
  },
  {
    name: "Open Graph Image",
    description: "Default OG image used when sharing any DRIP page on social platforms. Branded with droplet and tagline.",
    width: 1200,
    height: 630,
    useCase: "Link previews on X, Slack, Discord, iMessage, LinkedIn",
    route: "/opengraph-image",
    filename: "drip-og-1200x630.png",
  },
] as const;

/* ─── Page ─── */

export default function SocialPage() {
  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-dark-deepest pt-20">
        {/* Header */}
        <Section spacing="compact">
          <Container>
            <p className="font-mono text-xs text-blue-slate uppercase tracking-widest mb-4">
              Social Media Kit
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight">
              Social Assets
            </h1>
            <p className="mt-4 text-lg text-ocean-mist max-w-2xl">
              Branded images for X/Twitter and social platforms. Preview each
              asset below — click download to grab the PNG.
            </p>
          </Container>
        </Section>

        {/* Asset grid */}
        <Section>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {socialAssets.map((asset) => (
                <article
                  key={asset.route}
                  className="bg-dark-surface rounded-card border border-dark-elevated overflow-hidden flex flex-col"
                >
                  {/* Preview image */}
                  <div className="relative bg-dark-deepest border-b border-dark-elevated p-4 flex items-center justify-center min-h-[200px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.route}
                      alt={`${asset.name} — ${asset.width}×${asset.height}`}
                      className="max-w-full h-auto rounded"
                      style={{ maxHeight: 300 }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="font-heading text-lg font-semibold text-white">
                        {asset.name}
                      </h2>
                      <span className="shrink-0 font-mono text-xs text-icy-aqua bg-icy-aqua/10 px-2 py-1 rounded">
                        {asset.width}×{asset.height}
                      </span>
                    </div>

                    <p className="text-sm text-ocean-mist mb-2">
                      {asset.description}
                    </p>

                    <p className="text-xs text-blue-slate mb-6">
                      <span className="font-semibold text-blue-slate/80">Use: </span>
                      {asset.useCase}
                    </p>

                    <div className="mt-auto">
                      <a
                        href={asset.route}
                        download={asset.filename}
                        className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-aquamarine hover:text-icy-aqua transition-colors"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                        Download PNG
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
