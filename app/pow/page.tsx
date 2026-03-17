import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PowContent } from "./pow-content";

export const metadata = {
  title: "Proof of Work — DRIP",
  description:
    "Daily execution log — everything DRIP shipped, integrated, and built. Transparent progress tracking.",
};

export default function ProofOfWork() {
  return (
    <>
      <NavBar />
      <main className="pt-24">
        <PowContent />
      </main>
      <Footer />
    </>
  );
}
