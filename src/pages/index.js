import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/music/1");
  };

  return (
    <Container className='vh-100 d-flex flex-column justify-content-center align-items-center'>
      <Head>
        <title>Natural Music App</title>
      </Head>

      <Row>
        <Col className='text-center'>
          <h5 className='text-muted fw-light mb-2'>Welcome to</h5>
          <h1 className='display-3 fw-bold mb-4'>Natural Music App</h1>

          <p className='lead mb-5'>
            Find your favorite church music right here.
          </p>

          <Button
            size='lg'
            variant='primary'
            onClick={handleRedirect}
            className='px-5 py-3 shadow-sm'
          >
            View Church Setlist
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
