import { useEffect, useRef, useState } from 'react';

interface AutoPlayMusicProps {
  purimMode: boolean;
}

export const AutoPlayMusic = ({ purimMode }: AutoPlayMusicProps) => {
  const [showHint, setShowHint] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioSrc = '/music.mp3';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = purimMode ? 0.8 : 0.6;
  }, [purimMode]);

  const dismiss = () => {
    setShowHint(false);

    const audio = audioRef.current;
    if (!audio) return;

    audio.play().catch(() => {
      // Retry once after a short delay
      setTimeout(() => {
        audio.play().catch(() => undefined);
      }, 100);
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else if (!showHint) {
        audio.play().catch(() => undefined);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [showHint]);

  if (!showHint) {
    return (
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />
      <div className="music-hint-overlay" onClick={dismiss}>
        <div className="music-hint">
          Tap anywhere to enter 🎭
          <button
            type="button"
            className="music-hint-button"
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
          >
            Enter the experience
          </button>
          <div className="music-hint-message">Pop the bubbles while you wait...</div>
        </div>
      </div>
    </>
  );
};
