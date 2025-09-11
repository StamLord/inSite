import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import styles from './QueryResult.module.css';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Score from '../components/Score';
import { getRecommendations } from '../utils/recommendations';
import Footer from '../components/Footer';
import Bar from '../components/Bar';
import QueryProgress from '../components/QueryProgress';
import KeyAction from '../components/KeyAction';

const API_URL = process.env.REACT_APP_QUERY_SVC_URL;

function CapitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function QueryResult() {
    const { id } = useParams();
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [visibleAnswers, setVisibleAnswers] = React.useState([]);
    const [recommendations, setRecommendations] = React.useState([]);

    let intervalId;

    function ToggleAnswer(index) {
        if (index < 0 || index >= visibleAnswers.length)
            return;

        setVisibleAnswers((prev) => {
            const updated = [...prev];        // 1. make a shallow copy
            updated[index] = !updated[index]; // 2. update the specific item
            return updated;                   // 3. React will re-render
        });
    }

    function getPromptsScore() {
        if (!result?.scores)
            return 0;

        let score = 0;

        for (let s in result.scores)
            score += result.scores[s];
        
        score = score / result.scores.length;

        if (result.scrape)
            score = Math.floor(score * .9 + result.scrape.overall_score * .1);

        return score;
    }

    function getStructureScore() {
        if (!result?.scrape)
            return 0;

        return result.scrape.overall_score;
    }

    function getTotalScore() {
        return Math.round((getPromptsScore() + getConfidenceScore() + getStructureScore()) / 3);
    }

    React.useEffect(() => {
        console.log("visibleAnswers updated:", visibleAnswers);
        }, [visibleAnswers]);
    
    React.useEffect(() => {
        if (result) {
            setRecommendations(getRecommendations(result, 3));
            console.log(recommendations);
        }
    }, [result])

    React.useEffect(() => {
        async function fetchResult() {
            try {
                const res = await fetch(API_URL + `/query/${id}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.detail || "Unknown error");
                
                setResult(data);
                if (data?.answers) {
                    setVisibleAnswers(new Array(data.answers.length).fill(false));
                }
                
                if (data.status === "complete" || data.status === "error")
                    clearInterval(intervalId);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        // set up polling every 5 seconds
        intervalId = setInterval(fetchResult, 5000);
        fetchResult();

        // cleanup when component unmounts
        return () => clearInterval(intervalId);
    }, [id]);

    const tabs = [
        { id: "summary", label: "Summary"},
        { id: "brand", label: "Brand"},
        { id: "prompts", label: "Prompts"},
        { id: "structure", label: "Structure"},
    ];

    const [activeTab, setActiveTab] = useState("summary");
    
    function getConfidenceScore() {
        if (result == null)
            return 0;
        
        if (result.confidence === "high")
            return 100;
        
        if (result.confidence === "medium")
            return 50;
        
        if (result.confidence === "low")
            return 25;
    }

    return (
        <div className={styles.container}>
            <Navbar/>

            {loading && <Loader/>}
            {error && <p className={styles.error}>Error: {error}</p>}
            
            {result && result.status === "pending" && <QueryProgress/>}

            {result && result.status === "complete" &&
            <>
            <h2 className={styles.title}>Your AI Search Visibility Report for {result.site_url}</h2>
            <div className={styles.card}>
                <div className={styles.tabs}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ""}`}
                            onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                {activeTab === "summary" &&
                    <div className={styles.cardContent}>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <h2>Summary</h2>
                                <div className={styles.summaryLine}>
                                    <p>Brand</p>
                                    <div className={styles.summaryPartScore}>
                                        <Score score={getConfidenceScore()}/>
                                    </div>
                                 </div>
                                <div className={styles.summaryLine}>
                                    <p>Prompts</p>
                                    <div className={styles.summaryPartScore}>
                                        <Score score={getPromptsScore()}/>
                                    </div>
                                </div>
                                <div className={styles.summaryLine}>
                                    <p>Structure</p>
                                    <div className={styles.summaryPartScore}>
                                        <Score score={getStructureScore()}/>
                                    </div>
                                </div>
                            </div>
                            <div className={`${styles.resultItem} ${styles.suggestionCard}`}>
                                <h2>Total Score</h2>
                                <div class={styles.summaryScore}>
                                    <Score score={getTotalScore()}/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <h2 className={styles.subTitle}>Suggestions</h2>
                                {recommendations.map((rec, index) => {
                                    const tags = ["HIGH IMPACT", "QUICK WIN", "LOW IMPACT"];
                                    const rand = tags[Math.floor(Math.random() * tags.length)]
                                    return (
                                        <KeyAction tag={rand} title="Title" description={rec.text}/>
                                        // <p key={index}>{index + 1}. {rec.text}</p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                }
                
                {activeTab === "brand" &&
                    <div className={styles.cardContent}>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <h2>Brand Recognition</h2>
                                <div>
                                    <p>Recognized: {CapitalizeFirstLetter("" + result.known)}</p>
                                    <p>Summary: {result.summary}</p>
                                </div>
                            </div>
                            <div className={styles.resultCol}>
                                <div className={styles.resultItem}>
                                    <p>Confidence: {CapitalizeFirstLetter("" + result.confidence)}</p>
                                    <Bar score={getConfidenceScore()}/>
                                </div>
                                <div className={styles.resultItem}>
                                    <p>Reasoning: {result.reasoning}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {activeTab === "prompts" &&
                    <div className={styles.cardContent}>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <h2 className={styles.subTitle}>Popular Prompts</h2>
                                {result.prompts && result.prompts.map((prompt, index) => (
                                <div key={index} className={styles.promptItem}>
                                    <div>
                                        <h4>💬 {prompt}</h4>
                                        {visibleAnswers[index]
                                            ?   <div>
                                                    <ul className={styles.promptAnswers}>
                                                        {result.answers[index].map((ans, i) => {
                                                            const min_url = result.site_url.split(".")[0]
                                                            const regex = new RegExp(min_url, "i");
                                                            const isMatch = regex.test(ans);

                                                            return (
                                                               <li key={i} className={`${isMatch ? styles.highlightAnswer : ""}`}>
                                                                    {isMatch? "✔️" : ""} {ans}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                    <p className={styles.promptTip} onClick={() => {ToggleAnswer(index)}}>˄ Hide Answer ˄</p>
                                                </div>
                                            :   <p className={styles.promptTip} onClick={() => {ToggleAnswer(index)}}>˅ Show Answer ˅</p>
                                        }
                                    </div>
                                    <div className={styles.promptScore}>
                                        <Score score={result.scores[index]}/>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                }

                {activeTab === "structure" &&
                    <div className={styles.cardContent}>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <div className={styles.resultRow}>
                                    <h2 className={styles.subTitle}>Structure Analysis</h2>
                                    <div className={styles.structureScore}>
                                        <Score score={result.scrape? result.scrape.overall_score : 0}/>
                                    </div>
                                </div>
                                <div>
                                    <h3 className={styles.structureTitle}>Summary</h3>
                                    {result.scrape.summary}
                                </div>
                            </div>
                        </div>
                        <div className={styles.resultRow}>
                            <div className={`${styles.resultItem} ${styles.flexOne}`}>
                                <table className={styles.styledTable}>
                                    <thead>
                                        <tr>
                                            <th>Weaknesses</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.scrape.weaknesses.map(text => {
                                            return (
                                                <tr>
                                                    <td>{text}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className={`${styles.resultItem} ${styles.flexOne}`}>
                                <table className={styles.styledTable}>
                                    <thead>
                                        <tr>
                                            <th>Strengths</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.scrape.strengths.map(text => {
                                            return (
                                                <tr>
                                                    <td>{text}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <h3 className={styles.structureTitle}>Overview</h3>
                                <table className={`${styles.styledTable} ${styles.fullTable}`}>
                                    <thead>
                                        <tr>
                                            <th>Factor</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.scrape && Object.entries(result.scrape.key_factors).map(([key, value]) => {
                                            const lower = value.toLowerCase();
                                            const score = lower === "missing" || lower === "weak" ? "bad" : lower === "not enough info"? "mid" : "good";
                                            return (
                                                <tr>
                                                    <td>{key}</td>
                                                    <td>
                                                        <span className={score === "bad"? styles.overviewBad : score === "mid" ? styles.overviewMid : ""}>
                                                            {value}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.resultItem}>
                                <h3 className={styles.structureTitle}>Technical Scan</h3>
                                <table className={`${styles.styledTable} ${styles.fullTable}`}>
                                    <thead>
                                        <tr>
                                            <th>Factor</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.technical_scan && Object.entries(result.technical_scan).map(([key, value]) => {
                                            const lower = value.toLowerCase();
                                            const score = lower === "missing" || lower === "weak" ? "bad" : lower === "not enough info"? "mid" : "good";
                                            return (
                                                <tr>
                                                    <td>{key}</td>
                                                    <td>
                                                        <span className={score === "bad"? styles.overviewBad : score === "mid" ? styles.overviewMid : styles.overviewGood}>
                                                            {value}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={styles.resultItem}>
                            <h3 className={styles.structureTitle}>Recommendations</h3>
                            {result.scrape && result.scrape.recommendations}
                        </div>
                    </div>
                }

            </div>
            </>
            }

            <Footer/>
        </div>
  );
}

export default QueryResult
