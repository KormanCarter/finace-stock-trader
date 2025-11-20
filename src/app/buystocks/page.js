import Search from "@/components/Search";
import Link from "next/link";

export default function BuyStocksPage() {
    return (
        <main className="bg-white">
            <Search></Search>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Link
                        href="/budget"
                        className="flex h-128 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center p-6 text-center text-3xl font-bold uppercase tracking-wide text-white transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                        style={{ backgroundImage: "url('/bestbuys.webp')" }}
                    >
                        Recommended Individual Stocks
                    </Link>
            </div>
        </main>
    );
}
