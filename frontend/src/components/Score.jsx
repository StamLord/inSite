import React from 'react';
import PropTypes from 'prop-types';
import styles from './Score.module.css';

const red = "#e74c3c";
const orange = "#e67e22";
const green = "#27ae60";

function getColor(score) {
    if (score <= 50)
        return red;
    if (score <= 75)
        return orange;
    return green;

}

const Score = ({ score }) => {
    const circleColor = getColor(score);

    return (
        <div className={styles.scoreCircle} style={{"--score": score, "--circle-color": circleColor}}>
            <div className={styles.scoreCircleInner}>
                <span className={styles.centered} style={{  }}>{score}</span>
            </div>
        </div>
    );
};

Score.propTypes = {
  score: PropTypes.number.isRequired,
};

export default Score;
