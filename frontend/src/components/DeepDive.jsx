import React from "react";
import styles from "./DeepDive.module.css"

const DeepDive = () => {
    return (
        <div className={styles.container}>
            <h1> Pioneering AI Brand Optimization</h1>
            <div className={styles.mainBody}>
                <div className={styles.pointsContainer}>
                    <div className={styles.point}>
                        <div className={styles.pointIcon}/>
                        <h3>AI Visibility Score</h3>
                        <p>See how AI search engines interpret your site — based on relevance, accuracy, and structure.</p>
                    </div>
                    <div className={styles.point}>
                        <div className={styles.pointIcon}/>
                        <h3>What People Ask About You</h3>
                        <p>See what people ask AI about your brand — and where you're showing up.</p>
                    </div>
                    <div className={styles.point}>
                        <div className={styles.pointIcon}/>
                        <h3>Benchmark</h3>
                        <p>See how your brand shows up in AI answers — compared to your competitors. Spot gaps, close them. and stay ahead.</p>
                    </div>
                    <div className={styles.point}>
                        <div className={styles.pointIcon}/>
                        <h3>Content Optimization</h3>
                        <p>Get tailored tips to improve your content for AI search — based on how AI ranks and responds to real user queries.</p>
                    </div>
                </div>
                <div className={styles.panel} />
            </div>
            <div className={styles.actionContainer}>
                <button className={styles.readButton}>Read More</button>
                <button className={styles.learnButton} >Learn More</button>
            </div>
        </div>
    );
};

export default DeepDive;
