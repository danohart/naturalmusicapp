import { Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className='bg-light text-dark mt-5'>
      <Row className='py-3 text-center'>
        <Col md={12}>&copy; {new Date().getFullYear()} Natural Music.</Col>
        <Col md={12} className={"text-muted"}>
          All rights reserved.
        </Col>
      </Row>
    </footer>
  );
}
