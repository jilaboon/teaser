import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShareButton = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleShare = async () => {
    const shareData = {
      title: 'Purim Party 2026',
      text: 'PURIM PARTY 2026 🎭 Something epic is coming... March 5, 2026',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Share failed:', err);
      setToastMessage('Share failed');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <>
      <motion.button
        className="share-button"
        onClick={handleShare}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Share party invitation"
      >
        📤 Share
      </motion.button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            className="share-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
