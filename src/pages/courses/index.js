// pages/courses.js
import React, { useState } from "react";
import { Container, Row, Col, Card, Tabs, Tab } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";

export default function CoursesPage({ courses, error }) {
  const [activeTab, setActiveTab] = useState("piano");

  if (error) {
    return (
      <Row className='text-center my-5'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      </Row>
    );
  }

  const guitarCourses = courses.filter((course) =>
    course["course-category"]?.includes(963)
  );

  const bassCourses = courses.filter((course) =>
    course["course-category"]?.includes(2007)
  );

  const pianoCourses = courses.filter(
    (course) =>
      !course["course-category"] || course["course-category"].length === 0
  );

  // Display courses based on active tab
  const getCoursesToDisplay = () => {
    switch (activeTab) {
      case "piano":
        return pianoCourses;
      case "guitar":
        return guitarCourses;
      case "bass":
        return bassCourses;

      default:
        return courses;
    }
  };

  const coursesToDisplay = getCoursesToDisplay();

  return (
    <>
      <Head>
        <title>Music Courses | Natural Music Store</title>
        <meta
          name='description'
          content='Browse our selection of piano and guitar music courses for all skill levels'
        />
      </Head>

      <h1 className='text-center mb-3'>Music Courses</h1>

      <Tabs
        id='course-category-tabs'
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className='mb-4 justify-content-center'
      >
        <Tab eventKey='all' title='All Courses'></Tab>
        <Tab eventKey='piano' title={`Piano (${pianoCourses.length})`}></Tab>
        <Tab eventKey='guitar' title={`Guitar (${guitarCourses.length})`}></Tab>
        <Tab eventKey='bass' title={`Bass (${bassCourses.length})`}></Tab>
      </Tabs>

      <Row xs={1} md={2} lg={3} className='g-4'>
        {coursesToDisplay.length > 0 ? (
          coursesToDisplay.map((course) => {
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
          })
        ) : (
          <Col xs={12}>
            <div className='text-center py-5'>
              <p>No courses found in this category.</p>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}

export async function getStaticProps() {
  try {
    const apiUrl = process.env.SITE_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/courses`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        courses: data.posts || [],
        error: null,
      },
      revalidate: 3600,
    };
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    return {
      props: {
        courses: [],
        error: "Failed to load courses. Please try again later.",
      },
      revalidate: 60,
    };
  }
}
