"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Produit } from "@/lib/produits";

export type ArticlePanier = {
  produit: Produit;
  quantite: number;
  couleur: string;
  taille: string;
};

type PanierContextType = {
  articles: ArticlePanier[];
  ajouterAuPanier: (produit: Produit, couleur: string, taille: string) => void;
  retirerDuPanier: (id: string, couleur: string, taille: string) => void;
  total: number;
  nombreArticles: number;
};

const PanierContext = createContext<PanierContextType | null>(null);

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);

  const ajouterAuPanier = useCallback(
    (produit: Produit, couleur: string, taille: string) => {
      setArticles((prev) => {
        const existant = prev.find(
          (a) =>
            a.produit.id === produit.id &&
            a.couleur === couleur &&
            a.taille === taille
        );
        if (existant) {
          return prev.map((a) =>
            a.produit.id === produit.id &&
            a.couleur === couleur &&
            a.taille === taille
              ? { ...a, quantite: a.quantite + 1 }
              : a
          );
        }
        return [...prev, { produit, quantite: 1, couleur, taille }];
      });
    },
    []
  );

  const retirerDuPanier = useCallback(
    (id: string, couleur: string, taille: string) => {
      setArticles((prev) =>
        prev
          .map((a) =>
            a.produit.id === id && a.couleur === couleur && a.taille === taille
              ? { ...a, quantite: a.quantite - 1 }
              : a
          )
          .filter((a) => a.quantite > 0)
      );
    },
    []
  );

  const total = articles.reduce(
    (sum, a) => sum + a.produit.prix * a.quantite,
    0
  );
  const nombreArticles = articles.reduce((sum, a) => sum + a.quantite, 0);

  return (
    <PanierContext.Provider
      value={{ articles, ajouterAuPanier, retirerDuPanier, total, nombreArticles }}
    >
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error("usePanier doit être utilisé dans PanierProvider");
  return ctx;
}
