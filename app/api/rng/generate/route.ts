import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";

/**
 * POST /api/rng/generate
 *
 * Verifies on-chain payment then returns a random number 0-1000.
 * Body: { userWallet, memo, startTime, endTime, amount }
 * Returns: { number: number } on success, { error } on failure
 *
 * ALWAYS verifies server-side — never trust client claims.
 */
export async function POST(req: NextRequest) {
  try {
    const { userWallet, memo, startTime, endTime, amount } = await req.json();

    if (!userWallet || memo == null || startTime == null || endTime == null || amount == null) {
      return NextResponse.json(
        { error: "Missing required fields: userWallet, memo, startTime, endTime, amount" },
        { status: 400 }
      );
    }

    const mintAddress = process.env.AGENT_TOKEN_MINT_ADDRESS;
    const currencyMintAddress = process.env.CURRENCY_MINT;

    if (!mintAddress || !currencyMintAddress) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const agentMint = new PublicKey(mintAddress);
    const currencyMint = new PublicKey(currencyMintAddress);
    const agent = new PumpAgent(agentMint);

    // Verify payment with retries — transactions may take a few seconds
    let verified = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      verified = await agent.validateInvoicePayment({
        user: new PublicKey(userWallet),
        currencyMint,
        amount: Number(amount),
        memo: Number(memo),
        startTime: Number(startTime),
        endTime: Number(endTime),
      });

      if (verified) break;
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!verified) {
      return NextResponse.json(
        { error: "Payment not verified. Please wait a moment and try again." },
        { status: 402 }
      );
    }

    // Payment confirmed — generate random number
    const randomNumber = Math.floor(Math.random() * 1001); // 0-1000 inclusive

    return NextResponse.json({
      number: randomNumber,
      verified: true,
    });
  } catch (err) {
    console.error("rng/generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 }
    );
  }
}
