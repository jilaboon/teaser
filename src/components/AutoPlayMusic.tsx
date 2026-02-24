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
    // Small delay to ensure the audio element persists in the new render
    requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().catch(() => {
        setTimeout(() => {
          audio.play().catch(() => undefined);
        }, 200);
      });
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

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />
      {showHint && (
        <div className="music-hint-overlay" onClick={dismiss}>
          <div className="music-hint">
            לחצו בכל מקום להיכנס 🎭
            <button
              type="button"
              className="music-hint-button"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
            >
              כניסה למסיבה
            </button>
            <div className="music-hint-message">פוצצו בועות בזמן שאתם מחכים...</div>
          </div>
        </div>
      )}
    </>
  );
};
