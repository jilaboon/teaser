import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPartyTime: boolean;
  totalSeconds: number;
}

export const useCountdown = (targetDate: string): TimeRemaining => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPartyTime: false,
    totalSeconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = DateTime.now().setZone('Asia/Jerusalem');
      const target = DateTime.fromISO(targetDate, { zone: 'Asia/Jerusalem' });

      const diff = target.diff(now, ['days', 'hours', 'minutes', 'seconds']);
      const diffMs = diff.as('milliseconds');

      if (diffMs <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPartyTime: true,
          totalSeconds: 0,
        });
        return;
      }

      setTimeRemaining({
        days: Math.floor(diff.days),
        hours: Math.floor(diff.hours),
        minutes: Math.floor(diff.minutes),
        seconds: Math.floor(diff.seconds),
        isPartyTime: false,
        totalSeconds: diff.as('seconds'),
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeRemaining;
};
