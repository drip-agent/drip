/**
 * Shared font-loading utility for ImageResponse (Satori) contexts.
 *
 * Fetches Space Grotesk 700 TTF from Google Fonts API at image generation time.
 * next/font/google CSS variables don't work in Satori — fonts must be loaded
 * as ArrayBuffer and passed to ImageResponse options.
 *
 * On failure, returns null and logs a warning. Satori falls back to its
 * built-in sans-serif, so images still render (just without brand typography).
 */

const GOOGLE_FONTS_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700";

/**
 * Fetch Space Grotesk 700 TTF as an ArrayBuffer.
 * Returns null if the fetch fails for any reason (network, rate limit, etc.).
 */
export async function getSpaceGroteskFont(): Promise<ArrayBuffer | null> {
  try {
    // Step 1: Fetch the CSS that contains the .ttf URL
    // Google Fonts serves different formats based on User-Agent:
    // - Modern browser UA → woff2 (Satori can't read woff2)
    // - No UA / simple UA → woff or nothing
    // - Old IE UA → TrueType (.ttf), which Satori needs
    const cssResponse = await fetch(GOOGLE_FONTS_CSS_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/7.0)",
      },
    });

    if (!cssResponse.ok) {
      console.warn(
        `[og-fonts] Google Fonts CSS fetch failed: ${cssResponse.status} ${cssResponse.statusText}`
      );
      return null;
    }

    const css = await cssResponse.text();

    // Step 2: Extract the font URL from the CSS
    // With the IE UA, Google returns format('truetype') pointing to a .ttf file.
    // Fall back to matching any url() if the specific format isn't found.
    const fontUrlMatch =
      css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?truetype['"]?\)/) ||
      css.match(/src:\s*url\(([^)]+)\)/);

    if (!fontUrlMatch || !fontUrlMatch[1]) {
      console.warn(
        "[og-fonts] Could not extract font URL from Google Fonts CSS"
      );
      return null;
    }

    const fontUrl = fontUrlMatch[1];

    // Step 3: Fetch the actual font binary
    const fontResponse = await fetch(fontUrl);

    if (!fontResponse.ok) {
      console.warn(
        `[og-fonts] Font binary fetch failed: ${fontResponse.status} ${fontResponse.statusText}`
      );
      return null;
    }

    return await fontResponse.arrayBuffer();
  } catch (error) {
    console.warn(
      `[og-fonts] Font loading failed: ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}

/**
 * Build the fonts config array for ImageResponse options.
 * Returns an array with Space Grotesk 700, or an empty array if loading fails.
 *
 * Usage:
 *   const fonts = await getOgFonts();
 *   return new ImageResponse(<JSX />, { ...size, fonts });
 */
export async function getOgFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: 700; style: "normal" }>
> {
  const fontData = await getSpaceGroteskFont();

  if (!fontData) {
    return [];
  }

  return [
    {
      name: "Space Grotesk",
      data: fontData,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}
