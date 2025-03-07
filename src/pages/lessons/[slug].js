import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Card, ListGroup, Badge, Spinner } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";
import { useSubscription } from "../../contexts/SubscriptionContext";

export default function Lesson() {
  const router = useRouter();
  const { slug } = router.query;

  const { isSubscribed } = useSubscription();
  const [lesson, setLesson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchLessonAndLessons = async () => {
      setLoading(true);
      try {
        const lessonRes = await fetch(`/api/lessons/${slug}`);

        const lessonData = await lessonRes.json();
        setLesson(lessonData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch lesson data:", err);
        setError("Failed to load lesson information. Please try again later.");
        setLoading(false);
      }
    };

    fetchLessonAndLessons();
  }, [slug]);

  if (loading) {
    return (
      <Row
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </Row>
    );
  }

  if (error) {
    return (
      <Row className='text-center my-5'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      </Row>
    );
  }

  if (!lesson) {
    return (
      <Row className='text-center my-5'>
        <div className='alert alert-warning' role='alert'>
          Lesson not found
        </div>
        <Link href='/lessons' className='btn btn-primary mt-3'>
          Back to Lessons
        </Link>
      </Row>
    );
  }

  if (!isSubscribed) {
    return (
      <Row className='text-center my-5'>
        <div className='alert alert-warning' role='alert'>
          Lesson not found
        </div>
        <Link href='/courses' className='btn btn-primary mt-3'>
          Back to Courses
        </Link>
      </Row>
    );
  }

  const featuredImage = lesson._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredImage?.source_url || "/placeholder-lesson.jpg";

  return (
    <>
      <Head>
        <title>{lesson.title?.rendered} | Natural Music Store</title>
        <meta
          name='description'
          content={
            lesson.excerpt?.rendered
              ?.replace(/<[^>]*>/g, "")
              .substring(0, 160) ||
            `Learn ${lesson.title?.rendered} at Natural Music Store`
          }
        />
      </Head>

      <Row className='mb-1'>
        <Col md={8}>
          <h1 dangerouslySetInnerHTML={{ __html: lesson.title?.rendered }} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item key={lesson.id}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: lesson.content.rendered,
                  }}
                />
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
