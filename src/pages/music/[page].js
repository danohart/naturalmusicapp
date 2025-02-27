// pages/music/[page].js
import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Modal from "@/components/Modal";
import Head from "next/head";
import PaginationComponent from "@/components/Pagination";
import { useRouter } from "next/router";

export default function MusicPage({ totalPages, initialPageNumber }) {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch songs when page changes
  useEffect(() => {
    async function loadSongs() {
      setLoading(true);
      try {
        // Use a Next.js API route to fetch just this page's songs
        const res = await fetch(`/api/music?page=${pageNumber}`);
        const data = await res.json();
        setSongs(data.posts);
      } catch (error) {
        console.error("Error loading songs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSongs();
  }, [pageNumber]);

  // Update page when URL changes
  useEffect(() => {
    if (router.query.page) {
      setPageNumber(parseInt(router.query.page));
    }
  }, [router.query.page]);

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

      {loading ? (
        <Row>
          <Col className='mt-4 text-center'>
            <Spinner animation='border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </Col>
        </Row>
      ) : (
        <>
          {songs.map((song, index) => (
            <Row key={song.id} className={index % 2 === 0 ? "song-row" : ""}>
              <Col className='d-flex align-items-center'>
                <Modal song={song} />
              </Col>
            </Row>
          ))}
        </>
      )}

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
    // Just get the total number of posts to calculate pages
    const countResponse = await getPosts("crd_practice_music?per_page=1");

    // Use the total from the WordPress response headers
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
    const { getPosts } = require("../../lib/wordpress");

    // Just get the count to determine total pages
    const countResponse = await getPosts("crd_practice_music?per_page=1");
    const totalPosts = parseInt(countResponse.totalPosts);
    const totalPages = Math.ceil(totalPosts / 12);

    // If the page doesn't exist, redirect to page 1
    if (pageNumber < 1 || pageNumber > totalPages) {
      return {
        redirect: {
          destination: "/music/1",
          permanent: false,
        },
      };
    }

    return {
      props: {
        totalPages,
        initialPageNumber: pageNumber,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return {
      props: {
        totalPages: 0,
        initialPageNumber: 1,
      },
      revalidate: 3600,
    };
  }
}
