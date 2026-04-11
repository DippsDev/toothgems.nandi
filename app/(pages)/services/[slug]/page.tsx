"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const services: Record<string, { title: string; price: string; description: string }[]> = {
    "basic-gem": [
        { title: "Single Gem", price: "R250", description: "One crystal gem applied to a single tooth." },
        { title: "Two Gems", price: "R400", description: "Two gems placed on adjacent teeth." },
        { title: "Three Gems", price: "R550", description: "Three gems for a sparkling smile." },
    ],
    "cross-butterfly": [
        { title: "Cross Set", price: "R350", description: "A delicate cross design applied to your tooth." },
        { title: "Butterfly Set", price: "R350", description: "A butterfly design for a unique look." },
        { title: "Cross + Butterfly Combo", price: "R600", description: "Both designs on separate teeth." },
    ],
    "grill-design": [
        { title: "Single Tooth Grill", price: "R800", description: "Custom grill fitted to one tooth." },
        { title: "Two Tooth Grill", price: "R1400", description: "Grill design spanning two teeth." },
        { title: "Full Front Grill", price: "R2500", description: "Full front grill for maximum impact." },
    ],
    "custom-design": [
        { title: "Consultation + Design", price: "R200", description: "Sit down with us to plan your custom look." },
        { title: "Custom Single Gem", price: "R500", description: "Fully custom gem placement of your choice." },
        { title: "Custom Full Set", price: "R1200", description: "A completely bespoke full set design." },
    ],
};

const slugToLabel: Record<string, string> = {
    "basic-gem": "Basic Gem on Tooth",
    "cross-butterfly": "Cross or Butterfly Set",
    "grill-design": "Grill Design",
    "custom-design": "Custom Design",
};

