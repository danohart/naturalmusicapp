import { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Play, Pause, Redo, Undo } from "lucide-react";

// Create a component that will only be rendered on the client side
const AudioPlayer = (audioFiles) => {
  const [tracks, setTracks] = useState(audioFiles || []);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTracks, setLoadedTracks] = useState({});

  // Create the audio element ref
  const audioRef = useRef(null);

  // Initialize audio on component mount
  useEffect(() => {
    // Initialize the Audio object only on the client
    audioRef.current = new Audio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Setup audio event listeners
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      if (currentTrackIndex !== null) {
        setLoadedTracks((prev) => ({
          ...prev,
          [currentTrackIndex]: true,
        }));
      }
    };
    const handleWaiting = () => {
      setIsLoading(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
    };
  }, [currentTrackIndex]);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (currentTrackIndex !== null && tracks[currentTrackIndex]) {
      setIsLoading(true);
      audio.src = tracks[currentTrackIndex].url;
      audio.load();

      // Only attempt to play if explicitly requested
      if (isPlaying) {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrackIndex, tracks]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying && !isLoading) {
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoading]);

  const togglePlayPause = () => {
    if (currentTrackIndex === null && tracks.length > 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    } else if (!isLoading) {
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index) => {
    // If clicking on the same track that's already loading, do nothing
    if (currentTrackIndex === index && isLoading) return;

    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || isLoading) return;

    const progressBar = e.currentTarget;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkipBackward = () => {
    if (!audioRef.current || isLoading) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const handleSkipForward = () => {
    if (!audioRef.current || isLoading) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  // If no tracks are provided, show a message
  if (!tracks || tracks.length === 0) {
    return <div className='alert alert-info'>No audio tracks available</div>;
  }

  return (
    <Row className='mt-4'>
      <Col>
        <h2 className='mb-4 text-center'>Audio Practice Tracks</h2>

        {currentTrackIndex !== null && tracks[currentTrackIndex] && (
          <Card className='mb-2 shadow'>
            <Card.Body>
              <div className='text-center'>
                {tracks[currentTrackIndex].label}
              </div>

              <div className='d-flex justify-content-between align-items-center mb-2'>
                <span>{formatTime(currentTime)}</span>
                <span>{isLoading ? "Loading..." : formatTime(duration)}</span>
              </div>

              <div
                className='progress mb-3'
                style={{
                  height: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
                onClick={handleProgressClick}
              >
                <div
                  className='progress-bar bg-primary'
                  role='progressbar'
                  style={{
                    width: isLoading
                      ? "100%"
                      : `${(currentTime / duration) * 100}%`,
                    opacity: isLoading ? 0.5 : 1,
                    animation: isLoading
                      ? "progress-bar-stripes 1s linear infinite"
                      : "none",
                  }}
                  aria-valuenow={(currentTime / duration) * 100}
                  aria-valuemin='0'
                  aria-valuemax='100'
                ></div>
              </div>

              <Row>
                <Col className='d-flex align-items-center justify-content-center'>
                  <Button
                    variant='outline-secondary'
                    className='me-2'
                    size='sm'
                    onClick={handleSkipBackward}
                    disabled={isLoading}
                  >
                    <Undo size={16} />
                  </Button>

                  <Button
                    variant='primary'
                    size='lg'
                    className='mx-2'
                    onClick={togglePlayPause}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner animation='border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                      </Spinner>
                    ) : isPlaying ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} />
                    )}
                  </Button>

                  <Button
                    variant='outline-secondary'
                    className='ms-2'
                    size='sm'
                    onClick={handleSkipForward}
                    disabled={isLoading}
                  >
                    <Redo size={16} />
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Track List */}
        <Row>
          {tracks.map((track, index) => (
            <Col key={index} xs={6} md={4} className='track mb-4'>
              <Card
                className={`h-100 ${
                  currentTrackIndex === index ? "border-primary" : ""
                }`}
                onClick={() => playTrack(index)}
                style={{
                  cursor:
                    isLoading && currentTrackIndex === index
                      ? "wait"
                      : "pointer",
                }}
              >
                <Card.Body className='d-flex flex-column'>
                  <div>{track.label}</div>
                </Card.Body>
                <Card.Footer>
                  <Col className='mt-auto text-center'>
                    <Button
                      variant={
                        currentTrackIndex === index && isPlaying && !isLoading
                          ? "success"
                          : "primary"
                      }
                      size='sm'
                      disabled={isLoading && currentTrackIndex === index}
                    >
                      {currentTrackIndex === index && isLoading ? (
                        <span className='d-flex align-items-center justify-content-center'>
                          <Spinner
                            as='span'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                          Loading...
                        </span>
                      ) : currentTrackIndex === index && isPlaying ? (
                        "Now Playing"
                      ) : (
                        "Play Track"
                      )}
                    </Button>
                  </Col>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default AudioPlayer;
