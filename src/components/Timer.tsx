import { motion } from 'framer-motion';

export const Timer = () => {
  return (
    <motion.div
      className="party-time"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
    >
      <img className="party-mask" src="/mask.png" alt="Purim mask" />
    </motion.div>
  );
};
