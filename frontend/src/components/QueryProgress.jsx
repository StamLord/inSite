import styles from './QueryProgress.module.css';
import Loader from './Loader';
import React, { useState, useEffect } from 'react';

const messages = [
    "We’re asking AI what it really thinks about you...",
    "Pulling results from top AI search engines...",
    "Spotting strengths...",
    "And blind spots in your visibility...",
    "Crafting recommendations to improve your ranking...",
    "Final touches — your insights are almost here."
];

const messageInterval = 3000;

export default function QueryProgress() {
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [entering, setEntering] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrevIndex(index);              // trigger exit
            setIndex((prev) => (prev + 1) % messages.length);
            setEntering(false);               // reset
            setTimeout(() => setEntering(true), 20); // allow browser to paint before adding "enter"
            }, messageInterval);

        return () => clearInterval(interval);
    }, [index]);

    return  <div className={styles.container}>
                <h2 className={styles.analyzeTitle}>Compiling Your AI Visibility Report...</h2>
                <h3>We are checking how AI search engines rank, describe, and talk about you.</h3>
                <div className={styles.image}>
                    <Loader/>
                </div>
                <div className={styles.messagesContainer}>
                    {prevIndex !== null && (
                        <h2 key={prevIndex} className={`${styles.message} ${styles.exit}`}>
                            {messages[prevIndex]}
                        </h2>
                    )}
                    <h2 key={index} className={`${styles.message} ${entering ? styles.enter : ""}`}>
                        {messages[index]}
                    </h2>
                </div>
                <div className={styles.dotsContainer}>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                </div>
                <p className={styles.analyzeText}>This deep analysis might take between 2-5 minutes.</p>
            </div>;
};