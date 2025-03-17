import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";
import htmlHelper from "@/lib/htmlHelper";
import extractAudioFiles from "@/lib/extractAudioFiles";
import ChordSheetJS from "chordsheetjs";
import { useRouter } from "next/router";
import AudioPlayer from "@/components/AudioPlayer";
import PremiumContentPreview from "@/components/PremiumContentPreview";
import FloatingSubscriptionCTA from "@/components/FloatingSubscriptionCTA";

export default function SongPage({ song }) {
  const [justLyrics, setJustLyrics] = useState(false);
  const router = useRouter();
  if (!song) {
    return (
      <Row>
        <Col className='mt-4'>
          <h1>Song not found</h1>
          <Link href='/music/1' passHref>
            <Button variant='primary'>Back to song list</Button>
          </Link>
        </Col>
      </Row>
    );
  }

  function parseSong(songContent) {
    const parser = new ChordSheetJS.ChordProParser();

    if (songContent === undefined)
      return [{ metadata: { _crd_practice_song: "Loading" } }];
    const song = parser.parse(songContent[0]);

    const formatter = new ChordSheetJS.HtmlDivFormatter();
    const songDisplay = formatter.format(song);

    return songDisplay;
  }

  const songTitle = htmlHelper(song.title.rendered);

  return (
    <>
      <Head>
        <title>{songTitle} - Natural Music App</title>
      </Head>
      <Row>
        <Col>
          <Button
            variant='info'
            size='sm'
            className='mb-3'
            onClick={() => router.back()}
          >
            ← Back to song list
          </Button>

          <h1>{songTitle}</h1>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col>{AudioPlayer(extractAudioFiles(song.content.rendered))}</Col>
      </Row>

      {song.metadata._crd_practice_song && (
        <Row>
          <Col xs={7} lg={3}>
            <h2>Lyrics & Chords</h2>
          </Col>
          <Col xs={5} lg={9}>
            <Button
              pill
              variant={!justLyrics ? "primary" : "outline-primary"}
              size='sm'
              className='me-1'
              onClick={() => setJustLyrics(!justLyrics)}
            >
              Chords
            </Button>
            <Button
              pill
              variant={justLyrics ? "primary" : "outline-primary"}
              size='sm'
              onClick={() => setJustLyrics(!justLyrics)}
            >
              Lyrics
            </Button>
          </Col>
          <Col
            xs={12}
            className={justLyrics ? "song just-lyrics" : "song"}
            dangerouslySetInnerHTML={{
              __html: parseSong(song.metadata._crd_practice_song),
            }}
          />
          {/* <PremiumContentPreview
            songTitle={songTitle}
            courseId={relatedCourseId}
            previewUrl='https://www.youtube.com/embed/sample-preview'
            lessonCount={20}
          /> */}
          <FloatingSubscriptionCTA />
        </Row>
      )}
    </>
  );
}

export async function getStaticPaths() {
  try {
    const { getPosts } = require("../../lib/wordpress");

    const response = await getPosts(
      "crd_practice_music?per_page=100&_fields=id"
    );

    const paths = response.posts.map((song) => ({
      params: { id: song.id.toString() },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Failed to generate song paths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const songId = params.id;
    const { getSinglePost } = require("../../lib/wordpress");
    const song = await getSinglePost(`crd_practice_music/${songId}?_embed`);

    if (!song) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        song,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.error(`Failed to fetch song with ID ${params.id}:`, error);
    return {
      notFound: true,
    };
  }
}
