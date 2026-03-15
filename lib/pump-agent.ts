import "server-only";

import { Connection, PublicKey } from "@solana/web3.js";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";

/**
 * PumpAgent lazy singleton for server-side payment operations.
 *
 * Creates a PumpAgent instance connected to the $DRIP token mint
 * on Solana mainnet. Used by payment routes to build invoices and
 * validate on-chain payments.
 *
 * Required env vars:
 *   NEXT_PUBLIC_DRIP_TOKEN_MINT — Solana address of the $DRIP token
 *   SOLANA_RPC_URL — Solana RPC endpoint (e.g. Helius, Ankr)
 *
 * The agent's private key (PUMP_AGENT_PRIVATE_KEY) is NOT needed for
 * payment acceptance/verification. It's only needed for admin operations
 * (withdraw, distribute) which are handled separately.
 */

/** USDC mint on Solana mainnet */
export const USDC_MINT = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

/** Default price per agent query in USDC (human-readable) */
export const QUERY_PRICE_USDC = 0.05;

/** USDC has 6 decimals on Solana */
export const USDC_DECIMALS = 6;

/** Convert human-readable USDC amount to on-chain units */
export function usdcToUnits(amount: number): bigint {
  return BigInt(Math.round(amount * 10 ** USDC_DECIMALS));
}

// ─── Singleton ──────────────────────────────────────────────────────

let cachedAgent: PumpAgent | null = null;
let cachedConnection: Connection | null = null;

export interface PumpAgentConfig {
  agent: PumpAgent;
  connection: Connection;
  tokenMint: PublicKey;
}

export function getPumpAgent(): PumpAgentConfig {
  if (cachedAgent && cachedConnection) {
    const mintStr = process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT!;
    return {
      agent: cachedAgent,
      connection: cachedConnection,
      tokenMint: new PublicKey(mintStr),
    };
  }

  const mintStr = process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT || "DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump";

  const rpcUrl = process.env.SOLANA_RPC_URL || "https://rpc.solanatracker.io/public";

  const tokenMint = new PublicKey(mintStr);
  const connection = new Connection(rpcUrl, "confirmed");
  const agent = new PumpAgent(tokenMint, "mainnet", connection);

  cachedAgent = agent;
  cachedConnection = connection;

  console.log(
    `[pump-agent] Initialized PumpAgent — mint=${tokenMint.toBase58()}, rpc=${rpcUrl.replace(/\/\/.*@/, "//***@")}`
  );

  return { agent, connection, tokenMint };
}
