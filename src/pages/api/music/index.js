import { getPosts } from "../../../lib/wordpress";

export default async function handler(req, res) {
  const response = await getPosts(
    "crd_practice_music" + `?per_page=${req.query.perPage}`
  );

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return res.status(200).json(response);
}
