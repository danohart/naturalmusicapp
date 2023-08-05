import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Modal from "@/components/Modal";
import Head from "next/head";

export default function Home() {
  const { data, error, isLoading } = useSWR("/api/music?perPage=6", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return (
      <Container>
        <Row>
          <Col className='mt-4 mb-4'>
            <h1>Church Setlist</h1>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col className='mt-4'>
            <Spinner animation='border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

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
      {data.map((song, index) => (
        <Row key={song.id} className={index % 2 === 0 ? "song-row" : ""}>
          <Col className='d-flex align-items-center'>
            <Modal song={song} />
          </Col>
        </Row>
      ))}
    </Container>
  );
}
