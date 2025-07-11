import React from 'react';
import styles from './AnalyzeContainer.module.css';
import Analyze from './Analyze';

const AnalyzeContainer = () => {
    return (
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
            <p className={styles.subtitle}>Enter a website URL to analyze its Answer Engine Optimization.</p>
            <Analyze/>
        </div>
    );
};

export default AnalyzeContainer;