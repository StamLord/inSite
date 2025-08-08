import React from "react";
import Navbar from "../components/Navbar";
import AnalyzeContainer from "../components/AnalyzeContainer";
import styles from "./Analyze.module.css";
import Footer from "../components/Footer";

const AnalyzePage = () => {
    return (
        <div className={styles.container}>
            <Navbar/>
            <div className={styles.analyzeContainer}>
                <AnalyzeContainer/>
            </div>
            <Footer/>
        </div>
    );
}

export default AnalyzePage;
