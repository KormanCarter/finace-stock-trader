"use client";

import { useEffect, useMemo, useState } from "react";

function formatPrice(value) {
    return typeof value === "number" && Number.isFinite(value) ? value.toFixed(2) : "—";
}

export default function Search() {
    const [symbol, setSymbol] = useState("");
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState("");

    const normalizedQuery = useMemo(() => symbol.trim().toUpperCase(), [symbol]);

    useEffect(() => {
        if (!normalizedQuery) {
            setSuggestions([]);
            setSuggestionsError("");
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            setSuggestionsLoading(true);
            setSuggestionsError("");

            try {
                const response = await fetch(`/api/symbols?q=${encodeURIComponent(normalizedQuery)}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Unable to load symbol list right now.");
                }

                const data = await response.json();
                const filtered = (data.result || [])
                    .filter((item) => item.symbol?.toUpperCase().startsWith(normalizedQuery))
                    .slice(0, 20);

                setSuggestions(filtered);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setSuggestionsError(err.message || "Failed to load symbols.");
                    setSuggestions([]);
                }
            } finally {
                setSuggestionsLoading(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [normalizedQuery]);

    async function fetchQuote(ticker) {
        setLoading(true);
        setError("");
        setQuote(null);

        try {
            const response = await fetch(`/api/quote?symbol=${encodeURIComponent(ticker)}`);

            if (!response.ok) {
                throw new Error("Unable to reach the quote service. Try again in a moment.");
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (typeof data.c !== "number") {
                throw new Error("No quote data returned for that symbol.");
            }

            setQuote({
                symbol: ticker,
                current: data.c,
                high: data.h,
                low: data.l,
                open: data.o,
                previousClose: data.pc,
            });
        } catch (err) {
            setError(err.message || "Something went wrong fetching that quote.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!normalizedQuery) {
            setError("Enter a ticker symbol (TSLA. AAPL)...");
            setQuote(null);
            return;
        }

        await fetchQuote(normalizedQuery);
    }

    function handleSuggestionClick(symbolValue) {
        setSymbol(symbolValue);
        setSuggestions([]);
        fetchQuote(symbolValue);
    }

    function handleBuy(event) {
        event.preventDefault();
        const amount = Number(new FormData(event.currentTarget).get("amount") || 0);
        if (!amount || amount < 1) {
            setError("Enter a valid dollar amount.");
            return;
        }

        if (!quote) return;

        const shares = amount / quote.current;
        alert(`Buying ${shares.toFixed(2)} shares of ${quote.symbol} at $${quote.current.toFixed(2)}.`);

        const purchase = {
            symbol: quote.symbol,
            amount,
            shares: Number(shares.toFixed(6)),
            price: quote.current,
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
            setError("Failed to save order.");
        }
    }

    return (
        <section className="max-w-4xl mx-auto mb-6">
            <form onSubmit={handleSubmit} className="space-y-3">
                <label className="sr-only" htmlFor="ticker-search">
                    Search for a ticker
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        id="ticker-search"
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a stock symbol (AAPL, TSLA, MSFT...)"
                        value={symbol}
                        onChange={(event) => setSymbol(event.target.value)}
                    />
                    
                </div>
            </form>
            {suggestionsLoading && (
                <p className="mt-2 text-sm text-gray-500">Loading matching symbols…</p>
            )}
            {suggestionsError && <p className="mt-2 text-sm text-red-600">{suggestionsError}</p>}
            {!suggestionsLoading && suggestions.length > 0 && (
                <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <ul>
                        {suggestions
                            .filter((item) => Boolean(item.symbol))
                            .map((item) => {
                                const upperSymbol = item.symbol.toUpperCase();
                                return (
                                    <li
                                        key={`${upperSymbol}-${item.description}`}
                                        className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-50"
                                        onClick={() => handleSuggestionClick(upperSymbol)}
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-900">{upperSymbol}</div>
                                            <div className="text-sm text-gray-500">{item.description || "No description"}</div>
                                        </div>
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{item.type || "—"}</span>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            )}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {quote && (
                <article className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Quote</p>
                        <p className="text-xl font-semibold text-gray-900">
                            {quote.symbol}
                        </p>
                        <span className="text-base font-medium text-emerald-600">
                            ${formatPrice(quote.current)}
                        </span>
                    </div>

                    <form className="mt-4 flex flex-col gap-3 rounded-xl bg-white/60 p-4 sm:flex-row sm:items-end" onSubmit={handleBuy}>
                        <label className="flex flex-1 flex-col text-sm font-medium text-gray-600">
                            $ Amount
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
                            className="relative inline-flex items-center justify-center h-fit overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200/40 transition [background-size:200%_100%] hover:[background-position:100%_0] hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.97]"
                        >
                            <span className="relative z-10">Buy</span>
                        </button>
                    </form>
                </article>
            )}
        </section>
    );
}