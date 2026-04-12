"use client";

import { useMenu } from "./menu-context";

export default function Hero() {
  const { isOpen } = useMenu();

  return (
    <main className="relative min-h-screen w-full bg-[url('/hero-mobile.webp')] md:bg-[url('/hero-desktop.webp')] bg-cover bg-center bg-no-repeat bg-black">
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
