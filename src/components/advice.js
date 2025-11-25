"use client";

import React, { useState, useEffect } from 'react'
import Link from "next/link";

export default function Advice({ investments = 0 }) {
    const [indexfund, setIndexFund] = useState("")
    const [topSeven, setTopSeven] = useState("")
    const [remainingInvestment, setRemainingInvestment] = useState(Number(investments) || 0)

    // Update remaining investment when investments prop changes
    useEffect(() => {
        setRemainingInvestment(Number(investments) || 0);
    }, [investments]);

    // Check for new purchases and update remaining investment
    useEffect(() => {
        const updateRemainingBalance = () => {
            const userRaw = localStorage.getItem("currentUser");
            const currentUser = userRaw ? JSON.parse(userRaw) : null;
            
            if (currentUser) {
                // Get all orders to calculate total spent
                const storageKey = `mansamoneyOrders:${currentUser.email}`;
                const ordersRaw = localStorage.getItem(storageKey);
                const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
                
                // Calculate total amount spent on all purchases
                const totalSpent = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
                
                // Update remaining investment (original budget minus total spent)
                const originalInvestment = Number(investments) || 0;
                const newRemaining = originalInvestment - totalSpent;
                
                setRemainingInvestment(Math.max(0, newRemaining)); // Don't go below 0
            }
        };

        // Initial update
        updateRemainingBalance();

        // Poll for changes every 2 seconds to catch purchases from other pages
        const interval = setInterval(updateRemainingBalance, 2000);

        return () => clearInterval(interval);
    }, [investments]); // Re-run when investments prop changes

    const handleIndexFundSubmit = async () => {
        const amount = Number(indexfund) || 0;
        if (amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        if (amount > remainingInvestment) {
            alert("Not enough investment balance remaining");
            return;
        }

        // Divide evenly among 3 index funds
        const perFund = amount / 3;
        
        try {
            // Fetch current prices for all index funds
            const indexFunds = ["VOO", "QQQ", "DOW"];
            const pricePromises = indexFunds.map(async (symbol) => {
                const response = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
                if (!response.ok) throw new Error(`Failed to fetch price for ${symbol}`);
                const data = await response.json();
                if (data.error) throw new Error(data.error);
                return { symbol, price: data.c };
            });
            
            const prices = await Promise.all(pricePromises);
            
            // Create purchase orders with real prices and calculated shares
            const indexFundOrders = prices.map(({ symbol, price }) => ({
                symbol,
                name: symbol === "VOO" ? "Vanguard S&P 500 ETF" : 
                      symbol === "QQQ" ? "Invesco QQQ Trust" : 
                      "Dow Jones Industrial Average",
                amount: perFund,
                shares: Number((perFund / price).toFixed(6)),
                price: price
            }));

            // Save to localStorage
            const currentRaw = localStorage.getItem("currentUser");
            const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
            const storageKey = currentUser?.email
                ? `mansamoneyOrders:${currentUser.email}`
                : "mansamoneyOrders:guest";

            const existingRaw = localStorage.getItem(storageKey);
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            
            // Add all three fund orders
            const updatedOrders = [...existing, ...indexFundOrders.map(fund => ({
                ...fund,
                timestamp: new Date().toISOString()
            }))];
            
            localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
            
            // Update remaining investment amount
            setRemainingInvestment(prev => prev - amount);
            setIndexFund("");
            
            alert(`Successfully invested $${amount.toFixed(2)} evenly across 3 index funds ($${perFund.toFixed(2)} each)`);
        } catch (error) {
            alert("Failed to fetch prices or save investment: " + error.message);
        }
    };

    const handleTopSevenSubmit = async () => {
        const amount = Number(topSeven) || 0;
        if (amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        if (amount > remainingInvestment) {
            alert("Not enough investment balance remaining");
            return;
        }

        // Divide evenly among 7 stocks
        const perStock = amount / 7;
        
        try {
            // Fetch current prices for all stocks
            const stocks = ["NVDA", "AAPL", "MSFT", "GOOGL", "AMZN", "AVGO", "2222"];
            const pricePromises = stocks.map(async (symbol) => {
                const response = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
                if (!response.ok) throw new Error(`Failed to fetch price for ${symbol}`);
                const data = await response.json();
                if (data.error) throw new Error(data.error);
                return { symbol, price: data.c };
            });
            
            const prices = await Promise.all(pricePromises);
            
            // Create purchase orders with real prices and calculated shares
            const stockOrders = prices.map(({ symbol, price }) => ({
                symbol,
                name: symbol === "NVDA" ? "NVIDIA" :
                      symbol === "AAPL" ? "Apple Inc." :
                      symbol === "MSFT" ? "Microsoft Corporation" :
                      symbol === "GOOGL" ? "Alphabet Inc." :
                      symbol === "AMZN" ? "Amazon.com Inc." :
                      symbol === "AVGO" ? "Broadcom Inc." :
                      "Saudi Arabian Oil Company",
                amount: perStock,
                shares: Number((perStock / price).toFixed(6)),
                price: price
            }));

            // Save to localStorage
            const currentRaw = localStorage.getItem("currentUser");
            const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
            const storageKey = currentUser?.email
                ? `mansamoneyOrders:${currentUser.email}`
                : "mansamoneyOrders:guest";

            const existingRaw = localStorage.getItem(storageKey);
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            
            // Add all seven stock orders
            const updatedOrders = [...existing, ...stockOrders.map(stock => ({
                ...stock,
                timestamp: new Date().toISOString()
            }))];
            
            localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
            
            // Update remaining investment amount
            setRemainingInvestment(prev => prev - amount);
            setTopSeven("");
            
            alert(`Successfully invested $${amount.toFixed(2)} evenly across 7 top stocks ($${perStock.toFixed(2)} each)`);
        } catch (error) {
            alert("Failed to fetch prices or save investment: " + error.message);
        }
    };
    return (
        <main className="min-h-screen bg-white">
            <section className="mx-auto max-w-7xl space-y-6 px-6">
                {/* Amount Left to Invest */}
                <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Amount Left to Invest</p>
                        <p className="text-3xl font-bold text-blue-600">
                            ${remainingInvestment != null && !isNaN(remainingInvestment) ? remainingInvestment.toFixed(2) : '0.00'}
                        </p>
                    </div>
                </article>

                <div className="grid grid-cols-3 gap-4">
                    {/* Portfolio Image Card */}
                    <div className="col-span-1 row-span-2">
                        <Link
                            href="/portfolio"
                            className="flex h-116 w-full flex-col rounded-2xl border border-gray-200 bg-cover bg-center p-6 text-2xl font-bold uppercase tracking-wide text-purple-500 transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                            style={{ backgroundImage: "url('/stockup.jpg')" }}
                        >
                            Portfolio
                        </Link>
                    </div>

                    
                    <article className="h-116 w-full rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm flex flex-col">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Index Funds</p>
                            <p className="text-xl font-bold text-gray-600">This evenly invest your money into the top 3 index funds</p>
                            <ul className="list-disc pl-6 space-y-1 font-semibold text-lg">
                                    <li>VOO</li>
                                    <li>QQQ</li>
                                    <li>DOW</li>
                                </ul>
                                <div className="flex items-center gap-3 mt-3">
                                    <input 
                                        type="number" 
                                        value={indexfund}
                                        onChange={(e) => setIndexFund(e.target.value)}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                    <button 
                                        onClick={handleIndexFundSubmit}
                                        className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition [background-size:200%_100%] hover:[background-position:100%_0] hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.97]">
                                        <span className="relative z-10">Submit</span>
                                    </button>
                                </div>
                        </div>
                    </article>

                    
                    <article className="h-116 w-full rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm flex flex-col">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Top 7 Stocks</p>
                            <div className="text-gray-600">
                                <p className="text-2xl font-bold mb-2">This evenly invests your money into the top 7 stocks:</p>
                                <ul className="list-disc pl-6 space-y-1 font-semibold text-lg">
                                    <li>NVIDIA (NVDA)</li>
                                    <li>Apple Inc. (AAPL)</li>
                                    <li>Microsoft Corporation (MSFT)</li>
                                    <li>Alphabet Inc. (GOOGL)</li>
                                    <li>Amazon.com Inc. (AMZN)</li>
                                    <li>Broadcom Inc. (AVGO)</li>
                                    <li>Saudi Arabian Oil Company (2222)</li>
                                </ul>
                                <div className="flex items-center gap-3 mt-3">
                                    <input 
                                        type="number" 
                                        value={topSeven}
                                        onChange={(e) => setTopSeven(e.target.value)}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                    <button 
                                        onClick={handleTopSevenSubmit}
                                        className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition [background-size:200%_100%] hover:[background-position:100%_0] hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.97]">
                                        <span className="relative z-10">Submit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                </div>
            </section>
        </main>
    );
}
