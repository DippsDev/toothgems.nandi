export default function PagesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/Copilot_20260410_195609.png')" }}
        >
            {/* Dark overlay so content stays readable */}
            <div className="min-h-screen bg-black/60">
                {children}
            </div>
        </div>
    );
}
