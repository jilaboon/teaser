import { useState, useEffect } from 'react';
import { NeonBackground } from './components/NeonBackground';
import { BubblesGame } from './components/BubblesGame';
import { BonusItem } from './components/BonusItem';
import { MouseGlow } from './components/MouseGlow';
import { AutoPlayMusic } from './components/AutoPlayMusic';
import { ShareButton } from './components/ShareButton';
import { useCountdown } from './hooks/useCountdown';
import './App.css';

function App() {
  const targetDate = '2026-03-05T21:30:00';
  const { totalSeconds, days, hours, minutes, seconds, isPartyTime } =
    useCountdown(targetDate);

  const headerCountdown = isPartyTime
    ? 'IT\'S HERE'
    : `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`;

  const [score, setScore] = useState(0);
  const [purimMode, setPurimMode] = useState(false);
  const [showBonusScore, setShowBonusScore] = useState(false);

  const urgency = totalSeconds > 0 ? Math.max(0, 1 - totalSeconds / (7 * 24 * 60 * 60)) : 1;
  const intensity = purimMode ? 2 : 1 + urgency * 0.5;

  const handleBubblePop = () => setScore((prev) => prev + 1);
  const handleBonusCollect = () => {
    setScore((prev) => prev + 10);
    setShowBonusScore(true);
    setTimeout(() => setShowBonusScore(false), 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => setPurimMode((prev) => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <NeonBackground intensity={intensity} purimMode={purimMode} />
      <MouseGlow />
      <BubblesGame onPop={handleBubblePop} purimMode={purimMode} />
      <BonusItem onCollect={handleBonusCollect} purimMode={purimMode} />
      <AutoPlayMusic purimMode={purimMode} />

      <div className="scanlines" />
      <div className="vignette" />

      <div className="bubble-hint-badge">
        <span className="bubble-hint-icon">👆</span>
        <span className="bubble-hint-text">פוצצו בועות וצברו נקודות!</span>
      </div>

      {showBonusScore && <div className="bonus-popup">+10! 🔺</div>}

      <div className="content-wrapper">
        <header className="header">
          <h1 className="main-title glitch" data-text="PURIM PARTY">
            PURIM PARTY
            <br />
            <span className="date-big">{headerCountdown}</span>
          </h1>
          <p className="subtitle"><span className="day-name">THURSDAY</span> March 5, 2026 — 21:30</p>
          <p className="location">שמירה אימבר גדיש 9, קרית אונו</p>
          <p className="teaser-subtitle">
            <span className="teaser-hero-text">{"\u202Bאין מקום אחר!\u202C"}</span>
            <br />
            <span className="teaser-sub-text">{"\u202Bשתרצו להיות בו\u202C"}</span>
          </p>
          <ul className="party-details">
            <li>DJ מיקי לוי</li>
            <li>אוכל ושתיה</li>
            <li>מסיבת תחפושות מטורפת</li>
            <li>פרסים משוגעים</li>
            <li className="highlight-bullet">💜 ואתם 💜</li>
          </ul>
        </header>

        <footer className="footer">
          <div className="footer-item score-display">
            <span className="score-label">Score:&nbsp;</span>
            <span className="score-value">{score}</span>
          </div>

          <div className="footer-item share-item">
            <ShareButton />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
