import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoPlayMusicProps {
  purimMode: boolean;
}

export const AutoPlayMusic = ({ purimMode }: AutoPlayMusicProps) => {
  const [showHint, setShowHint] = useState(true);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasAttemptedPlay = useRef(false);

  const audioSrc = '/music.mp3';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const maxVolume = purimMode ? 0.8 : 0.6;
    audio.volume = maxVolume;
  }, [purimMode]);

  const startMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (hasAttemptedPlay.current) return;
    hasAttemptedPlay.current = true;
    setShowHint(false);

    if (!audio) return;

    try {
      audio.load();
      audio.currentTime = 0;
      await audio.play();
    } catch (err) {
      console.error('Audio playback failed:', err);
      // Still dismiss overlay — user interaction was registered
    }
  }, []);

  useEffect(() => {
    const events = ['pointerdown', 'touchstart', 'mousedown', 'keydown'];
    events.forEach((event) => {
      document.addEventListener(event, startMusic, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, startMusic);
      });
    };
  }, [startMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      const audioElement = e.target as HTMLAudioElement;
      if (audioElement.error) {
        console.error('Error code:', audioElement.error.code);
        console.error('Error message:', audioElement.error.message);
      }
    };

    const handleCanPlay = () => {
      console.log('Audio file loaded and can play');
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleBlur = () => {
      audio.pause();
    };

    const handleFocus = () => {
      if (document.hidden || !hasAttemptedPlay.current) return;
      audio.play().catch(() => undefined);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else if (hasAttemptedPlay.current) {
        audio.play().catch(() => undefined);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />

      <AnimatePresence>
        {showHint && (
          <motion.div
            className="music-hint-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onPointerDown={startMusic}
            onClick={startMusic}
          >
            <motion.div
              className="music-hint"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap anywhere to enter 🎭
              {playbackError && <div className="music-hint-error">{playbackError}</div>}
              <button
                type="button"
                className="music-hint-button"
                onClick={(e) => {
                  e.stopPropagation();
                  startMusic();
                }}
              >
                Enter the experience
              </button>
              <div className="music-hint-message">Pop the bubbles while you wait...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
