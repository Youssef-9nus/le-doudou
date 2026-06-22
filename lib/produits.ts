export interface Produit {
  id: string;
  nom: string;
  prix: number;
  couleurs: string[];
  tailles: string[];
  categorie: string;
  description: string;
  nouveaute: boolean;
  soldOut: boolean;
  image: string;
}

export function formaterPrix(prix: number): string {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

export const produits: Produit[] = [
  {
    id: "article_1",
    nom: "Article 1",
    prix: 15000,
    couleurs: ["Noir"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "Pantalon",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: true,
    soldOut: false,
    image: "/produits/article_1.jpeg",
  },
  {
    id: "article_2",
    nom: "Article 2",
    prix: 15000,
    couleurs: ["Gris"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "Pantalon",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: true,
    soldOut: false,
    image: "/produits/article_2.jpeg",
  },
  {
    id: "article_3",
    nom: "Article 3",
    prix: 20000,
    couleurs: ["Noir"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "Chemise",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: true,
    soldOut: false,
    image: "/produits/article_3.jpeg",
  },
  {
    id: "article_4",
    nom: "Article 4",
    prix: 18000,
    couleurs: ["Camo"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "T-Shirt",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: true,
    soldOut: false,
    image: "/produits/article_4.jpeg",
  },
  {
    id: "article_5",
    nom: "Article 5",
    prix: 20000,
    couleurs: ["Noir"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "Pantalon",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: false,
    soldOut: false,
    image: "/produits/article_5.jpeg",
  },
  {
    id: "article_6",
    nom: "Article 6",
    prix: 12000,
    couleurs: ["Blanc"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "T-Shirt",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: false,
    soldOut: false,
    image: "/produits/article_6.jpeg",
  },
  {
    id: "article_7",
    nom: "Article 7",
    prix: 15000,
    couleurs: ["Rose"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "Pantalon",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: false,
    soldOut: false,
    image: "/produits/article_7.jpeg",
  },
  {
    id: "article_8",
    nom: "Article 8",
    prix: 20000,
    couleurs: ["Noir"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "Pantalon",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: false,
    soldOut: false,
    image: "/produits/article_8.jpeg",
  },
  {
    id: "article_9",
    nom: "Article 9",
    prix: 18000,
    couleurs: ["Jaune"],
    tailles: ["XS", "S", "M", "L", "XL"],
    categorie: "Chemise",
    description: "Un essentiel intemporel pour compléter votre garde-robe.",
    nouveaute: false,
    soldOut: false,
    image: "/produits/article_9.jpeg",
  },
];

export const categories = [
  { id: "tous", label: "Tous" },
  { id: "Pantalon", label: "Pantalon" },
  { id: "Chemise", label: "Chemise" },
  { id: "T-Shirt", label: "T-Shirt" },
];
