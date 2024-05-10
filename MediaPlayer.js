import React, { useRef, useState, useEffect } from "react";
import useMediaStore from "./store";
import { GiSpeedometer } from "react-icons/gi";
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaFastBackward,
    FaFastForward,
    FaExpand,
    FaCompress,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
} from "react-icons/fa";

import "./MediaPlayer.css";

const MediaPlayer = () => {
    const { mediaList, currentIndex, nextMedia, prevMedia } = useMediaStore();
    const currentMedia = mediaList[currentIndex];

    const mediaRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1); // Default playback rate
    const [isSpeedListOpen, setIsSpeedListOpen] = useState(false);

    // Playback rate options
    const playbackRates = [
        0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75,
        4,
    ];

    // make a function to reset the progress bar
    const resetProgressBar = () => {
        setCurrentTime(0);
        setDuration(0);
    };

    const nextMedia_resetProgressBar = () => {
        nextMedia();
        resetProgressBar();
        if(playing)
            setPlaying(!playing);
    };

    const prevMedia_resetProgressBar = () => {
        prevMedia();
        resetProgressBar();
        if(playing)
            setPlaying(!playing);
    };

    useEffect(() => {
        if (mediaRef.current) {
            mediaRef.current.volume = volume;
            mediaRef.current.playbackRate = playbackRate;
        }
    }, [volume, playbackRate]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case " ":
                    togglePlayPause();
                    break;
                case "ArrowUp":
                    increaseVolume();
                    break;
                case "ArrowDown":
                    decreaseVolume();
                    break;
                case "ArrowRight":
                    skipForward();
                    break;
                case "ArrowLeft":
                    skipBackward();
                    break;
                case "m":
                    toggleMute();
                    break;
                case "f":
                    toggleFullScreen();
                    break;
                case "Escape":
                    exitFullScreen();
                    break;
                case "w":
                    toggleMinimize();
                    break;
                case "n":
                    nextMedia();
                    resetProgressBar();
                    break;
                case "p":
                    prevMedia();
                    resetProgressBar();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            resetProgressBar();
        };
    }, [nextMedia, prevMedia, volume, playbackRate]);

    const togglePlayPause = () => {
        setPlaying(!playing);
        if (playing) {
            mediaRef.current.pause();
        } else {
            mediaRef.current.play();
        }
    };

    const increaseVolume = () => {
        let newVolume = volume + 0.1;
        if (newVolume > 1) {
            newVolume = 1;
        }
        setVolume(newVolume);
    };

    const decreaseVolume = () => {
        let newVolume = volume - 0.1;
        if (newVolume < 0) {
            newVolume = 0;
        }
        setVolume(newVolume);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        mediaRef.current.muted = !isMuted;
    };

    const skipForward = () => {
        mediaRef.current.currentTime += 10;
    };

    const skipBackward = () => {
        mediaRef.current.currentTime -= 10;
    };

    const toggleFullScreen = () => {
        if (!fullscreen) {
            mediaRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setFullscreen(!fullscreen);
    };

    const exitFullScreen = () => {
        document.exitFullscreen();
        setFullscreen(false);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleLoadedMetadata = () => {
        setDuration(mediaRef.current.duration);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(mediaRef.current.currentTime);
    };

    const handleProgressBarClick = (event) => {
        const progressBar = event.currentTarget;
        const clickPosition =
            event.clientX - progressBar.getBoundingClientRect().left;
        const clickPercentage = clickPosition / progressBar.offsetWidth;
        mediaRef.current.currentTime = clickPercentage * duration;
    };

    // Toggle the visibility of the speed list
    const toggleSpeedList = () => {
        setIsSpeedListOpen(!isSpeedListOpen);
    };

    // Handle the selection of a playback rate
    const handlePlaybackRateSelect = (rate) => {
        setPlaybackRate(rate);
        setIsSpeedListOpen(false); // Hide the list after selecting a rate
    };

    return (
        <div className={`media-player ${isMinimized ? "minimized" : ""}`}>
            <div className="media-container">
                {currentMedia.type === "audio" ? (
                    <audio
                        ref={mediaRef}
                        src={currentMedia.url}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        controls={false}
                    />
                ) : (
                    // <div className="video-container">
                        <video
                            ref={mediaRef}
                            src={currentMedia.url}
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={handleTimeUpdate}
                            controls={false}
                            style={{
                                width: "80%",
                                height: "80%",
                                objectFit: "cover",
                            }}
                        />
                    // </div>
                )}
            </div>
            <div
                className="progress-bar-container"
                onClick={handleProgressBarClick}
            >
                <div
                    className="progress-bar"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                />
            </div>
            <div className="time-display">
                <span>
                    {new Date(currentTime * 1000).toISOString().substr(11, 8)}
                </span>
                <span> / </span>
                <span>
                    {new Date(duration * 1000).toISOString().substr(11, 8)}
                </span>
            </div>
            <div className="media-controls">
                <button onClick={prevMedia_resetProgressBar}>
                    <FaChevronLeft />
                </button>
                <button onClick={togglePlayPause}>
                    {playing ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={nextMedia_resetProgressBar}>
                    <FaChevronRight />
                </button>
                <button onClick={skipBackward}>
                    <FaFastBackward />
                </button>
                <button onClick={skipForward}>
                    <FaFastForward />
                </button>
                <button onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
                <button onClick={toggleFullScreen}>
                    {fullscreen ? <FaCompress /> : <FaExpand />}
                </button>
                <button onClick={toggleMinimize}>
                    <FaTimes />
                </button>

                {/* Speed list button */}
                <button onClick={toggleSpeedList}>
                    <GiSpeedometer />
                </button>

                {/* Vertical speed list */}
                {isSpeedListOpen && (
                    <div className="speed-list">
                        {playbackRates.map((rate) => (
                            <button
                                key={rate}
                                onClick={() => handlePlaybackRateSelect(rate)}
                                className={`speed-list-item ${
                                    playbackRate === rate ? "active" : ""
                                }`}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaPlayer;
