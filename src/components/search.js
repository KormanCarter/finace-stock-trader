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
                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Latest quote</div>
                    <div className="text-2xl font-bold text-gray-900">{quote.symbol}</div>
                    <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="text-gray-500">Current</dt>
                            <dd className="text-gray-900 text-lg font-semibold">${formatPrice(quote.current)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Open</dt>
                            <dd className="text-gray-900">${formatPrice(quote.open)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Day High</dt>
                            <dd className="text-gray-900">${formatPrice(quote.high)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Day Low</dt>
                            <dd className="text-gray-900">${formatPrice(quote.low)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Prev Close</dt>
                            <dd className="text-gray-900">${formatPrice(quote.previousClose)}</dd>
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <button
                                type="button"
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                            >
                                Add stock
                            </button>
                        </div>
                    </dl>
                </div>
            )}
        </section>
    );
}