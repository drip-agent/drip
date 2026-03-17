import { NextResponse } from "next/server";

/**
 * GET /api/market/drip — Fetch $DRIP token market data
 *
 * Uses DexScreener API (indexes pump.fun tokens on Solana).
 * Returns price, market cap, volume, price changes.
 * Cached for 60 seconds.
 */

const DRIP_MINT = process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT || "";
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${DRIP_MINT}`;

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceNative: string;
  priceUsd: string;
  txns: {
    h24: { buys: number; sells: number };
    h1: { buys: number; sells: number };
  };
  volume: { h24: number; h1: number };
  priceChange: { h24: number; h1: number; h6: number; m5: number };
  liquidity: { usd: number; base: number; quote: number };
  fdv: number;
  marketCap: number;
}

interface MarketData {
  price: string;
  priceUsd: number;
  marketCap: number;
  fdv: number;
  volume24h: number;
  priceChange24h: number;
  priceChange1h: number;
  liquidity: number;
  txns24h: { buys: number; sells: number };
  dexId: string;
  pairAddress: string;
  updatedAt: string;
}

export async function GET() {
  try {
    const res = await fetch(DEXSCREENER_API, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "DexScreener API unavailable", price: null },
        { status: 502 }
      );
    }

    const data = await res.json();
    const pairs: DexScreenerPair[] = data.pairs || [];

    if (pairs.length === 0) {
      return NextResponse.json({
        price: null,
        error: "Token not yet indexed",
        updatedAt: new Date().toISOString(),
      });
    }

    // Pick the pair with highest liquidity
    const best = pairs.sort(
      (a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )[0];

    const market: MarketData = {
      price: best.priceUsd || "0",
      priceUsd: parseFloat(best.priceUsd || "0"),
      marketCap: best.marketCap || 0,
      fdv: best.fdv || 0,
      volume24h: best.volume?.h24 || 0,
      priceChange24h: best.priceChange?.h24 || 0,
      priceChange1h: best.priceChange?.h1 || 0,
      liquidity: best.liquidity?.usd || 0,
      txns24h: best.txns?.h24 || { buys: 0, sells: 0 },
      dexId: best.dexId,
      pairAddress: best.pairAddress,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(market, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[market] Failed to fetch DRIP price: ${message}`);
    return NextResponse.json(
      { error: "Failed to fetch market data", price: null },
      { status: 500 }
    );
  }
}
