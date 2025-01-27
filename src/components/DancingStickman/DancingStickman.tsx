import React, { useEffect, useState } from 'react';
import styles from './DancingStickman.module.css';

interface DancingStickmanProps {
  isPlaying: boolean;
}

interface Position {
  x: number;
  y: number;
}

const DancingStickman: React.FC<DancingStickmanProps> = ({ isPlaying }) => {
  const [danceMove, setDanceMove] = useState(0);
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 1 });

  // 随机移动
  useEffect(() => {
    if (isPlaying) {
      const moveInterval = setInterval(() => {
        setPosition(prev => {
          // 获取视窗大小
          const viewportWidth = window.innerWidth - 100; // 减去火柴人的宽度
          const viewportHeight = window.innerHeight - 220; // 减去火柴人的高度和播放器高度

          // 计算新位置
          let newX = prev.x + direction.x * 5;
          let newY = prev.y + direction.y * 5;
          let newDirectionX = direction.x;
          let newDirectionY = direction.y;

          // 碰到边界时改变方向
          if (newX <= 0 || newX >= viewportWidth) {
            newDirectionX = -direction.x;
            newX = newX <= 0 ? 0 : viewportWidth;
          }
          if (newY <= 0 || newY >= viewportHeight) {
            newDirectionY = -direction.y;
            newY = newY <= 0 ? 0 : viewportHeight;
          }

          // 随机改变方向
          if (Math.random() < 0.02) { // 2% 的概率改变方向
            newDirectionX = Math.random() < 0.5 ? -1 : 1;
            newDirectionY = Math.random() < 0.5 ? -1 : 1;
          }

          setDirection({ x: newDirectionX, y: newDirectionY });
          return { x: newX, y: newY };
        });
      }, 50); // 每50ms移动一次

      return () => clearInterval(moveInterval);
    }
  }, [isPlaying, direction]);

  // 舞蹈动作
  useEffect(() => {
    if (isPlaying) {
      const danceInterval = setInterval(() => {
        setDanceMove((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(danceInterval);
    }
  }, [isPlaying]);

  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `scaleX(${direction.x < 0 ? -1 : 1})`, // 根据移动方向翻转火柴人
  };

  return (
    <div className={`${styles.stickmanContainer} ${isPlaying ? styles.dancing : ''}`} style={style}>
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

        {/* 运动轨迹 */}
        <g className={styles.trail}>
          <circle cx="50" cy="95" r="3" className={styles.neonFill} />
          <circle cx="50" cy="95" r="6" className={styles.neonTrail} />
          <circle cx="50" cy="95" r="9" className={styles.neonTrail} />
        </g>
      </svg>
    </div>
  );
};

export default DancingStickman;
