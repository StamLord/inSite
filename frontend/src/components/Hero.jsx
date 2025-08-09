import React from 'react';
import styles from './Hero.module.css';
import AnalyzeContainer from './AnalyzeContainer';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
        <div className={styles.content}>
          <div className={styles.headline}>
            <div className={styles.headlineContainer}>
              <h1>AI Talks.</h1>
              <h1>Make Sure It Names Your Brand.</h1>
              <p className={styles.description}>Track, optimize and dominate your presence across ChatGPT, Gemini, Claude and Preplexity shaping the next era.</p>
              <div className={styles.customersContainer}>
                <div>
                  <h2>Our Customers</h2>
                </div>
                <div className={styles.customerList}>
                  <div className={styles.customerBubble}></div>
                  <div className={styles.customerBubble}></div>
                  <div className={styles.customerBubble}></div>
                </div>
                <div className={styles.customerQuotes}>
                  <div className={styles.quote}>"We discovered blind spots we didn’t even know we had."</div>
                  <div className={styles.quote}>"Finally, a clear way to see how our site performs in AI-powered search. The recommendations were spot on and helped us fix issues that were hurting our visibility.”</div>
                  <div className={styles.quote}>"It’s like SEO for the future. We optimized for Google for years — now we’re optimizing for ChatGPT and beyond, thanks to this tool.”</div>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.optimizeBtn} onClick={() => navigate("/analyze")}>Optimize Now ➜</button>
                <button className={styles.demoBtn} onClick={() => navigate("/analyze")}>Request a Demo ➜</button>
              </div>
            </div>
          </div>
          <div className={styles.video}>
            Video showcasing a user asking AI for Recommendation.
          </div>
        </div>
    </section>
  );
};

export default Hero;