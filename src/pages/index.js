import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Modal from "@/components/Modal";

export default function Home() {
  const { data, error, isLoading } = useSWR("/api/music?perPage=6", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return (
      <Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container>
      <Row>
        <Col className='mt-4 mb-4'>
          <h1>Church Setlist</h1>
          <hr />
        </Col>
      </Row>
      {data.map((song) => (
        <Row key={song.id}>
          <Col>
            <Modal song={song} />
          </Col>
        </Row>
      ))}
    </Container>
  );
}
