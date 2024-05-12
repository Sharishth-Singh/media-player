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
    const [isHovered, setIsHovered] = useState(false); // State to track mouse hover

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
        if (playing) setPlaying(!playing);
    };

    const prevMedia_resetProgressBar = () => {
        prevMedia();
        resetProgressBar();
        if (playing) setPlaying(!playing);
    };

    useEffect(() => {
        if (mediaRef.current) {
            mediaRef.current.volume = volume;
            mediaRef.current.playbackRate = playbackRate;
            setDuration(mediaRef.current.duration);
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
        // console.log(document.fullscreenElement)
        if (!fullscreen) {
            const player = document.querySelector(".media-player");
            if (player) {
                if (player.requestFullscreen) {
                    player.requestFullscreen();
                } else if (player.mozRequestFullScreen) {
                    /* Firefox */
                    player.mozRequestFullScreen();
                } else if (player.webkitRequestFullscreen) {
                    /* Chrome, Safari & Opera */
                    player.webkitRequestFullscreen();
                } else if (player.msRequestFullscreen) {
                    /* IE/Edge */
                    player.msRequestFullscreen();
                }
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                /* Chrome, Safari & Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                /* IE/Edge */
                document.msExitFullscreen();
            }
        }
        setFullscreen(!fullscreen);
    };

    const exitFullScreen = () => {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
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
        <>
      <div className={`media-player-title ${isMinimized ? "minimized-title" : ""}`}> 🎹Media Player App</div>


<div
            className={`media-player ${isMinimized ? "minimized" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!isMinimized && (
                <div className="media-title">{currentMedia.title}</div>
            )}
            <div className="media-container">
                {currentMedia.type === "audio" ? (
                    <>
                        <audio
                            ref={mediaRef}
                            src={currentMedia.url}
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={handleTimeUpdate}
                            controls={false}
                        />
                        <div className="audio-icon">
                            <span role="img" aria-label="audio-playing-icon">
                                🎶
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="video-container">
                        <video
                            ref={mediaRef}
                            src={currentMedia.url}
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={handleTimeUpdate}
                            controls={false}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                )}
            </div>
            {(isHovered || !playing) && (
                <>
                    <div
                        className="progress-bar-container"
                        onClick={handleProgressBarClick}
                    >
                        <div
                            className="progress-bar"
                            style={{
                                width: `${(currentTime / duration) * 100}%`,
                            }}
                        />
                    </div>
                    <div className="time-display">
                        <span>
                            {new Date(currentTime * 1000)
                                .toISOString()
                                .substr(11, 8)}
                        </span>
                        <span>
                            {new Date(duration * 1000)
                                .toISOString()
                                .substr(11, 8)}
                        </span>
                    </div>
                    <div className="media-controls">
                    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={prevMedia_resetProgressBar}>
            <FaChevronLeft />
            {isHovered && <span className="control-text">Previous</span>}
        </button>
    </div>
    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={skipBackward}>
            <FaFastBackward />
            {isHovered && <span className="control-text">Rewind</span>}
        </button>
    </div>
    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={togglePlayPause}>
            {playing ? <FaPause /> : <FaPlay />}
            {isHovered && <span className="control-text">{playing ? 'Pause' : 'Play'}</span>}
        </button>
    </div>
    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={skipForward}>
            <FaFastForward />
            {isHovered && <span className="control-text">Forward</span>}
        </button>
    </div>
    
    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={nextMedia_resetProgressBar}>
            <FaChevronRight />
            {isHovered && <span className="control-text">Next</span>}
        </button>
    </div>
                      
    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            {isHovered && <span className="control-text">{isMuted ? 'Unmute' : 'Mute'}</span>}
        </button>
    </div>
    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
    <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsHovered(true); // Show volume percentage text when adjusting volume
        }}
    />
    {isHovered && <span className="control-text">Volume: {Math.round(volume * 100)}%</span>}
</div>

                       <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={toggleFullScreen} className={!isMinimized ? "visible" : "hidden"}>
            {fullscreen ? <FaCompress /> : <FaExpand />}
            {isHovered && <span className="control-text">{fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>}
        </button>
    </div>

    <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
    {!fullscreen && (
        <button onClick={toggleMinimize}>
            <FaTimes />
            {/* {isHovered && <span className="control-text">Minimize</span>} */}
            {isHovered && <span className="control-text">{isMinimized ? 'Exit' : 'Minimize'}</span>}
        </button>
    )}
</div>
                        {/* Speed list button */}
                         <div className="control-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={toggleSpeedList} className={!isMinimized ? "visible" : "hidden"}>
            <GiSpeedometer />
            {isHovered && <span className="control-text">Speed</span>}
        </button>
    </div>
                        {/* Vertical speed list */}
                        {isSpeedListOpen && (
                            <div className={`speed-list ${isMinimized ? "hidden" : "visible"}`}>
                                {playbackRates.map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={() =>
                                            handlePlaybackRateSelect(rate)
                                        }
                                        className={`speed-list-item ${
                                            playbackRate === rate
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
        </>
        
    );
};

export default MediaPlayer;
