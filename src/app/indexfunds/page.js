"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import indexFunds from "@/components/indexFunds";

export default function IndexFundsPage() {
  const [prices, setPrices] = useState({});
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPrices() {
      setPriceLoading(true);
      try {
        const entries = await Promise.all(
          indexFunds.map(async (fund) => {
            try {
              const price = await fetchQuote(fund.symbol);
              console.log(`✓ Loaded ${fund.symbol}: $${price}`);
              return [fund.symbol, price];
            } catch (err) {
              console.error(`✗ Failed ${fund.symbol}: ${err.message}`);
              return [fund.symbol, null];
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
  const handleBuy = (event, fund) => {
    event.preventDefault();
    const amount = Number(new FormData(event.currentTarget).get("amount") || 0);
    if (!amount || amount < 1) {
      alert("Enter a valid dollar amount.");
      return;
    }

    fetchQuote(fund.symbol)
      .then((price) => {
        const shares = amount / price;
        alert(`Buying ${shares.toFixed(2)} shares of ${fund.symbol} at $${price.toFixed(2)}.`);

        const purchase = {
          symbol: fund.symbol,
          name: fund.name,
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
          <h1 className="text-3xl font-black">Index Funds</h1>
          <Link
            href="/buystocks"
            className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            ← Back
          </Link>
        </header>

        <div className="grid gap-4">
          {indexFunds.map((fund, index) => (
            <article
              key={fund.symbol}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">#{index + 1}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {fund.symbol}
                  <span className="ml-2 text-sm font-medium text-gray-500">{fund.name}</span>
                </p>
                <span className="text-sm font-medium text-emerald-600">
                  {priceLoading && prices[fund.symbol] === undefined
                    ? "Loading price…"
                    : prices[fund.symbol] != null
                      ? `$${prices[fund.symbol].toFixed(2)}`
                      : "Price unavailable"}
                </span>
              </div>

              <form
                className="mt-4 flex flex-col gap-3 rounded-xl bg-white/60 p-4 sm:flex-row sm:items-center"
                onSubmit={(event) => handleBuy(event, fund)}
              >
                <div className="flex flex-1 items-center gap-3">
                  <label htmlFor={`amount-${fund.symbol}`} className="text-sm font-medium text-gray-600 whitespace-nowrap">$ Amount</label>
                  <input
                    id={`amount-${fund.symbol}`}
                    name="amount"
                    type="number"
                    min={1}
                    step={1}
                    defaultValue={100}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <button
                  type="submit"
                  className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition [background-size:200%_100%] hover:[background-position:100%_0] hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.97]"
                >
                  <span className="relative z-10">Buy</span>
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
