"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Portfolio() {
    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [prices, setPrices] = useState({});
    const [priceLoading, setPriceLoading] = useState(false);
    const [remainingInvestment, setRemainingInvestment] = useState(0);

    useEffect(() => {
        const userRaw = localStorage.getItem("currentUser");
        const user = userRaw ? JSON.parse(userRaw) : null;
        setCurrentUser(user);

        const storageKey = user?.email ? `mansamoneyOrders:${user.email}` : "mansamoneyOrders:guest";
        const ordersRaw = localStorage.getItem(storageKey);
        const userOrders = ordersRaw ? JSON.parse(ordersRaw) : [];
        setOrders(Array.isArray(userOrders) ? userOrders : []);

        // Calculate remaining investment balance
        if (user) {
            const budgetKey = `mansamoneyBudget:${user.email}`;
            const savedBudget = localStorage.getItem(budgetKey);
            
            if (savedBudget) {
                const budgetData = JSON.parse(savedBudget);
                // Use availableInvestment if it exists (already accounts for sales), otherwise calculate from original budget
                if (budgetData.availableInvestment !== undefined) {
                    setRemainingInvestment(Math.max(0, Number(budgetData.availableInvestment) || 0));
                } else {
                    const originalInvestment = Number(budgetData.investments) || 0;
                    const totalSpent = userOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
                    setRemainingInvestment(Math.max(0, originalInvestment - totalSpent));
                }
            }
        }
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
            throw err;
        }
    }

    const handleSell = (event, orderIndex, order) => {
        event.preventDefault();
        const dollarAmount = Number(new FormData(event.currentTarget).get("amount") || 0);
        
        if (!dollarAmount || dollarAmount <= 0) {
            alert("Please enter a valid dollar amount to sell.");
            return;
        }
        
        const currentPrice = prices[order.symbol];
        if (!currentPrice) {
            alert("Unable to get current price. Please try again.");
            return;
        }
        
        const currentValue = currentPrice * order.shares;
        
        if (dollarAmount > currentValue) {
            alert(`You can only sell up to $${currentValue.toFixed(2)} worth of ${order.symbol}.`);
            return;
        }
        
        const sharesToSell = dollarAmount / currentPrice;
        
        if (confirm(`Sell $${dollarAmount.toFixed(2)} worth of ${order.symbol} (${sharesToSell.toFixed(2)} shares)?`)) {
            const userRaw = localStorage.getItem("currentUser");
            const user = userRaw ? JSON.parse(userRaw) : null;
            const storageKey = user?.email ? `mansamoneyOrders:${user.email}` : "mansamoneyOrders:guest";
            
            const updatedOrders = [...orders];
            
            if (sharesToSell >= order.shares) {
                // Sell all shares - remove the order
                updatedOrders.splice(orderIndex, 1);
            } else {
                // Partial sale - update the order
                const remainingShares = order.shares - sharesToSell;
                const originalValuePerShare = order.amount / order.shares;
                updatedOrders[orderIndex] = {
                    ...order,
                    shares: remainingShares,
                    amount: remainingShares * originalValuePerShare
                };
            }
            
            localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
            setOrders(updatedOrders);
            
            // Add sale proceeds back to available investment funds
            if (user) {
                const budgetKey = `mansamoneyBudget:${user.email}`;
                const savedBudget = localStorage.getItem(budgetKey);
                if (savedBudget) {
                    const budgetData = JSON.parse(savedBudget);
                    // Simply add sale proceeds to current availableInvestment
                    const currentAvailable = Number(budgetData.availableInvestment) || 0;
                    budgetData.availableInvestment = currentAvailable + dollarAmount;
                    localStorage.setItem(budgetKey, JSON.stringify(budgetData));
                    
                    // Update the local state to reflect the change
                    setRemainingInvestment(budgetData.availableInvestment);
                }
            }
            
            alert(`Successfully sold $${dollarAmount.toFixed(2)} worth of ${order.symbol} (${sharesToSell.toFixed(2)} shares)`);
        }
    };

    const handleSellAll = (orderIndex, order) => {
        const currentPrice = prices[order.symbol];
        if (!currentPrice) {
            alert("Unable to get current price. Please try again.");
            return;
        }
        
        const currentValue = currentPrice * order.shares;
        
        if (confirm(`Sell ALL ${order.shares.toFixed(2)} shares of ${order.symbol} for $${currentValue.toFixed(2)}?`)) {
            const userRaw = localStorage.getItem("currentUser");
            const user = userRaw ? JSON.parse(userRaw) : null;
            const storageKey = user?.email ? `mansamoneyOrders:${user.email}` : "mansamoneyOrders:guest";
            
            const updatedOrders = [...orders];
            updatedOrders.splice(orderIndex, 1); // Remove the entire order
            
            localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
            setOrders(updatedOrders);
            
            // Add sale proceeds back to available investment funds
            if (user) {
                const budgetKey = `mansamoneyBudget:${user.email}`;
                const savedBudget = localStorage.getItem(budgetKey);
                if (savedBudget) {
                    const budgetData = JSON.parse(savedBudget);
                    // Simply add sale proceeds to current availableInvestment
                    const currentAvailable = Number(budgetData.availableInvestment) || 0;
                    budgetData.availableInvestment = currentAvailable + currentValue;
                    localStorage.setItem(budgetKey, JSON.stringify(budgetData));
                    
                    // Update the local state to reflect the change
                    setRemainingInvestment(budgetData.availableInvestment);
                }
            }
            
            alert(`Successfully sold all ${order.shares.toFixed(2)} shares of ${order.symbol} for $${currentValue.toFixed(2)}`);
        }
    };

    return (
        <main className="min-h-screen px-6 py-12">
            <section className="mx-auto max-w-5xl space-y-6">
                <header>
                    <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
                        MansaMoney
                    </p>
                    <h1 className="text-3xl font-black">Portfolio</h1>
                    <Link
                        href="/home"
                        className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                        ← Back
                    </Link>
                </header>

                {!currentUser ? (
                    <p className="text-center text-gray-600">Please sign in to view your portfolio.</p>
                ) : (
                    <>
                        {/* Remaining Budget Display - Always show when user is signed in */}
                        <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-purple-300 to-blue-500 px-6 py-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-2">
                                    <p className={`text-sm uppercase tracking-[0.4em] ${remainingInvestment > 1000 ? 'text-green-600' : remainingInvestment > 500 ? 'text-yellow-600' : 'text-red-600'}`}>Amount Left to Invest</p>
                                    <p className={`text-4xl font-bold ${remainingInvestment > 1000 ? 'text-green-500' : remainingInvestment > 500 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        ${remainingInvestment.toFixed(2)}
                                    </p>
                                </div>
                                <Link 
                                    href="/budget?edit=true&step=tracker&returnTo=/portfolio"
                                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Edit Budget
                                </Link>
                            </div>
                        </article>

                        {orders.length === 0 ? (
                            <p className="text-center text-gray-600">You haven't purchased any stocks yet.</p>
                        ) : (
                            <>
                                {/* Portfolio Stats */}
                                {(() => {
                            const totalInvested = orders.reduce((sum, order) => sum + order.amount, 0);
                            const totalCurrent = orders.reduce((sum, order) => {
                                const currentPrice = prices[order.symbol];
                                return sum + (currentPrice ? currentPrice * order.shares : order.amount);
                            }, 0);
                            const totalGain = totalCurrent - totalInvested;
                            const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

                            return (
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-black px-5 py-4 shadow-sm">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs uppercase tracking-[0.4em] text-white font-bold" style={{textShadow: '-1px -1px 0 #141313ff, 1px -1px 0 #121212ff, -1px 1px 0 #050404ff, 1px 1px 0 #121212ff'}}>Total Invested</p>
                                            <p className="text-2xl font-bold text-white" style={{textShadow: '-1px -1px 0 #141313ff, 1px -1px 0 #121212ff, -1px 1px 0 #050404ff, 1px 1px 0 #121212ff'}}>
                                                ${totalInvested.toFixed(2)}
                                            </p>
                                        </div>
                                    </article>

                                    <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-500 px-5 py-4 shadow-sm" style={{textShadow: '-1px -1px 0 #141313ff, 1px -1px 0 #121212ff, -1px 1px 0 #050404ff, 1px 1px 0 #121212ff'}}>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs uppercase tracking-[0.4em] text-blue-600 font-bold">Current Value</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                ${totalCurrent.toFixed(2)}
                                            </p>
                                        </div>
                                    </article>

                                    <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-purple-50 to-pink-500 px-5 py-4 shadow-sm" style={{textShadow: '-1px -1px 0 #141313ff, 1px -1px 0 #121212ff, -1px 1px 0 #050404ff, 1px 1px 0 #121212ff'}}>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs uppercase tracking-[0.4em] text-purple-600 text-bold">Total Gain/Loss</p>
                                            <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                                                ${totalGain.toFixed(2)}
                                            </p>
                                        </div>
                                    </article>

                                    <article className={`rounded-2xl border border-gray-200 px-5 py-4 shadow-sm ${totalGainPercent >= 0 ? 'bg-gradient-to-r from-green-50 to-green-500' : 'bg-gradient-to-r from-red-50 to-pink-50'}`} style={{textShadow: '-1px -1px 0 #141313ff, 1px -1px 0 #121212ff, -1px 1px 0 #050404ff, 1px 1px 0 #121212ff'}}>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs uppercase tracking-[0.4em] text-emerald-700 text-bold">Return %</p>
                                            <p className={`text-2xl font-bold ${totalGainPercent >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                                {totalGainPercent.toFixed(2)}%
                                            </p>
                                        </div>
                                    </article>

                                    
                                </div>
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
                                                {(order.shares != null ? order.shares.toFixed(2) : '0.00')} shares @ ${(order.price != null ? order.price.toFixed(2) : '0.00')}
                                            </span>
                                        </div>

                                        <div className="mt-4 rounded-xl bg-white/60 p-4">
                                            <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                                <div>
                                                    <dt className="text-gray-500">Shares</dt>
                                                    <dd className="text-gray-900 font-semibold">{order.shares != null ? order.shares.toFixed(2) : '0.00'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-gray-500">Purchase Price</dt>
                                                    <dd className="text-gray-900 font-semibold">${order.price != null ? order.price.toFixed(2) : '0.00'}</dd>
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
                                                    <dd className="text-gray-900 font-semibold">${order.amount != null ? order.amount.toFixed(2) : '0.00'}</dd>
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
                                        
                                        {/* Sell Form */}
                                        <div className="mt-4 rounded-xl p-4">
                                            <form onSubmit={(e) => handleSell(e, index, order)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        sell amount $
                                                    </label>
                                                    <input
                                                        name="amount"
                                                        type="number"
                                                        min="0.01"
                                                        max={currentValue || 0}
                                                        step="0.01"
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="submit"
                                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    >
                                                        Sell
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSellAll(index, order)}
                                                        className="rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
                                                    >
                                                        Sell All
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                        </>
                    )}
                </>
            )}
            </section>
        </main>
    );
}
