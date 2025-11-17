export async function GET(request) {
  const symbol = request.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return Response.json({ error: "Symbol query parameter is required." }, { status: 400 });
  }

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return Response.json(
      { error: "Server missing FINNHUB_API_KEY. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`);

    if (!res.ok) {
      return Response.json({ error: "Finnhub rejected the request. Check the ticker or try later." }, { status: 502 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Quote fetch failed", error);
    return Response.json({ error: "Unable to reach Finnhub." }, { status: 502 });
  }
}