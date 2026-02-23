import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BonusItemProps {
  onCollect: () => void;
  purimMode: boolean;
}

export const BonusItem = ({ onCollect, purimMode }: BonusItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const spawnInterval = purimMode ? 8000 : 15000;

    const spawnHamantaschen = () => {
      setPosition({
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20,
      });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const interval = setInterval(spawnHamantaschen, spawnInterval);

    return () => clearInterval(interval);
  }, [purimMode]);

  const handleClick = () => {
    onCollect();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bonus-item"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            scale: { duration: 0.8, repeat: Infinity },
            rotate: { duration: 2, ease: 'linear', repeat: Infinity },
          }}
          onClick={handleClick}
          onTouchStart={handleClick}
        >
          <span className="hamantaschen">🔺</span>
          <div className="bonus-label">+10</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
