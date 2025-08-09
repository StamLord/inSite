import React from 'react';
import styles from './AnalyzeContainer.module.css';
import Analyze from './Analyze';

const AnalyzeContainer = () => {
    return (
        <div className={styles.content}>
            <div className={styles.heroTitle}>
                <h3>See How AI Answers Talk About Your Brand</h3>
            </div>
            <p className={styles.subtitle}>Enter your site’s URL to discover how AI search engines rank and describe you — and how to improve it.</p>
            <div className={styles.analyzeContainer}>
                <Analyze/>
            </div>
        </div>
    );
};

export default AnalyzeContainer;