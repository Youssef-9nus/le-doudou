"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Produit {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  couleurs: string[];
  tailles: string[];
  description: string;
  nouveaute: boolean;
  soldOut: boolean;
  image: string;
  stock: number;
}

interface Commande {
  id: string;
  created_at: string;
  client_nom: string;
  client_telephone: string;
  client_adresse: string;
  produits: any[];
  total: number;
  statut: string;
}

const PASSWORD = "doudou2025";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [onglet, setOnglet] = useState<"produits" | "commandes">("commandes");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalProduit, setModalProduit] = useState<Produit | null>(null);
  const [nouveauProduit, setNouveauProduit] = useState(false);
  const [formData, setFormData] = useState<Partial<Produit>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const login = () => {
    if (passwordInput === PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  useEffect(() => {
    if (authenticated) {
      chargerProduits();
      chargerCommandes();
    }
  }, [authenticated]);

  const chargerProduits = async () => {
    setLoading(true);
    const { data } = await supabase.from("produits").select("*").order("id");
    if (data) setProduits(data);
    setLoading(false);
  };

  const chargerCommandes = async () => {
    const { data } = await supabase
      .from("commandes")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setCommandes(data);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("produits")
      .upload(fileName, file, { upsert: true });

    if (error) {
      setMessage("❌ Erreur upload : " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("produits").getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    setFormData((prev) => ({ ...prev, image: publicUrl }));
    setPreviewImage(publicUrl);
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };

  const ouvrirEdition = (produit: Produit) => {
    setModalProduit(produit);
    setFormData({ ...produit });
    setPreviewImage(produit.image || "");
    setNouveauProduit(false);
  };

  const ouvrirNouveauProduit = () => {
    setFormData({
      id: "",
      nom: "",
      prix: 0,
      categorie: "",
      couleurs: [],
      tailles: ["XS", "S", "M", "L", "XL"],
      description: "Un essentiel intemporel pour compléter votre garde-robe.",
      nouveaute: false,
      soldOut: false,
      image: "",
      stock: 0,
    });
    setPreviewImage("");
    setNouveauProduit(true);
    setModalProduit({} as Produit);
  };

  const sauvegarderProduit = async () => {
    setSaving(true);
    if (nouveauProduit) {
      const { error } = await supabase.from("produits").insert([formData]);
      if (error) {
        setMessage("❌ Erreur : " + error.message);
      } else {
        setMessage("✅ Produit ajouté !");
        setModalProduit(null);
        chargerProduits();
      }
    } else {
      const { error } = await supabase
        .from("produits")
        .update(formData)
        .eq("id", formData.id);
      if (error) {
        setMessage("❌ Erreur : " + error.message);
      } else {
        setMessage("✅ Produit mis à jour !");
        setModalProduit(null);
        chargerProduits();
      }
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const supprimerProduit = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await supabase.from("produits").delete().eq("id", id);
    chargerProduits();
  };

  const changerStatut = async (id: string, statut: string) => {
    await supabase.from("commandes").update({ statut }).eq("id", id);
    chargerCommandes();
  };

  const couleurStatut = (statut: string) => {
    switch (statut) {
      case "en_attente": return "bg-yellow-500/20 text-yellow-400";
      case "confirme": return "bg-blue-500/20 text-blue-400";
      case "expedie": return "bg-purple-500/20 text-purple-400";
      case "livre": return "bg-green-500/20 text-green-400";
      case "annule": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/50";
    }
  };

  const totalRevenu = commandes
    .filter((c) => c.statut !== "annule")
    .reduce((acc, c) => acc + (c.total || 0), 0);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase text-center mb-3">Espace</p>
          <h1 className="text-3xl font-bold tracking-tight text-white text-center mb-8">Administrateur</h1>
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
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-1">Le Doudou</p>
          <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
        </div>
        <button onClick={() => setAuthenticated(false)} className="text-white/30 text-xs tracking-widest uppercase hover:text-white transition-colors">
          Déconnexion
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Produits", value: produits.length },
          { label: "Commandes", value: commandes.length },
          { label: "En attente", value: commandes.filter((c) => c.statut === "en_attente").length },
          { label: "Revenu total", value: totalRevenu.toLocaleString("fr-FR") + " FCFA" },
        ].map((stat) => (
          <div key={stat.label} className="border border-white/10 rounded-2xl p-4">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-1">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-2 border-b border-white/10 mb-6">
          {(["commandes", "produits"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOnglet(o)}
              className={`px-4 py-3 text-xs tracking-widest uppercase transition-colors ${onglet === o ? "text-white border-b-2 border-white" : "text-white/30 hover:text-white"}`}
            >
              {o}
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-4 text-sm text-white/70 border border-white/10 rounded-xl px-4 py-3">{message}</div>
        )}

        {onglet === "commandes" && (
          <div className="space-y-3 pb-12">
            {commandes.length === 0 && (
              <p className="text-white/30 text-center py-16">Aucune commande pour l&apos;instant.</p>
            )}
            {commandes.map((c) => (
              <div key={c.id} className="border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-semibold">{c.client_nom}</p>
                    <p className="text-white/40 text-sm">{c.client_telephone}</p>
                    <p className="text-white/40 text-sm">{c.client_adresse}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{(c.total || 0).toLocaleString("fr-FR")} FCFA</p>
                    <p className="text-white/30 text-xs">{new Date(c.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                {c.produits && (
                  <div className="border-t border-white/5 pt-3 space-y-1">
                    {c.produits.map((p: any, i: number) => (
                      <p key={i} className="text-white/50 text-sm">
                        {p.nom} × {p.quantite} — {p.taille} — {p.couleur}
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full ${couleurStatut(c.statut)}`}>
                    {c.statut.replace("_", " ")}
                  </span>
                  <select
                    value={c.statut}
                    onChange={(e) => changerStatut(c.id, e.target.value)}
                    className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="en_attente" className="bg-black">En attente</option>
                    <option value="confirme" className="bg-black">Confirmé</option>
                    <option value="expedie" className="bg-black">Expédié</option>
                    <option value="livre" className="bg-black">Livré</option>
                    <option value="annule" className="bg-black">Annulé</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {onglet === "produits" && (
          <div className="pb-12">
            <div className="flex justify-end mb-4">
              <button
                onClick={ouvrirNouveauProduit}
                className="bg-white text-black px-5 py-2 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors"
              >
                + Ajouter un produit
              </button>
            </div>
            {loading && <p className="text-white/30 text-center py-16">Chargement...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produits.map((p) => (
                <div key={p.id} className="border border-white/10 rounded-2xl overflow-hidden">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.nom}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{p.nom}</p>
                        <p className="text-white/40 text-sm">{p.categorie}</p>
                      </div>
                      <p className="font-bold text-sm">{p.prix.toLocaleString("fr-FR")} FCFA</p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {p.nouveaute && <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded-full">Nouveauté</span>}
                      {p.soldOut && <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Sold Out</span>}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => ouvrirEdition(p)}
                        className="flex-1 border border-white/20 text-white/60 text-xs py-2 rounded-xl hover:border-white/50 hover:text-white transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => supprimerProduit(p.id)}
                        className="border border-red-500/30 text-red-400 text-xs px-4 py-2 rounded-xl hover:border-red-500/60 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalProduit !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-bold">
              {nouveauProduit ? "Nouveau produit" : "Modifier le produit"}
            </h2>

            {/* Upload photo */}
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Photo du produit</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors overflow-hidden relative"
              >
                {previewImage ? (
                  <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <p className="text-white/40 text-2xl mb-2">📷</p>
                    <p className="text-white/30 text-xs">Appuyer pour choisir une photo</p>
                    <p className="text-white/20 text-xs mt-1">Galerie ou appareil photo</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <p className="text-white text-sm">Upload en cours...</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewImage && (
                <button
                  onClick={() => { setPreviewImage(""); setFormData(prev => ({ ...prev, image: "" })); }}
                  className="mt-2 text-white/30 text-xs hover:text-white/60 transition-colors"
                >
                  Supprimer la photo
                </button>
              )}
            </div>

            {[
              { label: "ID (ex: article_10)", key: "id", type: "text", disabled: !nouveauProduit },
              { label: "Nom", key: "nom", type: "text" },
              { label: "Prix (FCFA)", key: "prix", type: "number" },
              { label: "Catégorie", key: "categorie", type: "text" },
              { label: "Description", key: "description", type: "text" },
              { label: "Stock", key: "stock", type: "number" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">{field.label}</label>
                <input
                  type={field.type}
                  disabled={field.disabled}
                  value={(formData as any)[field.key] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.key]: field.type === "number" ? parseInt(e.target.value) : e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-white/30 disabled:opacity-30"
                />
              </div>
            ))}

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.nouveaute || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nouveaute: e.target.checked }))}
                />
                Nouveauté
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soldOut || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, soldOut: e.target.checked }))}
                />
                Sold Out
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalProduit(null)}
                className="flex-1 border border-white/20 text-white/60 py-3 rounded-xl text-sm hover:border-white/40 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={sauvegarderProduit}
                disabled={saving || uploading}
                className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
