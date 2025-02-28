import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Alert,
} from "react-bootstrap";
import htmlHelper from "@/lib/htmlHelper";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PaginationComponent from "@/components/Pagination";
import { PlusCircle, CheckCircle, Share2, ClipboardIcon } from "lucide-react";

export default function MusicPage({ songs, totalPages, pageNumber }) {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
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
    // Hide share options when selection changes
    setShowShareOptions(false);
    setCopied(false);
  };

  const generateShareUrl = () => {
    if (selectedSongs.length === 0) return;

    const baseUrl = window.location.origin;
    const songIdsParam = selectedSongs.join(",");
    const url = `${baseUrl}/setlist?songs=${songIdsParam}`;

    setShareUrl(url);
    setShowShareOptions(true);
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
    <Container>
      <Head>
        <title>Church Setlist // Natural Music App</title>
      </Head>
      <Row>
        <Col className='mt-4'>
          <div className='d-flex justify-content-between align-items-center'>
            <h1>Church Setlist</h1>
            {selectedSongs.length > 0 && (
              <div className='d-flex'>
                <Button
                  variant='primary'
                  size='sm'
                  onClick={generateShareUrl}
                  className='me-2'
                >
                  <Share2 size={16} className='me-1' />
                  Share ({selectedSongs.length})
                </Button>
                <Button
                  variant='outline-secondary'
                  size='sm'
                  onClick={clearSelection}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
          <hr />
        </Col>
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
                  variant='success'
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

      {songs.map((song, index) => (
        <Row key={song.id} className={index % 2 === 0 ? "song-row" : ""}>
          <Col className='d-flex align-items-center p-3'>
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
                <CheckCircle size={16} />
              ) : (
                <PlusCircle size={16} />
              )}
            </Button>
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
