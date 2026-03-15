import "server-only";

import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { kv } from "@vercel/kv";
import { getPumpAgent, USDC_MINT, QUERY_PRICE_USDC } from "@/lib/pump-agent";

/**
 * POST /api/agent/payment/verify — Verify a payment on-chain
 *
 * After the user signs and sends the payment transaction, this endpoint
 * validates that the payment landed on-chain via the PumpAgent SDK.
 * On success, increments KV revenue counters and marks the invoice as verified.
 *
 * Body: { invoiceId: string, txSignature: string }
 * Returns: { verified: true, invoiceId } on success
 *
 * KV keys updated on success:
 *   revenue:total_earned — cumulative USDC earned (string)
 *   revenue:query_count — total verified payments (number)
 *   invoice:{invoiceId} — marked verified with txSignature
 */

interface VerifyRequestBody {
  invoiceId: string;
  txSignature: string;
}

interface StoredInvoice {
  invoiceId: string;
  action: string;
  userPublicKey: string;
  amount: number;
  memo: number;
  startTime: number;
  endTime: number;
  verified: boolean;
  consumed: boolean;
  createdAt: string;
  txSignature?: string;
  verifiedAt?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerifyRequestBody;

    if (!body.invoiceId || typeof body.invoiceId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'invoiceId' field", phase: "verify" },
        { status: 400 }
      );
    }

    if (!body.txSignature || typeof body.txSignature !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'txSignature' field", phase: "verify" },
        { status: 400 }
      );
    }

    // Look up stored invoice
    let invoice: StoredInvoice | null = null;
    try {
      invoice = await kv.get<StoredInvoice>(`invoice:${body.invoiceId}`);
    } catch {
      console.warn(`[payment] KV unavailable — cannot look up invoice ${body.invoiceId}`);
    }
    if (!invoice) {
      console.error(
        `[payment] Verify failed — invoice not found: ${body.invoiceId}`
      );
      return NextResponse.json(
        { error: "Invoice not found", phase: "verify" },
        { status: 404 }
      );
    }

    if (invoice.verified) {
      console.log(
        `[payment] Invoice already verified: ${body.invoiceId}`
      );
      return NextResponse.json({ verified: true, invoiceId: body.invoiceId });
    }

    const { agent } = getPumpAgent();

    // Validate payment on-chain via SDK
    console.log(
      `[payment] Validating invoice on-chain: ${body.invoiceId}, ` +
        `tx=${body.txSignature.slice(0, 16)}...`
    );

    const isValid = await agent.validateInvoicePayment({
      user: new PublicKey(invoice.userPublicKey),
      currencyMint: USDC_MINT,
      amount: invoice.amount,
      memo: invoice.memo,
      startTime: invoice.startTime,
      endTime: invoice.endTime,
    });

    if (!isValid) {
      console.error(
        `[payment] On-chain validation failed: ${body.invoiceId}`
      );
      return NextResponse.json(
        {
          error: "Payment not found on-chain or invalid",
          phase: "verify",
          invoiceId: body.invoiceId,
        },
        { status: 402 }
      );
    }

    // Mark invoice as verified + increment revenue counters (graceful if KV unavailable)
    try {
      await kv.set(`invoice:${body.invoiceId}`, {
        ...invoice,
        verified: true,
        txSignature: body.txSignature,
        verifiedAt: new Date().toISOString(),
      });

      const currentEarned = (await kv.get<string>("revenue:total_earned")) || "0";
      const newEarned = (
        parseFloat(currentEarned) + QUERY_PRICE_USDC
      ).toFixed(USDC_DECIMALS_DISPLAY);
      await kv.set("revenue:total_earned", newEarned);
      await kv.incr("revenue:query_count");

      console.log(
        `[payment] Invoice verified: ${body.invoiceId}, ` +
          `total_earned=${newEarned} USDC, tx=${body.txSignature.slice(0, 16)}...`
      );
    } catch {
      console.warn(`[payment] KV unavailable — invoice ${body.invoiceId} verified on-chain but KV not updated`);
    }

    return NextResponse.json({ verified: true, invoiceId: body.invoiceId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[payment] Verification failed: ${message}`);
    return NextResponse.json(
      { error: "Payment verification failed", phase: "verify" },
      { status: 500 }
    );
  }
}

/** Display precision for USDC amounts */
const USDC_DECIMALS_DISPLAY = 6;
