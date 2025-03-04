import { Row, Col } from "react-bootstrap";
import Head from "next/head";
import SongListByUrl from "../components/songById";

export default function Setlist() {
  return (
    <>
      <Row>
        <Head>
          <title>Custom Setlist // Natural Music App</title>
        </Head>

        <Col className='mt-4'>
          <h1>Custom Setlist</h1>
          {/* <p className='lead'>
            This playlist is dynamically generated based on the song IDs in the
            URL.
          </p> */}
          <hr />
        </Col>
      </Row>
      <Row>
        <Col md={8} className='mx-auto'>
          <SongListByUrl />
        </Col>
      </Row>
    </>
  );
}
