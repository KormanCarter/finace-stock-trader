"use client";

import { useEffect, useState } from "react";

function formatCurrency(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
 
  return `$${value.toFixed(2)}`;
}

export default function TopMarketCapList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/topstocks");
        if (!response.ok) {
          throw new Error("Unable to load market cap list.");
        }
        const data = await response.json();
        if (active) {
          setStocks(data.stocks || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load top stocks.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading global leaders…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Top 10 Stocks by Market Cap</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, idx) => (
              <tr key={stock.symbol} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 font-semibold text-gray-700">{idx + 1}</td>
                <td className="px-4 py-2 font-mono text-gray-900">{stock.symbol}</td>
                <td className="px-4 py-2 text-gray-700">{stock.name || "—"}</td>
                <td className="px-4 py-2 text-gray-900">{formatCurrency(stock.marketCap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
