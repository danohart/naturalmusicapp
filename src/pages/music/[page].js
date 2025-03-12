import { useState, useEffect } from "react";
import { Row, Col, Button, Form, InputGroup, Alert } from "react-bootstrap";
import htmlHelper from "@/lib/htmlHelper";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PaginationComponent from "@/components/Pagination";
import { PlusCircle, CheckCircle, Share, ClipboardIcon, X } from "lucide-react";
import SearchComponent from "@/components/Search";

export default function MusicPage({
  songs,
  totalPages,
  pageNumber,
  allSongTitles,
}) {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  // Load selected songs from localStorage when component mounts
  useEffect(() => {
    const savedSelection = localStorage.getItem("selectedSongs");
    if (savedSelection) {
      try {
        setSelectedSongs(JSON.parse(savedSelection));
      } catch (e) {
        console.error("Error loading saved selection:", e);
      }
    }
  }, []);

  // Save selected songs to localStorage when they change
  useEffect(() => {
    localStorage.setItem("selectedSongs", JSON.stringify(selectedSongs));
  }, [selectedSongs]);

  const toggleSongSelection = (songId) => {
    setSelectedSongs((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      } else {
        return [...prev, songId];
      }
    });

    setShowShareOptions(false);
    setCopied(false);
  };

  const generateShareUrl = () => {
    if (selectedSongs.length === 0) return;

    const baseUrl = window.location.origin;
    const songIdsParam = selectedSongs.join(",");
    const url = `${baseUrl}/setlist?songs=${songIdsParam}`;

    setShareUrl(url);
    setShowShareOptions(!showShareOptions);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const goToSharedList = () => {
    router.push(`/setlist?songs=${selectedSongs.join(",")}`);
  };

  const clearSelection = () => {
    setSelectedSongs([]);
    setShowShareOptions(false);
    setCopied(false);
  };

  return (
    <>
      <Head>
        <title>All Songs // Natural Music App</title>
      </Head>
      <Row>
        <Col>
          <div className='d-flex justify-content-between align-items-center'>
            <h1>All Songs</h1>
          </div>
        </Col>
      </Row>
      <Row className='align-items-center song-selection-bar'>
        {selectedSongs.length > 0 ? (
          <>
            <Col xs={6}>
              {selectedSongs.length} Song{selectedSongs.length > 1 ? "s" : ""}{" "}
              Selected
            </Col>
            <Col xs={6} className={"d-flex justify-content-end"}>
              <Button
                variant='light'
                size='sm'
                onClick={generateShareUrl}
                className='me-2'
              >
                <Share size={16} className='me-1' />
                Share List
              </Button>
              <Button
                variant='outline-secondary'
                size='sm'
                onClick={clearSelection}
              >
                Clear
              </Button>
            </Col>
          </>
        ) : (
          <Col className='d-flex m-2 justify-content-center'>
            Select any song to create and share a custom setlist.
            <hr />
          </Col>
        )}
      </Row>

      {showShareOptions && (
        <Row className='mb-3'>
          <Col>
            <div className='p-3 border rounded bg-light'>
              <InputGroup className='mb-2'>
                <Form.Control
                  value={shareUrl}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
                <Button variant='outline-secondary' onClick={copyToClipboard}>
                  {copied ? (
                    <CheckCircle size={18} />
                  ) : (
                    <ClipboardIcon size={18} />
                  )}
                </Button>
              </InputGroup>

              <div className='d-flex'>
                <Button
                  variant='info'
                  size='sm'
                  className='me-2'
                  onClick={goToSharedList}
                >
                  Go to Shared List
                </Button>
              </div>

              {copied && (
                <Alert variant='success' className='mt-2 py-2 mb-0'>
                  Link copied to clipboard!
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <SearchComponent
            songs={allSongTitles}
            onSongSelect={toggleSongSelection}
            selectedSongs={selectedSongs}
          />
          <hr />
        </Col>
      </Row>

      {songs.map((song, index) => (
        <Row key={song.id} className='songs p-2'>
          <Col xs={3} className='songs-image'>
            <img src={`https://picsum.photos/100?random=${index}`} />
          </Col>
          <Col xs={7}>
            <Link href={`/song/${song.id}`} className='text-decoration-none'>
              {htmlHelper(song.title.rendered)}
            </Link>
          </Col>
          <Col
            xs={2}
            className='d-flex align-items-center justify-content-center'
          >
            <Button
              variant={selectedSongs.includes(song.id) ? "primary" : "light"}
              size='sm'
              className='me-2 rounded-circle p-1'
              onClick={() => toggleSongSelection(song.id)}
              aria-label={
                selectedSongs.includes(song.id)
                  ? "Remove from selection"
                  : "Add to selection"
              }
            >
              {selectedSongs.includes(song.id) ? (
                <CheckCircle size={24} />
              ) : (
                <PlusCircle size={24} />
              )}
            </Button>
          </Col>
        </Row>
      ))}

      <PaginationComponent
        totalPages={totalPages}
        currentPage={pageNumber}
        baseUrl='/music'
      />
    </>
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

    // Get total count for pagination
    const countResponse = await getPosts(
      "crd_practice_music?per_page=1&status=publish"
    );
    const totalPosts = parseInt(countResponse.totalPosts);
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    if (pageNumber < 1 || pageNumber > totalPages) {
      return {
        redirect: {
          destination: "/music/1",
          permanent: false,
        },
      };
    }

    // Get songs for current page
    const pageResponse = await getPosts(
      `crd_practice_music?page=${pageNumber}&per_page=${postsPerPage}&_fields=id,title,status,content`
    );

    const publishedSongs = pageResponse.posts.filter(
      (post) => post.status === "publish"
    );

    // Get all songs for search (only id and title)
    const allSongsResponse = await getPosts(
      `crd_practice_music?per_page=${totalPosts}&_fields=id,title,status`
    );

    const allSongTitles = allSongsResponse.posts.filter(
      (post) => post.status === "publish"
    );

    return {
      props: {
        songs: publishedSongs,
        totalPages,
        pageNumber,
        allSongTitles,
      },
      revalidate: 86400, // Revalidate once per day
    };
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return {
      props: {
        songs: [],
        totalPages: 0,
        pageNumber: 1,
        allSongTitles: [],
      },
      revalidate: 3600, // Retry after an hour if there was an error
    };
  }
}
