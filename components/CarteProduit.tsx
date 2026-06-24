"use client";

import Link from "next/link";
import Image from "next/image";
import { Produit, formaterPrix } from "@/lib/produits";

const normaliserCouleurs = (couleurs: string[]) =>
  couleurs
    .flatMap((couleur) => couleur.split(/[;,]/))
    .map((couleur) => couleur.trim())
    .filter(Boolean);

export default function CarteProduit({ produit }: { produit: Produit }) {
  const imagePrincipale =
    produit.images && produit.images.length > 0
      ? produit.images[0]
      : `/produits/${produit.id}.jpeg`;
  const couleursDisponibles = normaliserCouleurs(produit.couleurs || []);

  return (
    <Link href={`/boutique/${produit.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden mb-2 sm:mb-4">
        <Image
          src={imagePrincipale}
          alt={produit.nom}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2 z-10">
          {produit.nouveaute && (
            <span className="bg-white text-black text-[9px] sm:text-[10px] font-bold tracking-widest px-1.5 sm:px-2 py-0.5 sm:py-1 uppercase">
              Nouveau
            </span>
          )}
          {produit.soldout && (
            <span className="bg-zinc-700 text-white text-[9px] sm:text-[10px] font-bold tracking-widest px-1.5 sm:px-2 py-0.5 sm:py-1 uppercase">
              Ã‰puisÃ©
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Couleurs */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex gap-1 flex-wrap z-10">
          {couleursDisponibles.slice(0, 3).map((couleur) => (
            <span
              key={couleur}
              className="text-[9px] sm:text-[10px] text-white bg-black/50 backdrop-blur-sm px-1 sm:px-1.5 py-0.5 rounded"
            >
              {couleur.split("/")[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Infos */}
      <div>
        <h3 className="text-white font-medium text-xs sm:text-sm leading-tight group-hover:text-white/70 transition-colors line-clamp-2">
          {produit.nom}
        </h3>
        <p className="text-white/50 text-xs sm:text-sm mt-0.5 sm:mt-1">
          {formaterPrix(produit.prix)}
        </p>
      </div>
    </Link>
  );
}

