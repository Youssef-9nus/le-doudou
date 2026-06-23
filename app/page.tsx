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
      <footer className="border-t border-white/10 py-8 sm:py-12 text-center px-4">
        <p className="text-xl sm:text-2xl font-bold tracking-[0.3em] mb-4">LE DOUDOU</p>

        {/* Réseaux sociaux */}
        <div className="flex justify-center items-center gap-6 mb-6">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/the_style_1_?igsh=dzkzM2k3cjhqZ2s3&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@thestyleg1?_r=1&_t=ZS-97Qx1wUAzbO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
            aria-label="TikTok"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/2250777697233"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
            aria-label="WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </a>
        </div>

        <p className="text-white/20 text-xs tracking-widest">
          © 2025 Le Doudou — Abidjan, Côte d&apos;Ivoire
        </p>
      </footer>
    </main>
  );
}
