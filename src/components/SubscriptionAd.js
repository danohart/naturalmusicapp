import { Row, Col, Card, Button } from "react-bootstrap";
import Link from "next/link";

export default function SubscriptionAd({ hasLogin }) {
  return (
    <Row>
      <Col>
        <Card className='text-white text-center bg-primary p-4 mt-4'>
          <Card.Title>
            <h2>Start Your Musical Journey Today</h2>
          </Card.Title>
          <Card.Text>
            Sign up now to have access to all that Natural Music has to offer.
            <br />
            <Link
              href='https://www.naturalmusicstore.com/courses/checkout/?add-to-cart=74&redirect=naturalmusicapp'
              target='_blank'
              passHref
            >
              <Button
                variant='light'
                size='lg'
                className='text-dark mt-4 w-100'
              >
                Get Started
              </Button>
            </Link>
          </Card.Text>
        </Card>
        {hasLogin && (
          <Row>
            <Col className='text-primary text-center mt-2'>
              Already subscribed? <Link href='/login'>Log In</Link>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
