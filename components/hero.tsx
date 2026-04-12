"use client";

import { useMenu } from "./menu-context";

export default function Hero() {
  const { isOpen } = useMenu();

  return (
    <main
      className="relative w-full bg-[url('/hero-mobile.webp')] md:bg-[url('/hero-desktop.webp')] bg-cover bg-center bg-no-repeat bg-black"
      style={{
        minHeight: '100dvh',
        marginTop: 'calc(-1 * env(safe-area-inset-top))',
        marginBottom: 'calc(-1 * env(safe-area-inset-bottom))',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-4">
        <h1
          className="text-white text-4xl md:text-6xl font-bold text-center animate-fade-in"
          style={{
            fontFamily: 'GreatVibes',
            opacity: isOpen ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          DazzledFangs
        </h1>
      </div>
    </main>
  );
}
