import React from 'react';
import PropTypes from 'prop-types';
import styles from './Score.module.css';

const Score = ({ score }) => {
    return (
        <div className={styles.scoreCircle} style={{"--score": score}}>
            <div className={styles.scoreCircleInner}>
                <span className={styles.centered}>{score}</span>
            </div>
        </div>
    );
};

Score.propTypes = {
  score: PropTypes.number.isRequired,
};

export default Score;
