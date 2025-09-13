import React from 'react';
import styles from './AnalyzeContainer.module.css';
import Analyze from './Analyze';

const AnalyzeContainer = () => {
    return (
        <div className={styles.content}>
            <div className={styles.heroTitle}>
                <h3>Your Brand, According to AI</h3>
            </div>
            <p className={styles.subtitle}>Paste your website URL to uncover how AI sees you and learn how to shape the story.</p>
            <div className={styles.analyzeContainer}>
                <Analyze/>
            </div>
        </div>
    );
};

export default AnalyzeContainer;