"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { top25MarketCap } from "@/components/top25";


export default function Recommended() {
  const [prices, setPrices] = useState({});
  const [priceLoading, setPriceLoading] = useState(false);
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

  useEffect(() => {
    let isMounted = true;
    async function loadPrices() {
      setPriceLoading(true);
      try {
        const entries = await Promise.all(
          top25MarketCap.map(async (stock) => {
            try {
              const price = await fetchQuote(stock.symbol);
              console.log(`✓ Loaded ${stock.symbol}: $${price}`);
              return [stock.symbol, price];
            } catch (err) {
              console.error(`✗ Failed ${stock.symbol}: ${err.message}`);
              return [stock.symbol, null];
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
  }, []);
  const handleBuy = (event, stock) => {
    event.preventDefault();
    const amount = Number(new FormData(event.currentTarget).get("amount") || 0);
    if (!amount || amount < 1) {
      alert("Enter a valid dollar amount.");
      return;
    }

    // Check if user has enough budget remaining
    if (amount > remainingInvestment) {
      alert(`Insufficient budget. You have $${remainingInvestment.toFixed(2)} remaining.`);
      return;
    }

    fetchQuote(stock.symbol)
      .then((price) => {
        const shares = amount / price;
        alert(`Buying ${shares.toFixed(2)} shares of ${stock.symbol} at $${price.toFixed(2)}.`);

        const purchase = {
          symbol: stock.symbol,
          name: stock.name,
          amount,
          shares: Number(shares.toFixed(6)),
          price,
          timestamp: new Date().toISOString(),
        };

        try {
          const currentRaw = localStorage.getItem("currentUser");
          const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
          const storageKey = currentUser?.email
            ? `mansamoneyOrders:${currentUser.email}`
            : "mansamoneyOrders:guest";

          const existingRaw = localStorage.getItem(storageKey);
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          const nextOrders = Array.isArray(existing) ? [...existing, purchase] : [purchase];
          localStorage.setItem(storageKey, JSON.stringify(nextOrders));
        } catch (storageError) {
          console.error("Failed to persist order", storageError);
        }
      })
      .catch((err) => alert(err.message || "Failed to fetch quote"));
  };

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
    <main className="min-h-screen px-6 py-12">
      <section className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
            MansaMoney
          </p>
          <h1 className="text-3xl font-black">Top 25 </h1>
          <Link
            href="/buystocks"
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

        <div className="grid gap-4">
          {top25MarketCap.map((stock, index) => (
            <article
              key={stock.symbol}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">#{index + 1}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stock.symbol}
                  <span className="ml-2 text-sm font-medium text-gray-500">{stock.name}</span>
                </p>
                <span className="text-base font-medium text-emerald-600">
                  {priceLoading && prices[stock.symbol] === undefined
                    ? "Loading price…"
                    : prices[stock.symbol] != null
                      ? `$${prices[stock.symbol].toFixed(2)}`
                      : "Price unavailable"}
                </span>
              </div>

              <form
                className="mt-4 flex flex-col gap-3 rounded-xl bg-white/60 p-4 sm:flex-row sm:items-center"
                onSubmit={(event) => handleBuy(event, stock)}
              >
                <label className="flex flex-1 flex-col text-sm font-medium text-gray-600">
                  $
                  <input
                    name="amount"
                    type="number"
                    min={1}
                    step={1}
                    defaultValue={100}
                    className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Buy
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}