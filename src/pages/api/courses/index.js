import { getPosts } from "../../../lib/wordpress";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const song = await getPosts(`courses?_embed`);

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Set cache headers
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=43200"
    );

    return res.status(200).json(song);
  } catch (error) {
    console.error("Error fetching song:", error);
    return res.status(500).json({ error: "Failed to fetch song" });
  }
}
