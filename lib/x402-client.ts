import "server-only";

import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { toClientEvmSigner } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

/**
 * x402 payment-wrapped fetch factory.
 *
 * Creates a fetch function that automatically handles HTTP 402 responses
 * by signing payment payloads with the configured wallet. Uses Base Sepolia
 * (testnet) for the EVM payment scheme.
 *
 * Lazy singleton — created on first call, reused thereafter.
 * Missing X402_PRIVATE_KEY → clear error at initialization, not silent failure.
 */

let cachedFetch: typeof fetch | null = null;

export function createX402Fetch(): typeof fetch {
  if (cachedFetch) return cachedFetch;

  const privateKey = process.env.X402_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "[x402-client] X402_PRIVATE_KEY env var is required. " +
        "Set it to a 0x-prefixed hex private key for the payment wallet."
    );
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const signer = toClientEvmSigner(account, publicClient);

  const client = new x402Client();
  registerExactEvmScheme(client, {
    signer,
    networks: ["eip155:84532"],
  });

  cachedFetch = wrapFetchWithPayment(fetch, client);
  return cachedFetch;
}
