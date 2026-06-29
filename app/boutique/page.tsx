"use client";

import { useState, useEffect, useMemo } from "react";
import CarteProduit from "@/components/CarteProduit";
import { supabase } from "@/lib/supabase";
import { categories } from "@/lib/produits";

interface Produit {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  couleurs: string[];
  tailles: string[];
  description: string;
  nouveaute: boolean;
  soldout: boolean;
  images: string[];
  stock: number;
}

export default function BoutiquePage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorieActive, setCategorieActive] = useState("tous");
  const [tri, setTri] = useState<"defaut" | "prix-asc" | "prix-desc" | "nouveautes">("defaut");

  useEffect(() => {
    const charger = async () => {
      const { data } = await supabase.from("produits").select("*");
      if (data) setProduits(data);
      setLoading(false);
    };
    charger();
  }, []);

  const produitsFiltres = useMemo(() => {
    let liste = [...produits];

    if (categorieActive !== "tous") {
      liste = liste.filter((p) => p.categorie === categorieActive);
    }

    switch (tri) {
      case "prix-asc":
        liste.sort((a, b) => a.prix - b.prix);
        break;
      case "prix-desc":
        liste.sort((a, b) => b.prix - a.prix);
        break;
      case "nouveautes":
        liste.sort((a, b) => (b.nouveaute ? 1 : 0) - (a.nouveaute ? 1 : 0));
        break;
    }

    return liste;
  }, [produits, categorieActive, tri]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-6 py-16 max-w-7xl mx-auto">
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-3">
          Collection 2025
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Boutique
        </h1>
        <p className="text-white/40 mt-4 max-w-md">
          {produits.length} pièces — Streetwear premium conçu pour durer.
        </p>
      </section>

      <div className="sticky top-[73px] z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategorieActive(cat.id)}
                className={`text-xs tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                  categorieActive === cat.id
                    ? "bg-white text-black border-white"
                    : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as typeof tri)}
            className="bg-transparent border border-white/20 text-white/60 text-xs tracking-wider uppercase px-3 py-2 rounded-lg focus:outline-none focus:border-white/50 cursor-pointer"
          >
            <option value="defaut" className="bg-black">Trier par défaut</option>
            <option value="nouveautes" className="bg-black">Nouveautés</option>
            <option value="prix-asc" className="bg-black">Prix croissant</option>
            <option value="prix-desc" className="bg-black">Prix décroissant</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-32 text-white/30">
            <p>Chargement...</p>
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="text-center py-32 text-white/30">
            <p className="text-lg">Aucun produit dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {produitsFiltres.map((produit) => (
              <CarteProduit key={produit.id} produit={produit} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
