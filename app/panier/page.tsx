"use client";

import Link from "next/link";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { usePanier } from "@/lib/panier-context";
import { formaterPrix } from "@/lib/produits";


export default function PanierPage() {
  const { articles, ajouterAuPanier, retirerDuPanier, total, nombreArticles } = usePanier();

  if (articles.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <ShoppingBag size={48} className="text-white/20" />
        <p className="text-white/40 text-lg">Votre panier est vide.</p>
        <Link
          href="/boutique"
          className="text-sm tracking-widest uppercase border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all"
        >
          Voir la boutique
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/boutique"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Continuer mes achats
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">
            Panier{" "}
            <span className="text-white/30 font-light">({nombreArticles})</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Articles */}
          <div className="flex-1 flex flex-col gap-6">
            {articles.map((article) => (
              <div
                key={`${article.produit.id}-${article.couleur}-${article.taille}`}
                className="flex gap-5 border-b border-white/10 pb-6"
              >
                {/* Image placeholder */}
                <div className="w-24 h-32 bg-zinc-900 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-white/10 font-black text-2xl">LD</span>
                </div>

                {/* Détails */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-white">{article.produit.nom}</h3>
                    <p className="text-white/40 text-sm mt-1">
                      {article.couleur} · {article.taille}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          retirerDuPanier(
                            article.produit.id,
                            article.couleur,
                            article.taille
                          )
                        }
                        className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all"
                      >
                        −
                      </button>
                      <span className="text-white w-4 text-center">
                        {article.quantite}
                      </span>
                      <button
                        onClick={() =>
                          ajouterAuPanier(
                            article.produit,
                            article.couleur,
                            article.taille
                          )
                        }
                        className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-white font-medium">
                        {formaterPrix(article.produit.prix * article.quantite)}
                      </span>
                      <button
                        onClick={() =>
                          retirerDuPanier(
                            article.produit.id,
                            article.couleur,
                            article.taille
                          )
                        }
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récap commande */}
          <div className="lg:w-72">
            <div className="border border-white/10 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-6 tracking-wide">
                Récapitulatif
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-white/60">
                  <span>Sous-total</span>
                  <span>{formaterPrix(total)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Livraison</span>
                  <span className="text-green-400">Gratuite</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>{formaterPrix(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-white/90 transition-colors tracking-wide flex items-center justify-center"
              >
                Commander
              </Link>

              <p className="text-white/30 text-xs text-center mt-4">
                Paiement par Mobile Money · Orange · Wave · MTN
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
