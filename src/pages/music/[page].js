import { Container, Row, Col } from "react-bootstrap";
import htmlHelper from "@/lib/htmlHelper";
import Head from "next/head";
import Link from "next/link";
import PaginationComponent from "@/components/Pagination";

export default function MusicPage({ songs, totalPages, pageNumber }) {
  return (
    <Container>
      <Head>
        <title>Church Setlist // Natural Music App</title>
      </Head>
      <Row>
        <Col className='mt-4'>
          <h1>Church Setlist</h1>
          <hr />
        </Col>
      </Row>

      {songs.map((song, index) => (
        <Row key={song.id} className={index % 2 === 0 ? "song-row" : ""}>
          <Col className='d-flex align-items-center p-3'>
            <Link href={`/song/${song.id}`} className='text-decoration-none'>
              {htmlHelper(song.title.rendered)}
            </Link>
          </Col>
        </Row>
      ))}

      <PaginationComponent
        totalPages={totalPages}
        currentPage={pageNumber}
        baseUrl='/music'
      />
    </Container>
  );
}

export async function getStaticPaths() {
  try {
    const { getPosts } = require("../../lib/wordpress");
    const countResponse = await getPosts("crd_practice_music?per_page=1");

    const totalPosts = parseInt(countResponse.totalPosts);
    const totalPages = Math.ceil(totalPosts / 12);

    const paths = [];
    for (let i = 1; i <= totalPages; i++) {
      paths.push({ params: { page: i.toString() } });
    }

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Failed to generate paths:", error);
    return {
      paths: [{ params: { page: "1" } }],
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const pageNumber = parseInt(params.page) || 1;
    const postsPerPage = 12;
    const { getPosts } = require("../../lib/wordpress");

    // Get the total number of posts
    const countResponse = await getPosts("crd_practice_music?per_page=1");
    const totalPosts = parseInt(countResponse.totalPosts);
    const totalPages = Math.ceil(totalPosts / 12);

    if (pageNumber < 1 || pageNumber > totalPages) {
      return {
        redirect: {
          destination: "/music/1",
          permanent: false,
        },
      };
    }

    // Fetch only minimal data for the song list
    const pageResponse = await getPosts(
      `crd_practice_music?page=${pageNumber}&per_page=${postsPerPage}&_fields=id,title`
    );

    return {
      props: {
        songs: pageResponse.posts,
        totalPages,
        pageNumber,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return {
      props: {
        songs: [],
        totalPages: 0,
        pageNumber: 1,
      },
      revalidate: 3600,
    };
  }
}
