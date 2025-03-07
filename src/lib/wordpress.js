const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://naturalmusicstore.test/wp-json/wp/v2/"
    : "https://naturalmusicstore.com/wp-json/wp/v2/";

export async function getPosts(args) {
  const postsRes = await fetch(BASE_URL + args);

  const totalPosts = postsRes.headers.get("X-WP-Total");
  const totalPages = postsRes.headers.get("X-WP-TotalPages");

  const posts = await postsRes.json();
  return {
    posts,
    totalPosts: parseInt(totalPosts, 10),
    totalPages: parseInt(totalPages, 10),
  };
}

export async function getSinglePost(endpoint) {
  try {
    const response = await fetch(`${BASE_URL + endpoint}`);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching single post:", error);
    return null;
  }
}

export async function getPost(slug) {
  const posts = await getPosts();
  const postArray = posts.filter((post) => post.slug == slug);
  const post = postArray.length > 0 ? postArray[0] : null;
  return post;
}

export async function getFeaturedMedia(post, size) {
  if (!post["_embedded"]["wp:featuredmedia"]) return null;
  const featuredMedia = await post["?_embedded"]["wp:featuredmedia"][0]
    .media_details.sizes[size].source_url;

  return featuredMedia;
}

export async function getPages() {
  const pagesRes = await fetch(BASE_URL + "/pages?_embed");
  const pages = await pagesRes.json();
  return pages;
}

export async function getSlugs(type) {
  let elements = [];
  switch (type) {
    case "posts":
      elements = await getPosts();
      break;
  }

  const elementsIds = elements.map((element) => {
    return {
      params: {
        slug: element.slug,
      },
    };
  });
  return elementsIds;
}
