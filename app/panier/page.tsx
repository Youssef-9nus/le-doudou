"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { usePanier } from "@/lib/panier-context";
import { formaterPrix } from "@/lib/produits";

export default function PanierPage() {
  const {
    articles,
    ajouterAuPanier,
    retirerDuPanier,
    supprimerDuPanier,
    total,
    nombreArticles,
  } = usePanier();

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
          <div className="flex-1 flex flex-col gap-6">
            {articles.map((article) => {
              const imagePrincipale =
                article.produit.images && article.produit.images.length > 0
                  ? article.produit.images[0]
                  : `/produits/${article.produit.id}.jpeg`;

              return (
                <div
                  key={`${article.produit.id}-${article.couleur}-${article.taille}`}
                  className="flex gap-5 border-b border-white/10 pb-6"
                >
                  <div className="relative w-24 h-32 bg-zinc-900 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src={imagePrincipale}
                      alt={article.produit.nom}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-white">
                        {article.produit.nom}
                      </h3>
                      <p className="text-white/40 text-sm mt-1">
                        {article.couleur} - {article.taille}
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
                          aria-label="Diminuer la quantité"
                        >
                          -
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
                          aria-label="Augmenter la quantité"
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
                            supprimerDuPanier(
                              article.produit.id,
                              article.couleur,
                              article.taille
                            )
                          }
                          className="text-white/20 hover:text-red-400 transition-colors"
                          aria-label="Supprimer cet article du panier"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
                  <span className="text-green-400">À confirmer</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-medium text-base">
                  <span>Total articles</span>
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
                Commande finalisée via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
