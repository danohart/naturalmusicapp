import { Row, Col, Button } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";
import htmlHelper from "@/lib/htmlHelper";
import ChordSheetJS from "chordsheetjs";
import { useRouter } from "next/router";

export default function SongPage({ song }) {
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

  return (
    <>
      <Head>
        <title>{htmlHelper(song.title.rendered)} - Natural Music App</title>
      </Head>
      <Row>
        <Col className='mt-4'>
          <Button
            variant='outline-secondary'
            size='sm'
            className='mb-3'
            onClick={() => router.back()}
          >
            ← Back to song list
          </Button>

          <h1>{htmlHelper(song.title.rendered)}</h1>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col
          dangerouslySetInnerHTML={{
            __html: song.content.rendered,
          }}
        />
      </Row>
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

    if (!song || !song.metadata._crd_practice_song) {
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
