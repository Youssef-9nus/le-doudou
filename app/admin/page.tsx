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
  soldout: boolean;
  images: string[];
  stock: number;
}

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

const PASSWORD = "doudou2025";

type ChampProduit = {
  label: string;
  key: keyof Pick<Produit, "id" | "nom" | "prix" | "categorie" | "description" | "stock">;
  type: "text" | "number";
  disabled?: boolean;
};

const nettoyerListe = (valeur: string) =>
  valeur
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);

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
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [couleurInput, setCouleurInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const login = () => {
    if (passwordInput === PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

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

  useEffect(() => {
    if (authenticated) {
      void Promise.resolve().then(() => {
        chargerProduits();
        chargerCommandes();
      });
    }
  }, [authenticated]);

  // Upload d'une seule image -> renvoie l'URL publique
  const uploadUneImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("produits")
      .upload(fileName, file, { upsert: true });

    if (error) {
      setMessage("âŒ Erreur upload : " + error.message);
      return null;
    }

    const { data } = supabase.storage.from("produits").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Upload de plusieurs images sÃ©lectionnÃ©es d'un coup (galerie multi-sÃ©lection)
  const uploadImages = async (files: FileList) => {
    setUploading(true);
    setMessage("");
    const urls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const url = await uploadUneImage(file);
        if (url) urls.push(url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
      setPreviewImages((prev) => [...prev, ...urls]);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) uploadImages(files);
    // reset pour pouvoir re-sÃ©lectionner les mÃªmes fichiers si besoin
    e.target.value = "";
  };

  const supprimerImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const deplacerImageEnPremier = (index: number) => {
    setPreviewImages((prev) => {
      const arr = [...prev];
      const [img] = arr.splice(index, 1);
      arr.unshift(img);
      return arr;
    });
    setFormData((prev) => {
      const arr = [...(prev.images || [])];
      const [img] = arr.splice(index, 1);
      arr.unshift(img);
      return { ...prev, images: arr };
    });
  };

  const modifierCouleurs = (valeur: string) => {
    setFormData((prev) => ({
      ...prev,
      couleurs: nettoyerListe(valeur),
    }));
  };

  const ajouterCouleur = () => {
    const couleur = couleurInput.trim();
    if (!couleur) return;

    setFormData((prev) => {
      const couleursActuelles = prev.couleurs || [];
      if (couleursActuelles.some((item) => item.toLowerCase() === couleur.toLowerCase())) {
        return prev;
      }
      return { ...prev, couleurs: [...couleursActuelles, couleur] };
    });
    setCouleurInput("");
  };

  const retirerCouleur = (couleur: string) => {
    setFormData((prev) => ({
      ...prev,
      couleurs: (prev.couleurs || []).filter((item) => item !== couleur),
    }));
  };

  const modifierTailles = (valeur: string) => {
    setFormData((prev) => ({
      ...prev,
      tailles: nettoyerListe(valeur),
    }));
  };

  const ouvrirEdition = (produit: Produit) => {
    setModalProduit(produit);
    setFormData({ ...produit });
    setPreviewImages(produit.images || []);
    setCouleurInput("");
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
      description: "Un essentiel intemporel pour complÃ©ter votre garde-robe.",
      nouveaute: false,
      soldout: false,
      images: [],
      stock: 0,
    });
    setPreviewImages([]);
    setCouleurInput("");
    setNouveauProduit(true);
    setModalProduit({} as Produit);
  };

  const sauvegarderProduit = async () => {
    const id = formData.id?.trim();
    const nom = formData.nom?.trim();
    const categorie = formData.categorie?.trim();

    if (!id || !nom || !categorie) {
      setMessage("Remplis au minimum l'ID, le nom et la categorie.");
      return;
    }

    setSaving(true);
    setMessage("");

    const produitASauvegarder = {
      ...formData,
      id,
      nom,
      categorie,
      prix: Number(formData.prix) || 0,
      stock: Number(formData.stock) || 0,
      couleurs: formData.couleurs && formData.couleurs.length > 0 ? formData.couleurs : ["Noir"],
      tailles: formData.tailles && formData.tailles.length > 0 ? formData.tailles : ["XS", "S", "M", "L", "XL"],
      images: formData.images || [],
    };

    if (nouveauProduit) {
      const { error } = await supabase.from("produits").insert([produitASauvegarder]);
      if (error) {
        setMessage("âŒ Erreur : " + error.message);
      } else {
        setMessage("âœ… Produit ajoutÃ© !");
        setModalProduit(null);
        chargerProduits();
      }
    } else {
      const { error } = await supabase
        .from("produits")
        .update(produitASauvegarder)
        .eq("id", id);
      if (error) {
        setMessage("âŒ Erreur : " + error.message);
      } else {
        setMessage("âœ… Produit mis Ã  jour !");
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
          DÃ©connexion
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
                    {c.produits.map((p, i) => (
                      <p key={i} className="text-white/50 text-sm">
                        {p.nom} Ã— {p.quantite} â€” {p.taille} â€” {p.couleur}
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
                    <option value="confirme" className="bg-black">ConfirmÃ©</option>
                    <option value="expedie" className="bg-black">ExpÃ©diÃ©</option>
                    <option value="livre" className="bg-black">LivrÃ©</option>
                    <option value="annule" className="bg-black">AnnulÃ©</option>
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
                  {p.images && p.images.length > 0 && (
                    <div className="relative">
                      <img
                        src={p.images[0]}
                        alt={p.nom}
                        className="w-full h-40 object-cover"
                      />
                      {p.images.length > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                          +{p.images.length - 1} photo{p.images.length > 2 ? "s" : ""}
                        </span>
                      )}
                    </div>
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
                      {p.nouveaute && <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded-full">NouveautÃ©</span>}
                      {p.soldout && <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Sold Out</span>}
                    </div>
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {(p.couleurs || []).slice(0, 5).map((couleur) => (
                        <span key={couleur} className="bg-white/5 border border-white/10 text-white/50 text-[11px] px-2 py-0.5 rounded-full">
                          {couleur}
                        </span>
                      ))}
                      {(p.couleurs || []).length === 0 && (
                        <span className="text-white/25 text-xs">Aucune couleur renseignÃ©e</span>
                      )}
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

            {message && (
              <div className="text-sm text-white/80 border border-white/10 rounded-xl px-4 py-3">
                {message}
              </div>
            )}

            {/* Upload photos (plusieurs) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/40 text-xs tracking-widest uppercase">Photos du produit</label>
                <span className="text-white/30 text-xs">{previewImages.length} photo{previewImages.length === 1 ? "" : "s"}</span>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                      <img src={src} alt={`photo ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          Principale
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {i !== 0 && (
                          <button
                            type="button"
                            onClick={() => deplacerImageEnPremier(i)}
                            className="text-white text-[10px] underline"
                          >
                            Mettre en avant
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => supprimerImage(i)}
                          className="text-red-400 text-[10px] underline"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors relative"
              >
                <div className="text-center">
                  <p className="text-white/40 text-2xl mb-1">ðŸ“·</p>
                  <p className="text-white/30 text-xs">Ajouter une ou plusieurs photos</p>
                  <p className="text-white/20 text-xs mt-1">Galerie ou appareil photo</p>
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                    <p className="text-white text-sm">Upload en cours...</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">
                Couleurs disponibles
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={couleurInput}
                  onChange={(e) => setCouleurInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      ajouterCouleur();
                    }
                  }}
                  placeholder="Ex : Noir"
                  className="flex-1 bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-white/30 placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={ajouterCouleur}
                  className="bg-white text-black px-4 py-2 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              {(formData.couleurs || []).length > 0 && (
                <div className="flex gap-2 flex-wrap mb-2">
                  {(formData.couleurs || []).map((couleur) => (
                    <button
                      key={couleur}
                      type="button"
                      onClick={() => retirerCouleur(couleur)}
                      className="bg-white/10 border border-white/10 text-white/70 text-xs px-3 py-1 rounded-full hover:border-red-500/50 hover:text-red-300 transition-colors"
                    >
                      {couleur} x
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={(formData.couleurs || []).join(", ")}
                onChange={(e) => modifierCouleurs(e.target.value)}
                placeholder="Noir, Blanc, Rouge"
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-white/30 placeholder:text-white/20"
              />
              <p className="text-white/25 text-xs mt-1">
                Separe les couleurs avec une virgule.
              </p>
            </div>

            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">
                Tailles disponibles
              </label>
              <input
                type="text"
                value={(formData.tailles || []).join(", ")}
                onChange={(e) => modifierTailles(e.target.value)}
                placeholder="XS, S, M, L, XL"
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-white/30 placeholder:text-white/20"
              />
              <p className="text-white/25 text-xs mt-1">
                Separe les tailles avec une virgule.
              </p>
            </div>

            {([
              { label: "ID (ex: article_10)", key: "id", type: "text", disabled: !nouveauProduit },
              { label: "Nom", key: "nom", type: "text" },
              { label: "Prix (FCFA)", key: "prix", type: "number" },
              { label: "CatÃ©gorie", key: "categorie", type: "text" },
              { label: "Description", key: "description", type: "text" },
              { label: "Stock", key: "stock", type: "number" },
            ] satisfies ChampProduit[]).map((field) => (
              <div key={field.key}>
                <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">{field.label}</label>
                <input
                  type={field.type}
                  disabled={field.disabled}
                  value={formData[field.key]?.toString() || ""}
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
                NouveautÃ©
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soldout || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, soldout: e.target.checked }))}
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


