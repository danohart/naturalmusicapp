import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Play, Lock, Video } from "lucide-react";
import Link from "next/link";
import { useSubscription } from "../contexts/SubscriptionContext";

const PremiumContentPreview = ({
  songTitle,
  courseId,
  previewUrl,
  lessonCount,
}) => {
  const { isSubscribed } = useSubscription();
  const [showPreview, setShowPreview] = useState(false);

  if (isSubscribed) return null;

  return (
    <Card className='my-4 border-primary'>
      <Card.Header className='bg-primary text-white'>
        <div className='d-flex align-items-center'>
          <Video size={20} className='me-2' />
          <span>Premium Learning Content</span>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={showPreview ? 12 : 8}>
            <h5>
              Master &quot;{songTitle}&quot; with step-by-step video instruction
            </h5>
            <p>
              Get access to {lessonCount}+ interactive video lessons teaching
              you exactly how to play this song and many others.
            </p>

            {showPreview ? (
              <div className='ratio ratio-16x9 mb-3'>
                <iframe
                  src={previewUrl}
                  title={`Preview for ${songTitle}`}
                  allowFullScreen
                />
              </div>
            ) : (
              <Button
                variant='outline-primary'
                onClick={() => setShowPreview(true)}
                className='mb-3'
              >
                <Play size={16} className='me-1' /> Watch Free Preview
              </Button>
            )}

            <div className='d-grid gap-2'>
              <Link href={`/courses/${courseId}`} passHref legacyBehavior>
                <Button variant='primary' size='lg'>
                  Get Full Access for $20/month
                </Button>
              </Link>
            </div>
          </Col>

          {!showPreview && (
            <Col
              md={4}
              className='text-center d-flex align-items-center justify-content-center'
            >
              <div className='position-relative'>
                <div className='position-absolute top-50 start-50 translate-middle'>
                  <Lock size={40} className='text-primary' />
                </div>
                <img
                  src='/video-lesson-preview.jpg'
                  alt='Video lesson preview'
                  className='img-fluid rounded opacity-50'
                  style={{ maxHeight: "150px" }}
                />
              </div>
            </Col>
          )}
        </Row>
      </Card.Body>
      <Card.Footer className='bg-white border-top-0 text-center text-muted'>
        <small>
          Access all courses and 400+ lessons with your subscription
        </small>
      </Card.Footer>
    </Card>
  );
};

export default PremiumContentPreview;
