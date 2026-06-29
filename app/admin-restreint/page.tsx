"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProduitCommande {
  nom?: string;
  quantite?: number;
  taille?: string;
  couleur?: string;
}

interface Commande {
  id: string;
  created_at: string;
  client_nom: string;
  client_telephone: string;
  client_adresse: string;
  produits: ProduitCommande[];
  total: number;
  statut: string;
}

const PASSWORD = "stats2025";

export default function AdminRestreintPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [nombreVisites, setNombreVisites] = useState(0);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (passwordInput === PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    const chargerDonnees = async () => {
      setLoading(true);

      const [{ data: commandesData }, { count }] = await Promise.all([
        supabase
          .from("commandes")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("visites")
          .select("*", { count: "exact", head: true }),
      ]);

      setCommandes(commandesData ?? []);
      setNombreVisites(count ?? 0);
      setLoading(false);
    };

    void chargerDonnees();
  }, [authenticated]);

  const totalRevenu = commandes
    .filter((commande) => commande.statut !== "annule")
    .reduce((acc, commande) => acc + (commande.total || 0), 0);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase text-center mb-3">Espace</p>
          <h1 className="text-3xl font-bold tracking-tight text-white text-center mb-8">Admin restreint</h1>
          <div className="border border-white/10 rounded-2xl p-6 space-y-4">
            <input
              type="password"
              placeholder="Mot de passe"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-white/30 placeholder:text-white/20"
            />
            {passwordError && <p className="text-red-400 text-xs">Mot de passe incorrect.</p>}
            <button
              onClick={login}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-1">Le Doudou</p>
          <h1 className="text-2xl font-bold tracking-tight">Statistiques et commandes</h1>
        </div>
        <button onClick={() => setAuthenticated(false)} className="text-white/30 text-xs tracking-widest uppercase hover:text-white transition-colors">
          Deconnexion
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Visites", value: nombreVisites.toLocaleString("fr-FR") },
          { label: "Commandes", value: commandes.length },
          { label: "En attente", value: commandes.filter((commande) => commande.statut === "en_attente").length },
          { label: "Revenu total", value: totalRevenu.toLocaleString("fr-FR") + " FCFA" },
        ].map((stat) => (
          <div key={stat.label} className="border border-white/10 rounded-2xl p-4">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-1">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-end justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-2">Lecture seule</p>
            <h2 className="text-xl font-semibold">Liste des commandes</h2>
          </div>
          {loading && <p className="text-white/30 text-sm">Chargement...</p>}
        </div>

        {commandes.length === 0 && !loading && (
          <p className="text-white/30 text-center py-16">Aucune commande pour l&apos;instant.</p>
        )}

        <div className="space-y-3">
          {commandes.map((commande) => (
            <div key={commande.id} className="border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-semibold">{commande.client_nom}</p>
                  <p className="text-white/40 text-sm">{commande.client_telephone}</p>
                  <p className="text-white/40 text-sm">{commande.client_adresse}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{(commande.total || 0).toLocaleString("fr-FR")} FCFA</p>
                  <p className="text-white/30 text-xs">{new Date(commande.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              {commande.produits && (
                <div className="border-t border-white/5 pt-3 space-y-1">
                  {commande.produits.map((produit, index) => (
                    <p key={index} className="text-white/50 text-sm">
                      {produit.nom} x {produit.quantite} - {produit.taille} - {produit.couleur}
                    </p>
                  ))}
                </div>
              )}

              <span className="inline-flex text-xs px-3 py-1 rounded-full bg-white/10 text-white/60">
                {commande.statut?.replace("_", " ") || "statut inconnu"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
