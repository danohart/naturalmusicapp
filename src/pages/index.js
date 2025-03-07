import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import Head from "next/head";
import ProtectedContent from "@/components/ProtectedContent";

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/music/1");
  };

  return (
    <Row>
      <Head>
        <title>Natural Music App</title>
      </Head>

      <Col className='vh-100 flex-column justify-content-center align-items-center d-flex text-center'>
        <h5 className='text-muted fw-light mb-2'>Welcome to</h5>
        <h1 className='display-2 fw-bold mb-2'>Natural Music App</h1>

        <p className='lead mb-5'>Find your favorite church music right here.</p>

        <Button
          size='lg'
          variant='primary'
          onClick={handleRedirect}
          className='px-5 py-3 shadow-sm'
        >
          View All Songs
        </Button>
      </Col>
    </Row>
  );
}
