import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { X } from "lucide-react";
import Link from "next/link";
import { useSubscription } from "../contexts/SubscriptionContext";

const FloatingSubscriptionCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isSubscribed } = useSubscription();

  useEffect(() => {
    const checkScroll = () => {
      const scrollThreshold = document.body.scrollHeight * 0.6;
      const scrollPosition = window.scrollY + window.innerHeight;

      if (scrollPosition > scrollThreshold && !dismissed && !visible) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, [dismissed, visible]);

  if (isSubscribed || dismissed || !visible) return null;

  return (
    <Row
      className='position-fixed bottom-0 start-0 end-0 p-3 bg-primary text-white shadow'
      style={{ zIndex: 1050 }}
    >
      <Col className='d-flex justify-content-between align-items-center'>
        <div className='d-none d-md-block'>
          <strong>Ready to master your instrument?</strong> Get unlimited access
          to 400+ expert lessons.
        </div>
        <div className='d-block d-md-none'>
          <strong>Master your instrument</strong>
        </div>
        <div className='d-flex align-items-center'>
          <Link href='/subscribe' passHref legacyBehavior>
            <Button variant='light' className='me-2'>
              Start Now
            </Button>
          </Link>
          <Button
            variant='link'
            className='text-white'
            onClick={() => setDismissed(true)}
            aria-label='Dismiss'
          >
            <X size={20} />
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default FloatingSubscriptionCTA;
