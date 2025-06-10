import React from 'react';
import styles from './Hero.module.css';
import Analyze from './Analyze';

const Hero = () => {
  return (
    <section className={styles.hero}>
        <div className={styles.content}>
            <div className={styles.heroTitle}>
                <span className={styles.glass}>🔍</span>
                <span className={styles.revealText}>
                    {'inSite Analyzer'.split('').map((char, i) => (
                        <span
                            key={i}
                            className={styles.letter}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </span>
            </div>
            {/* <h1>🔍 inSite Analyzer</h1> */}
            <p className={styles.subtitle}>Enter a website URL to analyze its Answer Engine Optimization.</p>
            <Analyze/>
        </div>
      <div className={styles.scrollHint}>
        <span>↓ Scroll to learn more</span>
      </div>
    </section>
  );
};

export default Hero;