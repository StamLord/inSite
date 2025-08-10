import React from "react";
import styles from "./Bar.module.css";

function Bar({score}) {
    const clamped = Math.max(score, Math.min(0, 100));
    
    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBarMask} style={{ width: `${clamped}%` }}>
                <div className={styles.progressBarIndicator} style={{ backgroundSize: `${(100 / clamped) * 100}%` }}></div>
            </div>
        </div>
    );
};

export default Bar;