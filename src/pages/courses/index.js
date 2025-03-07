// pages/courses.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        setCourses(data.posts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  return (
    <>
      <Head>
        <title>Music Courses | Natural Music Store</title>
        <meta
          name='description'
          content='Browse our selection of music courses for all skill levels'
        />
      </Head>

      <h1 className='text-center mb-3'>Music Courses</h1>

      <Row xs={1} md={2} lg={3} className='g-4'>
        {courses.map((course) => {
          const featuredImage = course._embedded?.["wp:featuredmedia"]?.[0];
          const imageUrl =
            featuredImage?.source_url || "/placeholder-course.jpg";
          const isFeatured = course.meta._course_featured === "featured";
          return (
            <Col
              key={course.id}
              className={`course ${isFeatured ? "featured" : ""}`}
            >
              <Card className='h-100 shadow-sm hover-card'>
                <div
                  className='image-container'
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <Card.Img
                    variant='top'
                    src={imageUrl}
                    alt={featuredImage?.alt_text || course.title?.rendered}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title
                    dangerouslySetInnerHTML={{
                      __html: course.title?.rendered,
                    }}
                  />
                  <Card.Text
                    dangerouslySetInnerHTML={{
                      __html: course.excerpt?.rendered,
                    }}
                    className='text-muted'
                  />
                </Card.Body>
                <Card.Footer className='bg-white border-top-0'>
                  <Link
                    href={`/courses/${course.slug}`}
                    className='btn btn-primary w-100'
                  >
                    View Course
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}

        {courses.length === 0 && (
          <Col xs={12}>
            <div className='text-center py-5'>
              <p>No courses found.</p>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}
