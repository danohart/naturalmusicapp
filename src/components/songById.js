import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import htmlHelper from "@/lib/htmlHelper";
import { ArrowRight } from "lucide-react";

export default function SongListByUrl() {
  const router = useRouter();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!router.isReady) return;

      setLoading(true);
      try {
        const songIds = router.query.songs ? router.query.songs.split(",") : [];

        if (songIds.length === 0) {
          setError("No songs specified in URL");
          setLoading(false);
          return;
        }

        const songsData = await Promise.all(
          songIds.map(async (id) => {
            const res = await fetch(`/api/song/${id}`);
            if (!res.ok) throw new Error(`Error fetching song ${id}`);
            return res.json();
          })
        );

        setSongs(songsData);
      } catch (err) {
        setError(`Error loading songs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div className='text-center my-4'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading songs...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className='alert alert-danger'>{error}</div>;
  }

  return (
    <Card>
      <Card.Header>
        <h4>Song List</h4>
      </Card.Header>
      <ListGroup variant='flush'>
        {songs.map((song) => (
          <ListGroup.Item
            key={song.id}
            className='d-flex justify-content-between align-items-center'
          >
            <div>
              <h5>{htmlHelper(song.title.rendered)}</h5>
            </div>
            <Link href={`/song/${song.id}`} passHref legacyBehavior>
              <a className='btn btn-outline-primary btn-sm'>
                View Song <ArrowRight />
              </a>
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
