import { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Play, Pause } from "lucide-react";

// Create a component that will only be rendered on the client side
const AudioPlayer = (audioFiles) => {
  const [tracks, setTracks] = useState(audioFiles || []);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (currentTrackIndex !== null && tracks[currentTrackIndex]) {
      audio.src = tracks[currentTrackIndex].url;
      audio.load();
      if (isPlaying) {
        audio.play().catch((err) => console.error("Playback failed:", err));
      }
    }
  }, [currentTrackIndex, tracks]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch((err) => console.error("Playback failed:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (currentTrackIndex === null && tracks.length > 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const handleSkipForward = () => {
    if (!audioRef.current) return;
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
          <Card className='mb-4 shadow'>
            <Card.Body>
              <div className='text-center mb-3'>
                {tracks[currentTrackIndex].label}
              </div>

              <div className='d-flex justify-content-between align-items-center mb-2'>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div
                className='progress mb-3'
                style={{ height: "8px", cursor: "pointer" }}
                onClick={handleProgressClick}
              >
                <div
                  className='progress-bar bg-primary'
                  role='progressbar'
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                  aria-valuenow={(currentTime / duration) * 100}
                  aria-valuemin='0'
                  aria-valuemax='100'
                ></div>
              </div>

              <div className='d-flex justify-content-center'>
                <Button
                  variant='outline-secondary'
                  className='me-2'
                  onClick={handleSkipBackward}
                >
                  -10s
                </Button>

                <Button
                  variant='primary'
                  className='mx-2'
                  onClick={togglePlayPause}
                  disabled={duration === 0}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </Button>

                <Button
                  variant='outline-secondary'
                  className='ms-2'
                  onClick={handleSkipForward}
                >
                  +10s
                </Button>
              </div>
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
                style={{ cursor: "pointer" }}
              >
                <Card.Body className='d-flex flex-column'>
                  <div>{track.label}</div>
                </Card.Body>
                <Card.Footer>
                  <Col className='mt-auto text-center'>
                    <Button
                      variant={
                        currentTrackIndex === index && isPlaying
                          ? "success"
                          : "primary"
                      }
                      size='sm'
                    >
                      {currentTrackIndex === index && isPlaying
                        ? "Now Playing"
                        : "Play Track"}
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
