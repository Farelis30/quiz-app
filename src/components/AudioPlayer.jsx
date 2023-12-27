import React, { useEffect, useRef } from "react";

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);

  const handleEnded = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.addEventListener("ended", handleEnded);

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {})
        .catch((error) => {
          console.error("Autoplay failed:", error);
        });
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src]);

  return <audio ref={audioRef} src={src} />;
};

export default AudioPlayer;
