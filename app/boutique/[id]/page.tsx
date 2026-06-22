"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Check } from "lucide-react";
import { produits, formaterPrix } from "@/lib/produits";
import { usePanier } from "@/lib/panier-context";

export default function ProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const produit = produits.find((p) => p.id === id);

  if (!produit) notFound();

  const { ajouterAuPanier } = usePanier();

  const [couleurChoisie, setCouleurChoisie] = useState(produit.couleurs[0]);
  const [tailleChoisie, setTailleChoisie] = useState("");
  const [ajoute, setAjoute] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [imageActive, setImageActive] = useState(0);

  const handleAjouterAuPanier = () => {
    if (!tailleChoisie) {
      setErreur(true);
      setTimeout(() => setErreur(false), 2000);
      return;
    }
    ajouterAuPanier(produit, couleurChoisie, tailleChoisie);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2500);
  };

  // Produits similaires (même catégorie, sans le produit actuel)
  const similaires = produits
    .filter((p) => p.categorie === produit.categorie && p.id !== produit.id)
    .slice(0, 3);

  // Une seule image par produit
  const images = [`/produits/${produit.id}.jpeg`];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Fil d'ariane */}
        <Link
          href="/boutique"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Retour à la boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Visuel produit */}
          <div className="space-y-3">
            {/* Image principale */}
            <div className="aspect-[3/4] bg-zinc-900 rounded-xl relative overflow-hidden">
              <Image
                src={images[imageActive]}
                alt={produit.nom}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {produit.nouveaute && (
                  <span className="bg-white text-black text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">
                    Nouveau
                  </span>
                )}
                {produit.soldOut && (
                  <span className="bg-zinc-700 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">
                    Épuisé
                  </span>
                )}
              </div>
            </div>

            {/* Vignettes masquées (une seule image par produit) */}
          </div>

          {/* Infos & actions */}
          <div className="flex flex-col gap-8 lg:py-4">
            {/* Nom & prix */}
            <div>
              <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-3">
                {produit.categorie}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {produit.nom}
              </h1>
              <p className="text-2xl font-light mt-4 text-white/90">
                {formaterPrix(produit.prix)}
              </p>
            </div>

            {/* Description */}
            <p className="text-white/50 leading-relaxed text-sm border-t border-white/10 pt-6">
              {produit.description}
            </p>

            {/* Choix couleur */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-widest uppercase text-white/60">
                  Couleur
                </p>
                <p className="text-xs text-white/40">{couleurChoisie}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {produit.couleurs.map((couleur) => (
                  <button
                    key={couleur}
                    onClick={() => setCouleurChoisie(couleur)}
                    className={`px-4 py-2 text-xs rounded-lg border transition-all duration-200 ${
                      couleurChoisie === couleur
                        ? "bg-white text-black border-white font-semibold"
                        : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
                    }`}
                  >
                    {couleur}
                  </button>
                ))}
              </div>
            </div>

            {/* Choix taille */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-widest uppercase text-white/60">
                  Taille
                </p>
                {!tailleChoisie && (
                  <p
                    className={`text-xs transition-colors ${
                      erreur ? "text-red-400" : "text-white/30"
                    }`}
                  >
                    {erreur ? "⚠ Choisissez une taille" : "Sélectionnez une taille"}
                  </p>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {produit.tailles.map((taille) => (
                  <button
                    key={taille}
                    onClick={() => setTailleChoisie(taille)}
                    className={`min-w-[52px] h-11 px-3 text-sm rounded-lg border transition-all duration-200 ${
                      tailleChoisie === taille
                        ? "bg-white text-black border-white font-semibold"
                        : erreur && !tailleChoisie
                        ? "border-red-500/50 text-white/60 hover:border-white/50 hover:text-white"
                        : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
                    }`}
                  >
                    {taille}
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton Ajouter au panier */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAjouterAuPanier}
                disabled={produit.soldOut ?? false}
                className={`w-full py-4 font-semibold tracking-widest uppercase text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  produit.soldOut
                    ? "bg-zinc-800 text-white/30 cursor-not-allowed"
                    : ajoute
                    ? "bg-green-500 text-white"
                    : "bg-white text-black hover:bg-white/90 active:scale-[0.99]"
                }`}
              >
                {produit.soldOut ? (
                  "Épuisé"
                ) : ajoute ? (
                  <>
                    <Check size={18} strokeWidth={2.5} />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    <ShoppingBag size={17} />
                    Ajouter au panier
                  </>
                )}
              </button>

              <Link
                href="/panier"
                className="w-full py-4 text-sm font-medium tracking-widest uppercase border border-white/20 rounded-lg text-white/60 hover:border-white/50 hover:text-white transition-all flex items-center justify-center"
              >
                Voir mon panier
              </Link>
            </div>

            {/* Infos livraison */}
            <div className="border-t border-white/10 pt-6 space-y-2">
              <div className="flex items-center gap-3 text-sm text-white/40">
                <span className="text-base">📦</span>
                <span>Livraison dans toute la Côte d&apos;Ivoire</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <span className="text-base">📱</span>
                <span>Paiement Mobile Money — Orange, Wave, MTN</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <span className="text-base">↩️</span>
                <span>Retour sous 7 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {similaires.length > 0 && (
          <section className="mt-24 border-t border-white/10 pt-16">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-2">
                  De la même famille
                </p>
                <h2 className="text-2xl font-bold">Vous aimerez aussi</h2>
              </div>
              <Link
                href="/boutique"
                className="text-white/40 text-sm hover:text-white tracking-widest uppercase transition-colors"
              >
                Tout voir →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {similaires.map((p) => (
                <Link
                  key={p.id}
                  href={`/boutique/${p.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-zinc-900 rounded-lg mb-3 relative overflow-hidden">
                    <Image
                      src={`/produits/${p.id}.jpeg`}
                      alt={p.nom}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    {p.nouveaute && (
                      <span className="absolute top-2 left-2 bg-white text-black text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase z-10">
                        Nouveau
                      </span>
                    )}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-white/70 transition-colors">
                    {p.nom}
                  </h3>
                  <p className="text-white/40 text-sm mt-1">{formaterPrix(p.prix)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
