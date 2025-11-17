export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) {
    return Response.json({ error: "Query parameter 'q' is required." }, { status: 400 });
  }

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return Response.json(
      { error: "Server missing FINNHUB_API_KEY. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${token}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return Response.json({ error: "Finnhub search failed. Try again shortly." }, { status: 502 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Symbol search failed", error);
    return Response.json({ error: "Unable to reach Finnhub." }, { status: 502 });
  }
}
