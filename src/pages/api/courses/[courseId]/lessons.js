import { getPosts } from "../../../../lib/wordpress";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Get the course ID from the URL
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  try {
    const lessons = await getPosts(
      `lessons?lesson_course=${courseId}&per_page=100`
    );

    // Simplify the response to just include what we need
    const simplifiedLessons = lessons.posts.map((lesson) => ({
      id: lesson.id,
      title: lesson.title.rendered,
      slug: lesson.slug,
      complexity: lesson.meta?._lesson_complexity || "Not specified",
      length: lesson.meta?._lesson_length || null,
      isPreview: !!lesson.meta?._lesson_preview,
    }));

    return res.status(200).json(simplifiedLessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch lessons", error: error.message });
  }
}