export default function BookingPage() {
    const params = useParams();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const items = services[slug] ?? [];
    const categoryLabel = slugToLabel[slug] ?? "Services";

    const router = useRouter();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState<"summary" | "date" | "time" | "contact" | "confirm" | "booked">("summary");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [contact, setContact] = useState({ name: "", phone: "", email: "" });
    const [bookingRef] = useState(() => "DF-" + Math.random().toString(36).slice(2, 7).toUpperCase());
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalAnimating, setModalAnimating] = useState<"enter" | "exit" | null>(null);

    useEffect(() => {
        if (showModal) {
            setModalVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setModalAnimating("enter"));
            });
        }
    }, [showModal]);

    // Fetch already-booked time slots when a date is selected
    useEffect(() => {
        if (!selectedDate || !slug) return;
        fetch(`/api/bookings?date=${selectedDate}&slug=${slug}`)
            .then(r => {
                if (!r.ok) throw new Error("Failed to fetch availability");
                return r.json();
            })
            .then(data => setBookedTimes(data.bookedTimes ?? []))
            .catch(() => setBookedTimes([]));
    }, [selectedDate, slug]);

    const submitBooking = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    booking_ref: bookingRef,
                    service_slug: slug,
                    items: selectedItems.map(i => ({ title: i.title, price: i.price })),
                    total,
                    date: selectedDate,
                    time: selectedTime,
                    name: contact.name,
                    phone: contact.phone,
                    email: contact.email,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Booking failed");
            setStep("booked");
        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setModalAnimating("exit");
        setTimeout(() => {
            setModalVisible(false);
            setModalAnimating(null);
            setShowModal(false);
            setStep("summary");
        }, 320);
    };

    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

    const today = new Date();
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [calYear, setCalYear] = useState(today.getFullYear());

    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const monthLabel = new Date(calYear, calMonth).toLocaleString("default", { month: "long", year: "numeric" });

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
        else setCalMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
        else setCalMonth(m => m + 1);
    };

    const isPast = (day: number) => {
        const d = new Date(calYear, calMonth, day);
        d.setHours(0, 0, 0, 0);
        const t = new Date(); t.setHours(0, 0, 0, 0);
        return d < t;
    };

    const selectedItems = items.filter((i) => selected.has(i.title));
    const total = selectedItems.reduce((sum, i) => {
        const num = parseInt(i.price.replace(/\D/g, ""), 10);
        return sum + (isNaN(num) ? 0 : num);
    }, 0);

    const toggleItem = (title: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(title) ? next.delete(title) : next.add(title);
            return next;
        });
    };

    return (
        <main className="min-h-screen">
            {/* Back button — sits in the navbar row, right side to avoid hamburger */}
            <button
                onClick={() => router.push("/")}
                className="fixed top-0 right-4 z-40 h-16 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
                ← Back
            </button>

            <div className="pt-32 px-4 sm:px-6 md:px-10 pb-10">
                {/* Breadcrumb */}
                <nav className="text-sm text-white/40 mb-6 flex gap-2">
                    <span>Services</span>
                    <span>/</span>
                    <span className="text-white/80">{categoryLabel}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left — service list */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-semibold text-white mb-4">{categoryLabel}</h1>
                        <div className="flex flex-col gap-3 max-w-2xl">
                            {items.map((item) => {
                                const isSelected = selected.has(item.title);
                                return (
                                    <div
                                        key={item.title}
                                        onClick={() => toggleItem(item.title)}
                                        className={`rounded-lg p-3 sm:p-4 flex flex-col gap-2 cursor-pointer transition backdrop-blur-sm border ${isSelected
                                            ? "bg-white/20 border-white/40"
                                            : "bg-white/10 border-white/10 hover:bg-white/15"
                                            }`}
                                    >
                                        <div className="font-semibold text-base sm:text-lg text-white">{item.title}</div>
                                        <div className="text-sm text-white/60 font-normal mt-1">{item.price}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right — booking summary */}
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="backdrop-blur-sm bg-white/10 border border-white/15 rounded-xl p-6 lg:sticky lg:top-20">
                            <h2 className="text-base font-semibold text-white mb-4">Booking Summary</h2>
                            <div className="border-t border-white/10 pt-4 mb-5 min-h-[56px]">
                                {selectedItems.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {selectedItems.map((item) => (
                                            <div key={item.title} className="flex justify-between text-sm text-white/80 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                                <span>{item.title}</span>
                                                <span className="shrink-0 ml-4">{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/40">No services selected</p>
                                )}
                            </div>
                            <div className="flex justify-between text-sm font-medium text-white mb-6 border-t border-white/10 pt-4">
                                <span>Total</span>
                                <span>{selectedItems.length > 0 ? `R${total}` : "free"}</span>
                            </div>
                            <button
                                disabled={selectedItems.length === 0}
                                onClick={() => setShowModal(true)}
                                className="w-full py-3 rounded-full text-sm font-medium transition-colors duration-150 bg-white text-gray-900 hover:bg-white/90 disabled:bg-white/20 disabled:text-white/30 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal — kept white for readability */}
            {modalVisible && selectedItems.length > 0 && (
                <div
                    className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm ${modalAnimating === "enter" ? "modal-backdrop-enter" : modalAnimating === "exit" ? "modal-backdrop-exit" : ""}`}
                    onClick={closeModal}
                >
                    <div
                        className={`bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 w-full sm:max-w-md sm:mx-4 shadow-xl max-h-[90dvh] overflow-y-auto modal-sheet ${modalAnimating === "enter" ? "modal-sheet-enter" : modalAnimating === "exit" ? "modal-sheet-exit" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {step === "summary" && (
                            <div key="summary" className="step-panel">
                                <div className="flex items-start justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-[#141414]">Your Selection</h2>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none ml-4">✕</button>
                                </div>
                                <div className="flex flex-col gap-3 mb-6">
                                    {selectedItems.map((item) => (
                                        <div key={item.title} className="flex justify-between text-sm text-gray-700">
                                            <span>{item.title}</span>
                                            <span>{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-sm font-semibold text-gray-900 mb-8 border-t border-gray-100 pt-4">
                                    <span>Total</span>
                                    <span>R{total}</span>
                                </div>
                                <button onClick={() => setStep("date")} className="w-full py-3 rounded-full bg-[#2d2d2d] text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors">
                                    Add to booking
                                </button>
                            </div>
                        )}

                        {step === "date" && (
                            <div key="date" className="step-panel">
                                <div className="flex items-center justify-between mb-6">
                                    <button onClick={() => setStep("summary")} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
                                    <h2 className="text-lg font-semibold text-[#141414]">Select a Date</h2>
                                    <button onClick={() => { closeModal(); setSelectedDate(null); }} className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none">✕</button>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <button onClick={prevMonth} className="text-gray-400 hover:text-gray-700 px-2 py-1 text-lg">‹</button>
                                    <span className="text-sm font-medium text-gray-800">{monthLabel}</span>
                                    <button onClick={nextMonth} className="text-gray-400 hover:text-gray-700 px-2 py-1 text-lg">›</button>
                                </div>
                                <div className="grid grid-cols-7 mb-1">
                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                        <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-1 mb-6">
                                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                        const past = isPast(day);
                                        const isChosen = selectedDate === dateStr;
                                        return (
                                            <button
                                                key={day}
                                                disabled={past}
                                                onClick={() => setSelectedDate(dateStr)}
                                                className={`text-sm rounded-full w-8 h-8 mx-auto flex items-center justify-center transition-colors ${isChosen ? "bg-gray-900 text-white" : ""} ${!isChosen && !past ? "hover:bg-gray-100 text-gray-800" : ""} ${past ? "text-gray-300 cursor-not-allowed" : ""}`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button disabled={!selectedDate} onClick={() => setStep("time")} className="w-full py-3 rounded-full bg-[#2d2d2d] text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                                    Confirm Date
                                </button>
                            </div>
                        )}

                        {step === "time" && (
                            <div key="time" className="step-panel">
                                <div className="flex items-center justify-between mb-6">
                                    <button onClick={() => setStep("date")} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
                                    <h2 className="text-lg font-semibold text-[#141414]">Select a Time</h2>
                                    <button onClick={() => { closeModal(); setSelectedDate(null); setSelectedTime(null); }} className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none">✕</button>
                                </div>
                                <p className="text-sm text-gray-400 mb-5">
                                    {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                </p>
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {timeSlots.map((slot) => {
                                        const isBooked = bookedTimes.includes(slot);
                                        const isChosen = selectedTime === slot;
                                        return (
                                            <button
                                                key={slot}
                                                disabled={isBooked}
                                                onClick={() => setSelectedTime(slot)}
                                                className={`py-2.5 rounded-lg border text-sm font-medium transition-colors
                                                    ${isChosen ? "bg-gray-900 text-white border-gray-900" : ""}
                                                    ${!isChosen && !isBooked ? "border-gray-200 text-gray-700 hover:bg-gray-50" : ""}
                                                    ${isBooked ? "border-gray-100 text-gray-300 line-through cursor-not-allowed" : ""}`}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button disabled={!selectedTime} onClick={() => setStep("contact")} className="w-full py-3 rounded-full bg-[#2d2d2d] text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                                    Confirm Time
                                </button>
                            </div>
                        )}

                        {step === "contact" && (
                            <div key="contact" className="step-panel">
                                <div className="flex items-center justify-between mb-6">
                                    <button onClick={() => setStep("time")} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
                                    <h2 className="text-lg font-semibold text-[#141414]">Your Details</h2>
                                    <button onClick={() => { closeModal(); setSelectedDate(null); setSelectedTime(null); setContact({ name: "", phone: "", email: "" }); }} className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none">✕</button>
                                </div>
                                <p className="text-xs text-gray-400 mb-5">
                                    {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}
                                    {selectedTime && ` at ${selectedTime}`}
                                </p>
                                <div className="flex flex-col gap-4 mb-8">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                                        <input type="text" placeholder="Jane Doe" value={contact.name} onChange={(e) => setContact(c => ({ ...c, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                                        <input type="tel" placeholder="+267 99 999 999" value={contact.phone} onChange={(e) => setContact(c => ({ ...c, phone: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Email</label>
                                        <input type="email" placeholder="jane@example.com" value={contact.email} onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors" />
                                    </div>
                                </div>
                                <button disabled={!contact.name.trim() || !contact.phone.trim() || !contact.email.trim()} onClick={() => setStep("confirm")} className="w-full py-3 rounded-full bg-[#2d2d2d] text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                                    Confirm Booking
                                </button>
                            </div>
                        )}

                        {step === "confirm" && (
                            <div key="confirm" className="step-panel">
                                <div className="flex items-center justify-between mb-6">
                                    <button onClick={() => setStep("contact")} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
                                    <h2 className="text-lg font-semibold text-[#141414]">Booking Summary</h2>
                                    <button onClick={() => { closeModal(); setSelectedDate(null); setSelectedTime(null); setContact({ name: "", phone: "", email: "" }); }} className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none">✕</button>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Services</p>
                                    <div className="flex flex-col gap-2">
                                        {selectedItems.map((item) => (
                                            <div key={item.title} className="flex justify-between text-sm text-gray-700">
                                                <span>{item.title}</span>
                                                <span>{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-100 mt-3 pt-3">
                                        <span>Total</span>
                                        <span>R{total}</span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mb-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Date & Time</p>
                                    <p className="text-sm text-gray-700">
                                        {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                    <p className="text-sm text-gray-700">{selectedTime}</p>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mb-8">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Contact</p>
                                    <div className="flex flex-col divide-y divide-gray-100">
                                        <div className="flex justify-between text-sm py-2.5"><span className="text-gray-400">Name</span><span className="text-gray-700">{contact.name}</span></div>
                                        <div className="flex justify-between text-sm py-2.5"><span className="text-gray-400">Phone</span><span className="text-gray-700">{contact.phone}</span></div>
                                        {contact.email && <div className="flex justify-between text-sm py-2.5"><span className="text-gray-400">Email</span><span className="text-gray-700">{contact.email}</span></div>}
                                    </div>
                                </div>
                                {submitError && (
                                    <p className="text-red-500 text-xs mb-3 text-center">{submitError}</p>
                                )}
                                <button
                                    onClick={submitBooking}
                                    disabled={isSubmitting}
                                    className="w-full py-3 rounded-full bg-[#2d2d2d] text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Booking..." : "Book Now"}
                                </button>
                            </div>
                        )}

                        {step === "booked" && (
                            <div key="booked" className="step-panel flex flex-col items-center text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-[#141414] mb-1">You&apos;re booked!</h2>
                                <p className="text-sm text-gray-400 mb-6">Booking reference: <span className="font-mono font-medium text-gray-700">{bookingRef}</span></p>
                                <div className="w-full text-left bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-2 text-sm text-gray-600">
                                    <p>📅 {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                                    <p>🕐 {selectedTime}</p>
                                    <p>💎 {selectedItems.map(i => i.title).join(", ")}</p>
                                </div>
                                <p className="text-sm text-gray-500 mb-8">A confirmation email has been sent to <span className="font-medium text-gray-700">{contact.email}</span>. We&apos;ll also WhatsApp you on <span className="font-medium text-gray-700">{contact.phone}</span> to confirm.</p>
                                <button
                                    onClick={() => { closeModal(); setSelectedDate(null); setSelectedTime(null); setContact({ name: "", phone: "", email: "" }); setSelected(new Set()); }}
                                    className="w-full py-3 rounded-full bg-[#2d2d2d] text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
