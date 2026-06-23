"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, MessageCircle } from "lucide-react";
import { formaterPrix } from "@/lib/produits";

const labelsPaiement: Record<string, string> = {
  orange: "Orange Money",
  wave: "Wave",
  mtn: "MTN MoMo",
};

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ nom?: string; paiement?: string; total?: string }>;
}) {
  const params = use(searchParams);
  const nom = params.nom ?? "Client";
  const paiement = params.paiement ?? "mobile";
  const total = Number(params.total ?? 0);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-8">

        {/* Icône succès */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-400" strokeWidth={1.5} />
          </div>
          {/* Cercle animé */}
          <div className="absolute inset-0 rounded-full border border-green-500/20 animate-ping" />
        </div>

        {/* Message principal */}
        <div>
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-3">
            Commande confirmée
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Merci, {nom} ! 🎉
          </h1>
          <p className="text-white/50 leading-relaxed text-sm">
            Votre commande a bien été reçue. Nous allons vous contacter rapidement
            pour confirmer la livraison.
          </p>
        </div>

        {/* Récap paiement */}
        <div className="w-full border border-white/10 rounded-xl p-6 text-left space-y-4">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-4">
            Détails de la commande
          </p>

          <div className="flex justify-between text-sm">
            <span className="text-white/50">Mode de paiement</span>
            <span className="text-white font-medium">
              {labelsPaiement[paiement] ?? paiement}
            </span>
          </div>

          <div className="flex justify-between text-sm border-t border-white/10 pt-4">
            <span className="text-white/50">Montant total</span>
            <span className="text-white font-semibold text-base">
              {formaterPrix(total)}
            </span>
          </div>

          {/* Instructions paiement */}
          <div className="bg-zinc-900 rounded-lg p-4 mt-2">
            <p className="text-xs text-white/40 mb-2 tracking-widest uppercase">
              Instruction de paiement
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              Envoyez{" "}
              <span className="text-white font-semibold">{formaterPrix(total)}</span>{" "}
              via{" "}
              <span className="text-white font-semibold">
                {labelsPaiement[paiement] ?? paiement}
              </span>{" "}
              au numéro{" "}
              <span className="text-white font-bold tracking-wider">0777697233</span>
              , puis envoyez la capture de votre paiement sur WhatsApp.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/2250777697233?text=Bonjour%2C%20j'ai%20pass%C3%A9%20une%20commande%20de%20${formaterPrix(total).replace(/ /g, "%20")}%20via%20${labelsPaiement[paiement] ?? paiement}.%20Mon%20nom%20est%20${encodeURIComponent(nom)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-lg transition-colors tracking-wide flex items-center justify-center gap-2 text-sm uppercase"
          >
            <MessageCircle size={17} />
            Envoyer la preuve sur WhatsApp
          </a>

          {/* Continuer les achats */}
          <Link
            href="/boutique"
            className="w-full border border-white/15 hover:border-white/40 text-white/60 hover:text-white font-medium py-4 rounded-lg transition-all tracking-wide flex items-center justify-center gap-2 text-sm uppercase"
          >
            <ShoppingBag size={16} />
            Continuer mes achats
          </Link>
        </div>

        <p className="text-white/20 text-xs">
          © 2025 Le Doudou — Abidjan, Côte d&apos;Ivoire
        </p>
      </div>
    </main>
  );
}
