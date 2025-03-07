import { getPosts } from "../../../../lib/wordpress";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: "Course slug is required" });
  }

  try {
    const courses = await getPosts(`courses?slug=${slug}&_embed`);

    // If no course is found with that slug
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(courses.posts[0]);
  } catch (error) {
    console.error("Error fetching course:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch course", error: error.message });
  }
}
