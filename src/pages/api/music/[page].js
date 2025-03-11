import { getPosts } from "../../../lib/wordpress";
import { extractAudioFiles } from "../../../lib/extractAudioFiles";

export default async function handler(req, res) {
  const { page, perPage } = req.query;

  const postsResponse = await getPosts(
    "crd_practice_music" +
      `${page ? `?page=${page}` : ""}` +
      `&per_page=${perPage || 10}` +
      `&_embed`
  );

  const processedResponse = postsResponse.map((post) => {
    return {
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      audioFiles: extractAudioFiles(post.content.rendered),
      featuredImage:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
    };
  });

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return res.status(200).json(processedResponse);
}
