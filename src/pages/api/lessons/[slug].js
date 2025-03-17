import { getSinglePost } from "../../../lib/wordpress";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: "Lesson slug is required" });
  }

  try {
    const lesson = await getSinglePost(`lessons?slug=${slug}&_embed`);

    if (!lesson || lesson.length === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.status(200).json(lesson[0]);
  } catch (error) {
    console.error("Error fetching course:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch course", error: error.message });
  }
}
