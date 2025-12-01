"use client";

import Search from "@/components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BuyStocksPage() {
    const [remainingInvestment, setRemainingInvestment] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userRaw = localStorage.getItem("currentUser");
        const user = userRaw ? JSON.parse(userRaw) : null;
        setCurrentUser(user);

        if (user) {
            // Get original budget investment amount
            const budgetKey = `mansamoneyBudget:${user.email}`;
            const savedBudget = localStorage.getItem(budgetKey);
            
            if (savedBudget) {
                const budgetData = JSON.parse(savedBudget);
                const originalInvestment = Number(budgetData.investments) || 0;
                
                // Get all orders to calculate total spent
                const storageKey = `mansamoneyOrders:${user.email}`;
                const ordersRaw = localStorage.getItem(storageKey);
                const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
                
                // Calculate total amount spent on all purchases
                const totalSpent = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
                
                // Set remaining investment
                setRemainingInvestment(Math.max(0, originalInvestment - totalSpent));
            }
        }
    }, []);

    return (
        <main className="min-h-screen px-6 py-12">
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
                
                {/* Remaining Budget Display */}
                {currentUser && (
                    <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-5 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Amount Left to Invest</p>
                            <p className="text-4xl font-bold text-amber-600">
                                ${remainingInvestment.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">From your budget allocation</p>
                        </div>
                    </article>
                )}
                
                <Search remainingBudget={remainingInvestment} />
                
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
            </section>
        </main>
    );
}
