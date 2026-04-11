"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FeedbackEntry {
    id: string;
    name: string;
    message: string;
    rating: number | null;
    created_at: string;
}

const STARS = [1, 2, 3, 4, 5];

export default function FeedbackPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", message: "", rating: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [entries, setEntries] = useState<FeedbackEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/feedback")
            .then((r) => r.json())
            .then((data) => setEntries(data.feedback ?? []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Submission failed");
            setSubmitted(true);
            // Optimistically prepend the new entry
            setEntries((prev) => [
                {
                    id: Date.now().toString(),
                    name: form.name,
                    message: form.message,
                    rating: form.rating || null,
                    created_at: new Date().toISOString(),
                },
                ...prev,
            ]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen">
            {/* Back button */}
            <button
                onClick={() => router.push("/")}
                className="fixed top-0 right-4 z-40 h-16 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
                ← Back
            </button>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex flex-col gap-10">
                <div>
                    <h1 className="text-2xl font-semibold text-white mb-1">Feedback</h1>
                    <p className="text-sm text-white/50">Share your experience with DazzledFangs.</p>
                </div>

                {/* Form */}
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                        <div>
                            <label className="block text-xs text-white/50 mb-1">Your Name</label>
                            <input
                                type="text"
                                placeholder="Jane Doe"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                            />
                        </div>

                        {/* Star rating */}
                        <div>
                            <label className="block text-xs text-white/50 mb-2">Rating (optional)</label>
                            <div className="flex gap-1">
                                {STARS.map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, rating: f.rating === star ? 0 : star }))}
                                        className={`text-2xl transition-colors ${star <= form.rating ? "text-yellow-400" : "text-white/20 hover:text-white/50"}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 mb-1">Your Message</label>
                            <textarea
                                rows={4}
                                placeholder="Tell us about your experience..."
                                value={form.message}
                                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none"
                            />
                        </div>

                        {error && <p className="text-red-400 text-xs">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting || !form.name.trim() || !form.message.trim()}
                            className="w-full py-3 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-white/90 transition-colors disabled:bg-white/20 disabled:text-white/30 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                ) : (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-xl">💎</div>
                        <p className="text-white font-medium">Thanks for your feedback!</p>
                        <p className="text-white/50 text-sm">Your review has been posted below.</p>
                    </div>
                )}

                {/* Existing feedback */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-medium text-white/50 uppercase tracking-wide">
                        {entries.length > 0 ? `${entries.length} Review${entries.length !== 1 ? "s" : ""}` : "No reviews yet"}
                    </h2>

                    {loading ? (
                        <p className="text-white/30 text-sm">Loading...</p>
                    ) : (
                        entries.map((entry) => (
                            <div key={entry.id} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-white">{entry.name}</span>
                                    {entry.rating && (
                                        <span className="text-yellow-400 text-sm tracking-tight">
                                            {"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed">{entry.message}</p>
                                <p className="text-xs text-white/30">
                                    {new Date(entry.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
