import { Container, Row, Col, Spinner } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
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
      <Row>
        <Col className='mt-4'>
          <Link href='/music/1'>
            <h2>Go to Music</h2>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
