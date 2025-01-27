import React, { useEffect, useState } from 'react';
import styles from './DancingStickman.module.css';

interface DancingStickmanProps {
  isPlaying: boolean;
}

const DancingStickman: React.FC<DancingStickmanProps> = ({ isPlaying }) => {
  const [danceMove, setDanceMove] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setDanceMove((prev) => (prev + 1) % 4);
      }, 500); // Change dance move every 500ms
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className={`${styles.stickmanContainer} ${isPlaying ? styles.dancing : ''}`}>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className={styles.stickman}
      >
        {/* Head */}
        <circle cx="50" cy="20" r="8" className={styles.neonStroke} fill="none" />
        
        {/* Body */}
        <line x1="50" y1="28" x2="50" y2="60" className={styles.neonStroke} />
        
        {/* Arms */}
        <g className={styles.arms}>
          {danceMove === 0 && (
            <>
              <line x1="50" y1="35" x2="30" y2="45" className={styles.neonStroke} />
              <line x1="50" y1="35" x2="70" y2="45" className={styles.neonStroke} />
            </>
          )}
          {danceMove === 1 && (
            <>
              <line x1="50" y1="35" x2="20" y2="35" className={styles.neonStroke} />
              <line x1="50" y1="35" x2="80" y2="35" className={styles.neonStroke} />
            </>
          )}
          {danceMove === 2 && (
            <>
              <line x1="50" y1="35" x2="30" y2="25" className={styles.neonStroke} />
              <line x1="50" y1="35" x2="70" y2="25" className={styles.neonStroke} />
            </>
          )}
          {danceMove === 3 && (
            <>
              <line x1="50" y1="35" x2="35" y2="50" className={styles.neonStroke} />
              <line x1="50" y1="35" x2="65" y2="50" className={styles.neonStroke} />
            </>
          )}
        </g>
        
        {/* Legs */}
        <g className={styles.legs}>
          {danceMove === 0 && (
            <>
              <line x1="50" y1="60" x2="35" y2="90" className={styles.neonStroke} />
              <line x1="50" y1="60" x2="65" y2="90" className={styles.neonStroke} />
            </>
          )}
          {danceMove === 1 && (
            <>
              <line x1="50" y1="60" x2="30" y2="80" className={styles.neonStroke} />
              <line x1="50" y1="60" x2="70" y2="80" className={styles.neonStroke} />
            </>
          )}
          {danceMove === 2 && (
            <>
              <line x1="50" y1="60" x2="40" y2="85" className={styles.neonStroke} />
              <line x1="50" y1="60" x2="60" y2="85" className={styles.neonStroke} />
            </>
          )}
          {danceMove === 3 && (
            <>
              <line x1="50" y1="60" x2="45" y2="90" className={styles.neonStroke} />
              <line x1="50" y1="60" x2="55" y2="90" className={styles.neonStroke} />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default DancingStickman;
