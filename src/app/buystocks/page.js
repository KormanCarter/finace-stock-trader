import Search from "@/components/Search";
import Link from "next/link";

export default function BuyStocksPage() {
    return (
        <main className="bg-white">
            <div className="px-6 py-6">
                <Link
                    href="/home"
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
                >
                    ← Back
                </Link>
            </div>
            <Search></Search>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                    <Link
                        href="/Recommended"
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
        </main>
    );
}
