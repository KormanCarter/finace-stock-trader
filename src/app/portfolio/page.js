"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [prices, setPrices] = useState({});
    const [priceLoading, setPriceLoading] = useState(false);

    useEffect(() => {
        const userRaw = localStorage.getItem("currentUser");
        const user = userRaw ? JSON.parse(userRaw) : null;
        setCurrentUser(user);

        const storageKey = user?.email ? `mansamoneyOrders:${user.email}` : "mansamoneyOrders:guest";
        const ordersRaw = localStorage.getItem(storageKey);
        const userOrders = ordersRaw ? JSON.parse(ordersRaw) : [];
        setOrders(Array.isArray(userOrders) ? userOrders : []);
    }, []);

    useEffect(() => {
        if (orders.length === 0) return;

        let isMounted = true;
        async function loadPrices() {
            setPriceLoading(true);
            try {
                const entries = await Promise.all(
                    orders.map(async (order) => {
                        try {
                            const price = await fetchQuote(order.symbol);
                            return [order.symbol, price];
                        } catch (err) {
                            console.error(`Failed to fetch ${order.symbol}:`, err.message);
                            return [order.symbol, null];
                        }
                    })
                );
                if (isMounted) {
                    setPrices(Object.fromEntries(entries));
                }
            } finally {
                if (isMounted) {
                    setPriceLoading(false);
                }
            }
        }

        loadPrices();
        return () => {
            isMounted = false;
        };
    }, [orders]);

    async function fetchQuote(symbol) {
        try {
            const url = `/api/quote?symbol=${encodeURIComponent(symbol)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            if (typeof data.c !== "number") throw new Error("Missing price data");
            return data.c;
        } catch (err) {
            console.error(`fetchQuote(${symbol}):`, err.message);
            throw err;
        }
    }

    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <section className="mx-auto max-w-5xl space-y-6">
                <header>
                    <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
                        MansaMoney
                    </p>
                    <h1 className="text-3xl font-black">Portfolio</h1>
                    <Link
                        href="/"
                        className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                        ← Back
                    </Link>
                </header>

                {!currentUser ? (
                    <p className="text-center text-gray-600">Please sign in to view your portfolio.</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-gray-600">You haven't purchased any stocks yet.</p>
                ) : (
                    <>
                        {(() => {
                            const totalInvested = orders.reduce((sum, order) => sum + order.amount, 0);
                            const totalCurrent = orders.reduce((sum, order) => {
                                const currentPrice = prices[order.symbol];
                                return sum + (currentPrice ? currentPrice * order.shares : order.amount);
                            }, 0);
                            const totalGain = totalCurrent - totalInvested;
                            const totalGainPercent = (totalGain / totalInvested) * 100;

                            return (
                                <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 shadow-sm">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Portfolio Summary</p>
                                        <p className="text-xl font-semibold text-gray-900">
                                            Total Invested: ${totalInvested.toFixed(2)}
                                        </p>
                                        <p className="text-xl font-semibold text-gray-900">
                                            Current Value: ${totalCurrent.toFixed(2)}
                                        </p>
                                        <span className={`text-lg font-bold ${totalGain >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                            {totalGain >= 0 ? "+" : ""}${totalGain.toFixed(2)} ({totalGainPercent >= 0 ? "+" : ""}{totalGainPercent.toFixed(2)}%)
                                        </span>
                                    </div>
                                </article>
                            );
                        })()}
                        <div className="grid gap-4">
                        {orders.map((order, index) => {
                            const currentPrice = prices[order.symbol];
                            const currentValue = currentPrice ? currentPrice * order.shares : null;
                            const gain = currentValue ? currentValue - order.amount : null;
                            const gainPercent = gain ? (gain / order.amount) * 100 : null;

                            return (
                                <article
                                    key={index}
                                    className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm"
                                >
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                                            {new Date(order.timestamp).toLocaleDateString()}
                                        </p>
                                        <p className="text-xl font-semibold text-gray-900">
                                            {order.symbol}
                                            <span className="ml-2 text-sm font-medium text-gray-500">{order.name}</span>
                                        </p>
                                        <span className="text-base font-medium text-emerald-600">
                                            {order.shares.toFixed(2)} shares @ ${order.price.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="mt-4 rounded-xl bg-white/60 p-4">
                                        <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                            <div>
                                                <dt className="text-gray-500">Shares</dt>
                                                <dd className="text-gray-900 font-semibold">{order.shares.toFixed(2)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500">Purchase Price</dt>
                                                <dd className="text-gray-900 font-semibold">${order.price.toFixed(2)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500">Current Price</dt>
                                                <dd className="text-gray-900 font-semibold">
                                                    {priceLoading && currentPrice === undefined
                                                        ? "Loading…"
                                                        : currentPrice != null
                                                            ? `$${currentPrice.toFixed(2)}`
                                                            : "—"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500">Total Invested</dt>
                                                <dd className="text-gray-900 font-semibold">${order.amount.toFixed(2)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500">Current Value</dt>
                                                <dd className={`font-semibold ${currentValue && currentValue >= order.amount ? "text-emerald-600" : "text-red-600"}`}>
                                                    {currentValue != null ? `$${currentValue.toFixed(2)}` : "—"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500">Gain/Loss</dt>
                                                <dd className={`font-semibold ${gain != null && gain >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                                    {gain != null ? `${gain >= 0 ? "+" : ""}$${gain.toFixed(2)}` : "—"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500">Return %</dt>
                                                <dd className={`font-semibold ${gainPercent != null && gainPercent >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                                    {gainPercent != null ? `${gainPercent >= 0 ? "+" : ""}${gainPercent.toFixed(2)}%` : "—"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500">Date</dt>
                                                <dd className="text-gray-900 font-semibold">
                                                    {new Date(order.timestamp).toLocaleDateString()}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </article>
                            );
                        })}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
