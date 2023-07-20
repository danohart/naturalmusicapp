import React, { useState, useEffect } from "react";
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { Row, Col } from "react-bootstrap";

export default function Home() {
  const [chartData, setChartData] = useState("Loading");
  const { data, error, isLoading } = useSWR("/api/hello", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div>Loading</div>;
  }

  console.log(data);

  return (
    <div>
      {data.map((song) => (
        <div key={song.id}>
          <Row>
            <Col>
              <h2>
                <a href={`?page=chordchart&id=${song.id}`}>
                  {song.title.rendered}
                </a>
              </h2>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
}
