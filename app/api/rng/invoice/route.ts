import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";

/**
 * POST /api/rng/invoice
 *
 * Builds a Solana payment transaction for the RNG service.
 * Body: { userWallet: string }
 * Returns: { transaction: string (base64), invoice: { memo, startTime, endTime, amount } }
 */
export async function POST(req: NextRequest) {
  try {
    const { userWallet } = await req.json();

    if (!userWallet || typeof userWallet !== "string") {
      return NextResponse.json(
        { error: "Missing userWallet" },
        { status: 400 }
      );
    }

    const rpcUrl = process.env.SOLANA_RPC_URL;
    const mintAddress = process.env.AGENT_TOKEN_MINT_ADDRESS;
    const currencyMintAddress = process.env.CURRENCY_MINT;
    const priceAmount = Number(process.env.PRICE_AMOUNT) || 100_000_000; // 0.1 SOL

    if (!rpcUrl || !mintAddress || !currencyMintAddress) {
      console.error("rng/invoice: missing env vars", {
        rpcUrl: !!rpcUrl,
        mintAddress: !!mintAddress,
        currencyMintAddress: !!currencyMintAddress,
      });
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const connection = new Connection(rpcUrl);
    const agentMint = new PublicKey(mintAddress);
    const currencyMint = new PublicKey(currencyMintAddress);
    const userPublicKey = new PublicKey(userWallet);

    const agent = new PumpAgent(agentMint, "mainnet", connection);

    // Generate unique invoice params
    const memo = Math.floor(Math.random() * 900_000_000_000) + 100_000;
    const now = Math.floor(Date.now() / 1000);
    const startTime = now;
    const endTime = now + 86400; // 24 hours

    const instructions = await agent.buildAcceptPaymentInstructions({
      user: userPublicKey,
      currencyMint,
      amount: String(priceAmount),
      memo: String(memo),
      startTime: String(startTime),
      endTime: String(endTime),
    });

    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userPublicKey;
    tx.add(...instructions);

    const serializedTx = tx
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    return NextResponse.json({
      transaction: serializedTx,
      invoice: {
        memo,
        startTime,
        endTime,
        amount: priceAmount,
      },
    });
  } catch (err) {
    console.error("rng/invoice error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to build invoice" },
      { status: 500 }
    );
  }
}
