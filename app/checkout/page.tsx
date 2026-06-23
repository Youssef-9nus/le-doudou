"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { usePanier } from "@/lib/panier-context";
import { formaterPrix } from "@/lib/produits";
import { supabase } from "@/lib/supabase";

type ModePaiement = "orange" | "wave" | "mtn";

const modesPaiement: { id: ModePaiement; label: string; numero: string; couleur: string }[] = [
  { id: "orange", label: "Orange Money", numero: "0777697233", couleur: "bg-orange-500" },
  { id: "wave", label: "Wave", numero: "0777697233", couleur: "bg-blue-500" },
  { id: "mtn", label: "MTN MoMo", numero: "0777697233", couleur: "bg-yellow-400" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { articles, total, nombreArticles, viderPanier } = usePanier();

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    adresse: "",
    commune: "",
    paiement: "" as ModePaiement | "",
  });

  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (articles.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
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

  const valider = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Votre nom est requis";
    if (!form.telephone.trim()) e.telephone = "Votre numéro est requis";
    else if (!/^0[0-9]{9}$/.test(form.telephone.replace(/\s/g, "")))
      e.telephone = "Numéro invalide (ex: 0700000000)";
    if (!form.adresse.trim()) e.adresse = "Votre adresse est requise";
    if (!form.commune.trim()) e.commune = "Votre commune est requise";
    if (!form.paiement) e.paiement = "Choisissez un mode de paiement";
    return e;
  };

  const handleSubmit = async () => {
    const e = valider();
    if (Object.keys(e).length > 0) {
      setErreurs(e);
      return;
    }
    setLoading(true);

    // Enregistrer la commande dans Supabase
    const { error } = await supabase.from("commandes").insert([
      {
        client_nom: form.nom,
        client_telephone: form.telephone,
        client_adresse: `${form.adresse}, ${form.commune}`,
        produits: articles.map((a) => ({
          id: a.produit.id,
          nom: a.produit.nom,
          prix: a.produit.prix,
          couleur: a.couleur,
          taille: a.taille,
          quantite: a.quantite,
        })),
        total: total,
        statut: "en_attente",
      },
    ]);

    if (error) {
      console.error("Erreur commande:", error);
      setLoading(false);
      return;
    }

    viderPanier();
    router.push(
      `/confirmation?nom=${encodeURIComponent(form.nom)}&paiement=${form.paiement}&total=${total}`
    );
  };

  const handleChange = (champ: string, valeur: string) => {
    setForm((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) setErreurs((prev) => ({ ...prev, [champ]: "" }));
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          href="/panier"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 sm:mb-12 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Retour au panier
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">
          Finaliser la commande
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="flex-1 flex flex-col gap-8">

            <section>
              <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-5">Vos informations</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-white/50 mb-2 block">Nom complet</label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    placeholder="Ex : Kouassi Jean"
                    className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors ${erreurs.nom ? "border-red-500/60" : "border-white/10 focus:border-white/40"}`}
                  />
                  {erreurs.nom && <p className="text-red-400 text-xs mt-1.5">{erreurs.nom}</p>}
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase text-white/50 mb-2 block">Numéro de téléphone</label>
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    placeholder="Ex : 0700000000"
                    className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors ${erreurs.telephone ? "border-red-500/60" : "border-white/10 focus:border-white/40"}`}
                  />
                  {erreurs.telephone && <p className="text-red-400 text-xs mt-1.5">{erreurs.telephone}</p>}
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-5">Adresse de livraison</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-white/50 mb-2 block">Quartier / Rue</label>
                  <input
                    type="text"
                    value={form.adresse}
                    onChange={(e) => handleChange("adresse", e.target.value)}
                    placeholder="Ex : Rue des Jardins, Cocody"
                    className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors ${erreurs.adresse ? "border-red-500/60" : "border-white/10 focus:border-white/40"}`}
                  />
                  {erreurs.adresse && <p className="text-red-400 text-xs mt-1.5">{erreurs.adresse}</p>}
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase text-white/50 mb-2 block">Commune</label>
                  <input
                    type="text"
                    value={form.commune}
                    onChange={(e) => handleChange("commune", e.target.value)}
                    placeholder="Ex : Cocody, Yopougon, Plateau..."
                    className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors ${erreurs.commune ? "border-red-500/60" : "border-white/10 focus:border-white/40"}`}
                  />
                  {erreurs.commune && <p className="text-red-400 text-xs mt-1.5">{erreurs.commune}</p>}
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-5">Mode de paiement</p>
              <div className="flex flex-col gap-3">
                {modesPaiement.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleChange("paiement", mode.id)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-200 text-left ${form.paiement === mode.id ? "border-white bg-white/5" : erreurs.paiement ? "border-red-500/40 hover:border-white/30" : "border-white/10 hover:border-white/30"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.paiement === mode.id ? "border-white" : "border-white/20"}`}>
                      {form.paiement === mode.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                    <div className={`w-8 h-8 rounded-full ${mode.couleur} flex-shrink-0`} />
                    <div>
                      <p className="text-sm font-medium text-white">{mode.label}</p>
                      <p className="text-xs text-white/30 mt-0.5">Numéro : {mode.numero}</p>
                    </div>
                  </button>
                ))}
                {erreurs.paiement && <p className="text-red-400 text-xs mt-1">{erreurs.paiement}</p>}
              </div>
            </section>
          </div>

          <div className="lg:w-80">
            <div className="border border-white/10 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-6 tracking-wide">Récapitulatif</h2>

              <div className="flex flex-col gap-3 mb-6">
                {articles.map((article) => (
                  <div key={`${article.produit.id}-${article.couleur}-${article.taille}`} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-3">
                      <p className="text-white/80 leading-tight line-clamp-1">{article.produit.nom}</p>
                      <p className="text-white/30 text-xs mt-0.5">{article.couleur} · {article.taille} · ×{article.quantite}</p>
                    </div>
                    <p className="text-white/70 whitespace-nowrap">{formaterPrix(article.produit.prix * article.quantite)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-white/50">
                  <span>Sous-total ({nombreArticles} article{nombreArticles > 1 ? "s" : ""})</span>
                  <span>{formaterPrix(total)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Livraison</span>
                  <span className="text-green-400">Gratuite</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formaterPrix(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-4 font-semibold tracking-widest uppercase text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${loading ? "bg-white/40 text-black cursor-wait" : "bg-white text-black hover:bg-white/90 active:scale-[0.99]"}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Traitement...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Confirmer la commande
                  </>
                )}
              </button>

              <p className="text-white/20 text-xs text-center mt-4">Paiement sécurisé · Mobile Money</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
