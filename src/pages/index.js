import React from "react";
import {
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { BadgeDollarSign, Clock, GraduationCap } from "lucide-react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/music/1");
  };

  const values = [
    {
      title: "Studio Quality, Fraction of the Cost",
      text: "Premium instruction at 85% less than private lessons, all on your schedule",
      icon: "BadgeDollarSign",
    },
    {
      title: "Unlimited Access Anywhere",
      text: "Stream 400+ expert-led lessons across 10+ courses on any device, anytime",
      icon: "Clock",
    },
    {
      title: "Get Tailored Learning Pathways",
      text: "From first notes to advanced techniques, with clear progression milestones",
      icon: "GraduationCap",
    },
  ];

  return (
    <Row>
      <Head>
        <title>Natural Music App</title>
      </Head>

      <Col className='homepage'>
        <Card className='text-white bg-primary p-4'>
          <Card.Title>
            <h2>Master Your Instrument, Your Way</h2>
          </Card.Title>
          <Card.Text>
            Intuitive video lessons with PDF chord charts—no sheet music
            required
          </Card.Text>
        </Card>
        <Row>
          {values.map((value) => (
            <Col xs={12} lg={4} key={value.title}>
              <Card
                border='light'
                className='text-dark bg-info p-4 mt-4 value-card'
              >
                <Card.Title>
                  <Row className='d-flex align-items-center'>
                    <Col xs={3} className='value-card-icon'>
                      {(() => {
                        switch (value.icon) {
                          case "BadgeDollarSign":
                            return <BadgeDollarSign size={48} />;
                          case "Clock":
                            return <Clock size={48} />;
                          case "GraduationCap":
                            return <GraduationCap size={48} />;
                          default:
                            return null;
                        }
                      })()}
                    </Col>
                    <Col xs={9}>{value.title}</Col>
                  </Row>
                </Card.Title>
                <Card.Text>{value.text}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>

        <h3 className='mt-5'>Complete Learning Ecosystem</h3>
        <ul className='ecosystem'>
          <li>HD video instruction with professional musicians</li>
          <li>Downloadable chord charts that visualize exactly what to play</li>
          <li>Personal progress dashboard to celebrate your growth</li>
        </ul>

        <Button
          size='lg'
          variant='primary'
          onClick={handleRedirect}
          className='px-5 py-3 shadow-sm mt-5'
        >
          View All Songs
        </Button>
      </Col>
    </Row>
  );
}
