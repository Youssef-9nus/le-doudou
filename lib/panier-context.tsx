"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  supprimerDuPanier: (id: string, couleur: string, taille: string) => void;
  viderPanier: () => void;
  total: number;
  nombreArticles: number;
};

const PanierContext = createContext<PanierContextType | null>(null);
const PANIER_STORAGE_KEY = "le-doudou-panier";

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);
  const [panierCharge, setPanierCharge] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      try {
        const panierSauvegarde = window.localStorage.getItem(PANIER_STORAGE_KEY);
        if (panierSauvegarde) {
          const articlesSauvegardes = JSON.parse(panierSauvegarde);
          if (Array.isArray(articlesSauvegardes)) {
            setArticles(
              articlesSauvegardes.filter(
                (article) =>
                  article?.produit?.id &&
                  article?.produit?.nom &&
                  Number.isFinite(article?.produit?.prix) &&
                  Number.isFinite(article?.quantite) &&
                  article.quantite > 0
              )
            );
          }
        }
      } catch (error) {
        console.error("Impossible de charger le panier:", error);
        window.localStorage.removeItem(PANIER_STORAGE_KEY);
      } finally {
        setPanierCharge(true);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (!panierCharge) return;
    window.localStorage.setItem(PANIER_STORAGE_KEY, JSON.stringify(articles));
  }, [articles, panierCharge]);

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

  const supprimerDuPanier = useCallback(
    (id: string, couleur: string, taille: string) => {
      setArticles((prev) =>
        prev.filter(
          (a) =>
            !(
              a.produit.id === id &&
              a.couleur === couleur &&
              a.taille === taille
            )
        )
      );
    },
    []
  );

  const viderPanier = useCallback(() => {
    setArticles([]);
  }, []);

  const total = articles.reduce(
    (sum, a) => sum + a.produit.prix * a.quantite,
    0
  );
  const nombreArticles = articles.reduce((sum, a) => sum + a.quantite, 0);

  return (
    <PanierContext.Provider
      value={{
        articles,
        ajouterAuPanier,
        retirerDuPanier,
        supprimerDuPanier,
        viderPanier,
        total,
        nombreArticles,
      }}
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
