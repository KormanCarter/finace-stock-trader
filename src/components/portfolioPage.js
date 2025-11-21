"use client";

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
}
