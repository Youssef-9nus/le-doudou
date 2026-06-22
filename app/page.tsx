import Link from "next/link";
import { produits } from "@/lib/produits";
import CarteProduit from "@/components/CarteProduit";

export default function Home() {
  const nouveautes = produits.filter((p) => p.nouveaute).slice(0, 4);
  const bestsellers = produits.filter((p) => !p.nouveaute).slice(0, 4);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 sm:py-40 px-4 sm:px-6 border-b border-white/10">
        <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-6">
          Collection 2025
        </p>
        <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6 sm:mb-8">
          Streetwear<br />
          <span className="text-white/20">Premium</span>
        </h2>
        <p className="text-white/40 text-sm sm:text-base max-w-md mb-8 sm:mb-10 leading-relaxed px-2">
          Des pièces conçues pour durer. Taillées pour Abidjan,
          portées partout dans le monde.
        </p>
        <Link
          href="/boutique"
          className="bg-white text-black px-8 sm:px-10 py-3 sm:py-4 font-semibold tracking-widest uppercase text-sm hover:bg-white/90 transition-colors"
        >
          Voir la collection
        </Link>
      </section>

      {/* Nouveautés */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex justify-between items-end mb-6 sm:mb-10">
          <div>
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-2">Arrivages</p>
            <h3 className="text-2xl sm:text-3xl font-bold">Nouveautés</h3>
          </div>
          <Link href="/boutique?cat=nouveautes" className="text-white/40 text-xs sm:text-sm hover:text-white tracking-widest uppercase transition-colors">
            Tout voir →
          </Link>
        </div>
        {/* 2 colonnes mobile, 4 colonnes desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {nouveautes.map((p) => (
            <CarteProduit key={p.id} produit={p} />
          ))}
        </div>
      </section>

      {/* Bannière milieu */}
      <section className="border-y border-white/10 py-10 sm:py-16 text-center bg-zinc-950 px-4">
        <p className="text-white/20 text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] uppercase leading-relaxed">
          Livraison dans toute la Côte d&apos;Ivoire
          <span className="hidden sm:inline"> &nbsp;·&nbsp; </span>
          <br className="sm:hidden" />
          Paiement Mobile Money
          <span className="hidden sm:inline"> &nbsp;·&nbsp; </span>
          <br className="sm:hidden" />
          Orange · Wave · MTN
        </p>
      </section>

      {/* Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex justify-between items-end mb-6 sm:mb-10">
          <div>
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-2">Les plus vendus</p>
            <h3 className="text-2xl sm:text-3xl font-bold">Incontournables</h3>
          </div>
          <Link href="/boutique" className="text-white/40 text-xs sm:text-sm hover:text-white tracking-widest uppercase transition-colors">
            Tout voir →
          </Link>
        </div>
        {/* 2 colonnes mobile, 4 colonnes desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {bestsellers.map((p) => (
            <CarteProduit key={p.id} produit={p} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 sm:py-10 text-center px-4">
        <p className="text-xl sm:text-2xl font-bold tracking-[0.3em] mb-3">LE DOUDOU</p>
        <p className="text-white/20 text-xs tracking-widest">
          © 2025 Le Doudou — Abidjan, Côte d&apos;Ivoire
        </p>
      </footer>
    </main>
  );
}
