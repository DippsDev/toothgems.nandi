"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const images = [
    { src: "/Copilot_20260408_175444.png", alt: "Tooth gem design" },
    { src: "/Copilot_20260408_181643.png", alt: "Tooth gem design" },
];

export default function GalleryPage() {
    const router = useRouter();
    const [lightbox, setLightbox] = useState<string | null>(null);

    return (
        <main className="min-h-screen">
            {/* Back button */}
            <button
                onClick={() => router.push("/")}
                className="fixed top-0 right-4 z-40 h-16 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
                ← Back
            </button>

            <div className="pt-32 px-4 sm:px-6 md:px-10 pb-10">
                <h1 className="text-2xl font-semibold text-white mb-8">Gallery</h1>

                {images.length === 0 ? (
                    <p className="text-white/50 text-sm">No images yet. Check back soon.</p>
                ) : (
                    <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
                        {images.map((img) => (
                            <div
                                key={img.src}
                                className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl ring-1 ring-white/10"
                                onClick={() => setLightbox(img.src)}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={600}
                                    height={600}
                                    className="w-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-2xl leading-none hover:text-white/60 transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        ✕
                    </button>
                    <div className="relative max-w-3xl w-full max-h-[90dvh]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={lightbox}
                            alt="Gallery image"
                            width={1200}
                            height={1200}
                            className="w-full h-full object-contain rounded-xl"
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
