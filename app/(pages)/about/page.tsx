"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen">
            {/* Back button */}
            <button
                onClick={() => router.push("/")}
                className="fixed top-0 right-4 z-40 h-16 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
                ← Back
            </button>

            {/* Hero banner */}
            <div className="relative w-full h-64 sm:h-80 overflow-hidden mt-16">
                <Image
                    src="/Copilot_20260408_181643.png"
                    alt="DazzledFangs banner"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1
                        className="text-white text-4xl sm:text-5xl font-bold text-center animate-fade-in"
                        style={{ fontFamily: "GreatVibes" }}
                    >
                        DazzledFangs
                    </h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-10">
                {/* Who we are */}
                <section>
                    <h2 className="text-lg font-semibold text-white mb-3">Who we are</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        DazzledFangs is a boutique tooth gem studio dedicated to helping you express your
                        personality through your smile. We specialise in premium crystal gems, cross and
                        butterfly sets, custom grill designs, and fully bespoke creations — all applied with
                        precision and care.
                    </p>
                </section>

                {/* Our story */}
                <section>
                    <h2 className="text-lg font-semibold text-white mb-3">Our story</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        What started as a passion for self-expression and beauty has grown into a trusted
                        studio where clients come to feel confident and unique. Every gem we place is a
                        reflection of the person wearing it — and we take that seriously.
                    </p>
                </section>

                {/* What sets us apart */}
                <section>
                    <h2 className="text-lg font-semibold text-white mb-3">What sets us apart</h2>
                    <ul className="flex flex-col gap-3">
                        {[
                            { icon: "💎", text: "High-quality crystals that are safe for your teeth" },
                            { icon: "✨", text: "Custom designs tailored to your style" },
                            { icon: "🤝", text: "A welcoming, judgement-free experience" },
                            { icon: "📍", text: "Local studio with a personal touch" },
                        ].map(({ icon, text }) => (
                            <li key={text} className="flex items-start gap-3 text-sm text-white/70">
                                <span className="text-base leading-snug">{icon}</span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* CTA */}
                <section className="border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push("/")}
                        className="flex-1 py-3 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                        View Services
                    </button>
                    <button
                        onClick={() => router.push("/gallery")}
                        className="flex-1 py-3 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                        See Gallery
                    </button>
                </section>
            </div>
        </main>
    );
}
