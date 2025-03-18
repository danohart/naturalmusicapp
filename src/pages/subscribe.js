import React from "react";
import { Row, Col, Card, Button, Container, ListGroup } from "react-bootstrap";
import { Check, Video, Headphones, Award, BookOpen, Clock } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function Subscribe() {
  const features = [
    {
      icon: <Video size={24} />,
      title: "400+ HD Video Lessons",
      description:
        "Learn from professional musicians with crystal-clear instructional videos",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Lyrics & Chord Charts",
      description:
        "Visual chord charts make learning easy - no sheet music required",
    },
    {
      icon: <Award size={24} />,
      title: "Progress Tracking",
      description: "Track your progress and celebrate your improvement",
    },
    {
      icon: <Clock size={24} />,
      title: "Learn at Your Own Pace",
      description:
        "Access content 24/7 from any device - mobile, tablet, or desktop",
    },
  ];

  const testimonials = [
    {
      name: "Kiyenze J.",
      quote:
        "I am happy to find your online courses, they are impressive and easy structured. God bless you.",
      instrument: "Piano",
      months: 7,
    },
    {
      name: "Aline B.",
      quote:
        "You were a great help in getting me started playing the piano once again. I now play for my church every Sunday.",
      instrument: "Piano",
      months: 4,
    },
    {
      name: "Michael T.",
      quote: `I wanted to thank you for putting this course together. I hope that you continue to teach others to play. I am having so much fun learning this way after giving up on traditional lessons 30 years ago.`,
      instrument: "Piano",
      months: 12,
    },
  ];

  return (
    <Container>
      <Head>
        <title>Subscribe to Natural Music | Master Your Instrument</title>
        <meta
          name='description'
          content='Get unlimited access to 400+ expert-led music lessons, chord charts, and practice tracks for just $20/month.'
        />
      </Head>

      <Row className='my-5 text-center'>
        <Col>
          <h1 className='display-4 fw-bold'>Transform Your Musical Journey</h1>
          <p className='lead'>
            Get unlimited access to all our premium content for just $20/month
          </p>
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col md={8} className='mx-auto'>
          <Card className='shadow border-0'>
            <Card.Body className='p-md-5'>
              <Row>
                <Col md={7}>
                  <h2 className='mb-4'>Premium Membership</h2>
                  <ListGroup variant='flush' className='mb-4'>
                    <ListGroup.Item className='border-0 ps-0'>
                      <div className='d-flex align-items-center'>
                        <div className='text-success me-3'>
                          <Check size={24} />
                        </div>
                        <div>
                          <strong>Unlimited Access</strong> to all current and
                          future lessons
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className='border-0 ps-0'>
                      <div className='d-flex align-items-center'>
                        <div className='text-success me-3'>
                          <Check size={24} />
                        </div>
                        <div>
                          <strong>10+ Complete Courses</strong> from beginner to
                          advanced
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className='border-0 ps-0'>
                      <div className='d-flex align-items-center'>
                        <div className='text-success me-3'>
                          <Check size={24} />
                        </div>
                        <div>
                          <strong>Downloadable Resources</strong> for offline
                          practice
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className='border-0 ps-0'>
                      <div className='d-flex align-items-center'>
                        <div className='text-success me-3'>
                          <Check size={24} />
                        </div>
                        <div>
                          <strong>Progress Tracking</strong> to monitor your
                          improvement
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col
                  md={5}
                  className='text-center d-flex flex-column justify-content-center align-items-center'
                >
                  <div className='pricing mb-4'>
                    <span className='display-4 fw-bold'>$20</span>
                    <span className='text-muted'>/month</span>
                  </div>
                  <div className='d-grid gap-2 mb-3 w-100'>
                    <Link
                      href='https://www.naturalmusicstore.com/courses/checkout/?add-to-cart=74&redirect=naturalmusicapp'
                      passHref
                      legacyBehavior
                    >
                      <Button variant='primary' size='lg' className='py-3'>
                        Start Your Membership
                      </Button>
                    </Link>
                  </div>
                  <small className='text-muted'>
                    30-day satisfaction guarantee
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col xs={12} className='text-center mb-4'>
          <h2>Why Musicians Love Natural Music</h2>
        </Col>
        {features.map((feature, index) => (
          <Col md={4} key={index} className='mb-4'>
            <Card className='h-100 border-0 shadow-sm'>
              <Card.Body className='d-flex flex-column align-items-center text-center p-4'>
                <div className='icon-circle bg-primary text-white rounded-circle p-3 mb-3'>
                  {feature.icon}
                </div>
                <h3 className='h5 mb-3'>{feature.title}</h3>
                <p className='text-muted'>{feature.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className='mb-5'>
        <Col xs={12} className='text-center mb-4'>
          <h2>Success Stories from Our Members</h2>
        </Col>
        {testimonials.map((testimonial, index) => (
          <Col md={4} key={index} className='mb-4'>
            <Card className='h-100 border-0 shadow-sm'>
              <Card.Body className='p-4'>
                <div className='mb-3 text-primary'>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className='me-1'>
                      ★
                    </span>
                  ))}
                </div>
                <p className='testimonial-quote mb-4'>
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className='d-flex align-items-center mt-auto'>
                  <div
                    className='testimonial-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3'
                    style={{ width: "50px", height: "50px" }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className='h6 mb-0'>{testimonial.name}</h4>
                    {/* <p className='text-muted small mb-0'>
                      {testimonial.instrument} • Member for{" "}
                      {testimonial.months + " months"}
                    </p> */}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className='mb-5'>
        <Col md={10} className='mx-auto'>
          <Card className='bg-primary text-white border-0 shadow'>
            <Card.Body className='p-5 text-center'>
              <h2 className='mb-4'>Ready to Master Your Instrument?</h2>
              <p className='lead mb-4'>
                Join thousands of musicians who are learning with Natural Music.
              </p>
              <Link
                href='https://www.naturalmusicstore.com/courses/checkout/?add-to-cart=74&redirect=naturalmusicapp'
                passHref
                legacyBehavior
              >
                <Button variant='light' size='lg' className='px-5 py-3'>
                  Start Your Membership Today
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
