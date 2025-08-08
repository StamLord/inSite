import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import styles from './HomePage.module.css'
import DeepDive from './DeepDive';

const HomePage = () => {
    return (
        <div className={styles.mainPage}>
            <Navbar/>
            <Hero/>
            <DeepDive/>
            <Footer/>
        </div>
    );
};

export default HomePage;
