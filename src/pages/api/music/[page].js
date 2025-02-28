import { getPosts } from "../../../lib/wordpress";

export default async function handler(req, res) {
  const { page, perPage } = req.query;

  const response = await getPosts(
    "crd_practice_music" +
      `${page ? `?page=${page}` : ""}` +
      `&per_page=${perPage}` +
      `&_embed`
  );

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return res.status(200).json(response);
}
