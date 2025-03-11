import { getPosts } from "../../../lib/wordpress";

export default async function handler(req, res) {
  try {
    const courses = await getPosts(`courses?_embed&per_page=100`);

    const hiddenCourses = [672];

    if (!courses) {
      return res.status(404).json({ error: "Courses not found" });
    }

    const filteredCourses = {
      ...courses,
      posts: courses.posts.filter(
        (course) => !hiddenCourses.includes(course.id)
      ),
    };

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=43200"
    );

    return res.status(200).json(filteredCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ error: "Failed to fetch courses" });
  }
}
