"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-8">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <MessageCircle size={40} className="text-green-400" strokeWidth={1.5} />
        </div>

        <div>
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-3">
            Commande WhatsApp
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Finalisation sur WhatsApp
          </h1>
          <p className="text-white/50 leading-relaxed text-sm">
            Les paiements ne sont plus effectues sur le site. Finalisez votre commande
            directement avec Le Doudou sur WhatsApp.
          </p>
        </div>

        <Link
          href="/boutique"
          className="w-full border border-white/15 hover:border-white/40 text-white/60 hover:text-white font-medium py-4 rounded-lg transition-all tracking-wide flex items-center justify-center gap-2 text-sm uppercase"
        >
          <ShoppingBag size={16} />
          Continuer mes achats
        </Link>
      </div>
    </main>
  );
}
