import React from 'react';
import styles from './Hero.module.css';
import AnalyzeContainer from './AnalyzeContainer';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import heroVideo from "../assets/videos/hero_vid.mp4";

import logo_1 from "../assets/customers/db_logo.png";
import logo_2 from "../assets/customers/lenderpanel_logo.png";
import logo_3 from "../assets/customers/lex_logo.jpg";

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
                  <div className={styles.customerBubble}><img src={logo_1} alt="Customer" /></div>
                  <div className={styles.customerBubble}><img src={logo_2} alt="Customer" /></div>
                  <div className={styles.customerBubble}><img src={logo_3} alt="Customer" /></div>
                </div>
                <div className={styles.customerQuotes}>
                  <div className={styles.quote}>"We discovered blind spots we didn’t even know we had."</div>
                  <div className={styles.quote}>"Finally, a clear way to see how our site performs in AI-powered search. The recommendations were spot on and helped us fix issues that were hurting our visibility.”</div>
                  <div className={styles.quote}>"It’s like SEO for the future. We optimized for Google for years but now we’re optimizing for ChatGPT and beyond.”</div>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.optimizeBtn} onClick={() => navigate("/analyze")}>Optimize Now ➜</button>
                <button className={styles.demoBtn} onClick={() => navigate("/analyze")}>Request a Demo ➜</button>
              </div>
            </div>
          </div>
          <div className={styles.video}>
            <video 
              autoPlay 
              loop 
              muted
            >
              <source src={heroVideo} type="video/mp4"/>
              Video showcasing a user asking AI for Recommendation.
            </video>
          </div>
        </div>
    </section>
  );
};

export default Hero;