import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface BubblesGameProps {
  onPop: () => void;
  purimMode: boolean;
}

export const BubblesGame = ({ onPop, purimMode }: BubblesGameProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppingId, setPoppingId] = useState<number | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastFrameRef = useRef<number>(0);
  const poppingIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    poppingIdRef.current = poppingId;
  }, [poppingId]);

  useEffect(() => {
    const targetFrameMs = 1000 / 30;
    const animate = (timestamp: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }

      const deltaMs = timestamp - lastFrameRef.current;
      if (deltaMs >= targetFrameMs) {
        const delta = deltaMs / (1000 / 60);
        lastFrameRef.current = timestamp;

        setBubbles((prevBubbles) =>
          prevBubbles.map((bubble) => {
            if (poppingIdRef.current === bubble.id) return bubble;

            let { x, y, vx, vy } = bubble;

            x += vx * delta;
            y += vy * delta;

            if (x <= 0 || x >= 100 - bubble.size / 10) {
              vx = -vx * 0.95;
              x = Math.max(0, Math.min(100 - bubble.size / 10, x));
            }

            if (y <= 0 || y >= 100 - bubble.size / 10) {
              vy = -vy * 0.95;
              y = Math.max(0, Math.min(100 - bubble.size / 10, y));
            }

            return { ...bubble, x, y, vx, vy };
          })
        );
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const spawnInterval = purimMode ? 800 : 1500;

    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 30 + 40,
        color: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#00ff00'][
          Math.floor(Math.random() * 5)
        ],
      };

      setBubbles((prev) => (prev.length >= 15 ? prev : [...prev, newBubble]));

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 30000);
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [purimMode]);

  const handleBubblePop = (
    id: number,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    if ('touches' in e) {
      e.preventDefault();
    }
    if (poppingIdRef.current === id) return;
    poppingIdRef.current = id;
    setPoppingId(id);
    onPop();
    playPopSound();

    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
      setPoppingId(null);
    }, 200);
  };

  const playPopSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => undefined);
      }

      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch {
      // Ignore audio errors
    }
  };

  return (
    <div className="bubbles-container">
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="bubble"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size + 14,
              height: bubble.size + 14,
              position: 'absolute',
            }}
            animate={
              poppingId === bubble.id
                ? {
                    scale: [1, 1.5, 0],
                    opacity: [1, 1, 0],
                    transition: { duration: 0.2 },
                  }
                : undefined
            }
            exit={{ opacity: 0, scale: 0 }}
            onMouseDown={(e) => handleBubblePop(bubble.id, e)}
            onTouchStart={(e) => handleBubblePop(bubble.id, e)}
          >
            <div
              className="bubble-core"
              style={{
                width: bubble.size,
                height: bubble.size,
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}aa, ${bubble.color}33)`,
                border: `2px solid ${bubble.color}`,
                boxShadow: `0 0 20px ${bubble.color}`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
