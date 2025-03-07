import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Card, ListGroup, Badge, Spinner } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";
import { useSubscription } from "../../contexts/SubscriptionContext";

export default function CourseDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { isSubscribed } = useSubscription();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCourseAndLessons = async () => {
      setLoading(true);
      try {
        const courseRes = await fetch(`/api/courses/by-slug/${slug}`);

        if (!courseRes.ok) {
          throw new Error(`Error fetching course: ${courseRes.status}`);
        }

        const courseData = await courseRes.json();
        setCourse(courseData);

        if (courseData.id) {
          const lessonsRes = await fetch(
            `/api/courses/${courseData.id}/lessons`
          );

          if (!lessonsRes.ok) {
            throw new Error(`Error fetching lessons: ${lessonsRes.status}`);
          }

          const lessonsData = await lessonsRes.json();
          setLessons(lessonsData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch course data:", err);
        setError("Failed to load course information. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
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

  if (!course) {
    return (
      <Row className='text-center my-5'>
        <div className='alert alert-warning' role='alert'>
          Course not found
        </div>
        <Link href='/courses' className='btn btn-primary mt-3'>
          Back to Courses
        </Link>
      </Row>
    );
  }

  const featuredImage = course._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredImage?.source_url || "/placeholder-course.jpg";

  return (
    <>
      <Head>
        <title>{course.title?.rendered} | Natural Music Store</title>
        <meta
          name='description'
          content={
            course.excerpt?.rendered
              ?.replace(/<[^>]*>/g, "")
              .substring(0, 160) ||
            `Learn ${course.title?.rendered} at Natural Music Store`
          }
        />
      </Head>

      <Row className='mb-5'>
        <Col md={8}>
          <h1 dangerouslySetInnerHTML={{ __html: course.title?.rendered }} />
          <div dangerouslySetInnerHTML={{ __html: course.excerpt?.rendered }} />
        </Col>
        {!isSubscribed ? (
          <Col md={4}>
            <Card>
              <Card.Img
                variant='top'
                src={imageUrl}
                alt={course.title?.rendered}
              />
              <Card.Body>
                <Link
                  href={`/enroll/${course.id}`}
                  className='btn btn-secondary btn-lg w-100'
                >
                  Enroll Now
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ) : null}
      </Row>

      <Row>
        <Col>
          <h2 className='mb-4'>Course Lessons</h2>
          {lessons.length > 0 ? (
            <Card>
              <ListGroup variant='flush'>
                {lessons.map((lesson, index) => (
                  <ListGroup.Item
                    key={lesson.id}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <div>
                      {isSubscribed ? (
                        <Link href={`/lessons/${lesson.slug}`}>
                          <span className='me-2 text-muted'>{index + 1}.</span>
                          <span
                            dangerouslySetInnerHTML={{ __html: lesson.title }}
                          />
                        </Link>
                      ) : (
                        <>
                          <span className='me-2 text-muted'>{index + 1}.</span>
                          <span
                            dangerouslySetInnerHTML={{ __html: lesson.title }}
                          />
                        </>
                      )}
                    </div>
                    <div className='d-flex justify-content-end'>
                      {lesson.length && (
                        <Badge bg='light' text='dark'>
                          {lesson.length} min
                        </Badge>
                      )}
                      <Badge
                        bg={
                          lesson.complexity === "easy"
                            ? "info"
                            : lesson.complexity === "medium"
                            ? "warning"
                            : lesson.complexity === "hard"
                            ? "danger"
                            : "secondary"
                        }
                        className='ms-2'
                      >
                        {lesson.complexity.charAt(0).toUpperCase() +
                          lesson.complexity.slice(1)}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          ) : (
            <div className='alert alert-info'>
              No lessons available for this course yet.
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}
