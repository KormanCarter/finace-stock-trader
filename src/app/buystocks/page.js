import Search from "@/components/Search";
import Link from "next/link";

export default function BuyStocksPage() {
    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <section className="mx-auto max-w-5xl space-y-6">
                <header>
                    <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
                        MansaMoney
                    </p>
                    <h1 className="text-3xl font-black">Buy Stocks</h1>
                    <Link
                        href="/home"
                        className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                        ← Back
                    </Link>
                </header>
                
                <Search />
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                    <Link
                        href="/recommended"
                        className="flex h-96 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center p-6 text-center text-3xl font-bold uppercase tracking-wide text-white transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                        style={{ backgroundImage: "url('/bestbuys.webp')" }}
                    >
                        Recommended Individual Stocks
                    </Link>
                    <Link
                        href="/indexfunds"
                        className="flex h-96 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center p-6 text-center text-3xl font-bold uppercase tracking-wide text-white transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                        style={{ backgroundImage: "url('/IndexFund.jpg')" }}
                    >
                        Index Funds (Safest Option Grow Wealth)
                    </Link>
                </div>
            </section>
        </main>
    );
}
