import "server-only";

import { NextResponse } from "next/server";
import { PublicKey, Transaction } from "@solana/web3.js";
import { kv } from "@vercel/kv";
import {
  getPumpAgent,
  USDC_MINT,
  QUERY_PRICE_USDC,
  usdcToUnits,
} from "@/lib/pump-agent";

/**
 * POST /api/agent/payment — Create a payment invoice
 *
 * Builds Solana transaction instructions for a user to pay for an agent query.
 * The client receives a serialized unsigned transaction to sign with their wallet.
 *
 * Body: { action: string, userPublicKey: string }
 * Returns: { invoiceId, serializedTransaction, amount, currency }
 *
 * Flow: client calls this → receives tx → signs with wallet → sends to Solana →
 *       calls /api/agent/payment/verify with the invoice details
 */

interface PaymentRequestBody {
  action: string;
  userPublicKey: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PaymentRequestBody;

    if (!body.action || typeof body.action !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'action' field", phase: "invoice" },
        { status: 400 }
      );
    }

    if (!body.userPublicKey || typeof body.userPublicKey !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'userPublicKey' field", phase: "invoice" },
        { status: 400 }
      );
    }

    let userPubkey: PublicKey;
    try {
      userPubkey = new PublicKey(body.userPublicKey);
    } catch {
      return NextResponse.json(
        { error: "Invalid Solana public key", phase: "invoice" },
        { status: 400 }
      );
    }

    const { agent, connection } = getPumpAgent();

    // Generate unique invoice parameters
    const memo = Date.now();
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600; // 1 hour validity window
    const amount = usdcToUnits(QUERY_PRICE_USDC);
    const invoiceId = `inv_${memo}_${userPubkey.toBase58().slice(0, 8)}`;

    console.log(
      `[payment] Creating invoice: id=${invoiceId}, action=${body.action}, ` +
        `user=${userPubkey.toBase58().slice(0, 8)}..., amount=${QUERY_PRICE_USDC} USDC`
    );

    // Build payment instructions via SDK
    const instructions = await agent.buildAcceptPaymentInstructions({
      user: userPubkey,
      currencyMint: USDC_MINT,
      amount,
      memo,
      startTime,
      endTime,
    });

    // Build unsigned transaction for client signing
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubkey;
    for (const ix of instructions) {
      transaction.add(ix);
    }

    const serializedTransaction = transaction
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    // Store invoice details in KV for later verification (graceful if KV unconfigured)
    try {
      await kv.set(`invoice:${invoiceId}`, {
        invoiceId,
        action: body.action,
        userPublicKey: body.userPublicKey,
        amount: Number(amount),
        memo,
        startTime,
        endTime,
        verified: false,
        consumed: false,
        createdAt: new Date().toISOString(),
      });
    } catch {
      console.warn(`[payment] KV unavailable — invoice ${invoiceId} stored in-memory only`);
    }

    console.log(`[payment] Invoice created: ${invoiceId}`);

    return NextResponse.json({
      invoiceId,
      serializedTransaction,
      amount: QUERY_PRICE_USDC.toString(),
      currency: "USDC",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[payment] Invoice creation failed: ${message}`);
    return NextResponse.json(
      { error: "Failed to create payment invoice", phase: "invoice" },
      { status: 500 }
    );
  }
}
