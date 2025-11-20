export default function BudgetPage() {
    return (
        <main className="min-h-screen bg-[#040810] px-6 py-12 text-white">
            <section className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-10 shadow-2xl">
                <div>
                    <p className="text-xs uppercase tracking-[0.6em] text-emerald-300">MansaMoney</p>
                    <h1 className="mt-2 text-4xl font-black">Budget Tracker</h1>
                    <p className="mt-3 text-slate-200">
                        Because this component lives at
                        <code className="mx-1 rounded bg-black/40 px-2 py-0.5 text-emerald-200">src/app/budget/page.js</code>,
                        heading to <span className="text-emerald-200">/budget</span> will render it automatically. Use this surface
                        for cashflow summaries, savings targets, or AI-driven alerts.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                        <h2 className="text-lg font-semibold">Quick Ideas</h2>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-emerald-50">
                            <li>Monthly spend vs. budget gauges.</li>
                            <li>Upcoming bills with autopay status.</li>
                            <li>Rule-based alerts (e.g., safe-to-spend).</li>
                        </ul>
                    </article>
                    <article className="rounded-xl border border-white/15 bg-white/5 p-6">
                        <h2 className="text-lg font-semibold">Next Steps</h2>
                        <p className="mt-3 text-sm text-slate-100">
                            Pull in the same Finnhub or Plaid data you use elsewhere, or connect a spreadsheet. Once
                            you have a nav, wire a link to /budget so users can pivot quickly from the dashboard.
                        </p>
                    </article>
                </div>
            </section>
        </main>
    );
}
