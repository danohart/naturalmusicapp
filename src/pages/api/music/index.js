// pages/api/songs.js
import { getPosts } from "../../../lib/wordpress";

export default async function handler(req, res) {
  const { page = 1 } = req.query;
  const perPage = 12;

  try {
    const response = await getPosts(
      `crd_practice_music?page=${page}&per_page=${perPage}&_embed`
    );

    // Set strong cache headers
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=43200"
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return res.status(500).json({ error: "Failed to fetch songs" });
  }
}
