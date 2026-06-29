"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { usePanier } from "@/lib/panier-context";
import { useRef, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { nombreArticles } = usePanier();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const clicsLogoRef = useRef(0);
  const resetLogoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigationLogoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gererClicLogo = () => {
    clicsLogoRef.current += 1;

    if (resetLogoRef.current) clearTimeout(resetLogoRef.current);
    if (navigationLogoRef.current) clearTimeout(navigationLogoRef.current);

    if (clicsLogoRef.current >= 5) {
      clicsLogoRef.current = 0;
      router.push("/admin-restreint");
      return;
    }

    resetLogoRef.current = setTimeout(() => {
      clicsLogoRef.current = 0;
    }, 900);

    navigationLogoRef.current = setTimeout(() => {
      if (clicsLogoRef.current === 1) {
        clicsLogoRef.current = 0;
        router.push("/");
      }
    }, 300);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <button type="button" onClick={gererClicLogo} className="flex items-center">
          <Image
            src="/logo.png"
            alt="Le Doudou"
            width={100}
            height={50}
            className="object-contain"
            priority
          />
        </button>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm tracking-widest text-white/60 hover:text-white transition-colors uppercase">
            Accueil
          </Link>
          <Link href="/boutique" className="text-sm tracking-widest text-white/60 hover:text-white transition-colors uppercase">
            Boutique
          </Link>
        </nav>

        {/* Droite : panier + hamburger */}
        <div className="flex items-center gap-4">
          <Link href="/panier" className="relative group">
            <ShoppingBag size={22} className="text-white/70 group-hover:text-white transition-colors" />
            {nombreArticles > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {nombreArticles}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Menu"
          >
            {menuOuvert ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {menuOuvert && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-6 flex flex-col gap-6">
          <Link href="/" onClick={() => setMenuOuvert(false)} className="text-sm tracking-widest text-white/60 hover:text-white transition-colors uppercase">
            Accueil
          </Link>
          <Link href="/boutique" onClick={() => setMenuOuvert(false)} className="text-sm tracking-widest text-white/60 hover:text-white transition-colors uppercase">
            Boutique
          </Link>
          <Link href="/panier" onClick={() => setMenuOuvert(false)} className="text-sm tracking-widest text-white/60 hover:text-white transition-colors uppercase">
            Panier {nombreArticles > 0 && `(${nombreArticles})`}
          </Link>
        </div>
      )}
    </header>
  );
}
