"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function getQuote() {
      const res = await fetch("/api/quote?symbol=AAPL");
      const data = await res.json();
      setQuote(data);
    }
    getQuote();
  }, []);

  return (
    <div>
      <h1>Stock Quote</h1>
      {quote ? <pre>{JSON.stringify(quote, null, 2)}</pre> : "Loading..."}
    </div>
  );
}