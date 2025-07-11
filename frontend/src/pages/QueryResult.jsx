import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import styles from './QueryResult.module.css';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Score from '../components/Score';
import { getRecommendations } from '../utils/recommendations';

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

    function GetTotalScore(data) {
        if (!data.scores)
            return 0;

        let score = 0;

        for (let s in data.scores)
            score += data.scores[s];
        
        score = score / data.scores.length;

        if (data.scrape)
            score = Math.floor(score * .9 + data.scrape.overall_score * .1);

        return score;
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

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    {loading && <Loader/>}
                    {error && <p className={styles.error}>Error: {error}</p>}

                    {result && (
                        <>
                            {result.status === 'pending' && (
                                <p className={styles.pending}>⏳ Gathering insights... Refresh the page in a few seconds.</p>
                            )}

                            {(result.status === 'complete' || result.status === "error") && (
                                
                                <div className={styles.results}>
                                    <h1 className={styles.title}>AEO Report for {result.site_url}</h1>

                                    <div className={styles.resultRow}>
                                        <div className={`${styles.resultItem} ${styles.flexTwoParts}`}>
                                            <h2 className={styles.subTitle}>Brand Recognition</h2>
                                            <div className={styles.resultSummaryInfo}>
                                                <p>Recognized: {CapitalizeFirstLetter("" + result.known)}</p>
                                                <p>Summary: {result.summary}</p>
                                                <p>Confidence: {CapitalizeFirstLetter("" + result.confidence)}</p>
                                                <p>Reasoning: {result.reasoning}</p>
                                            </div>
                                            
                                        </div>
                                        <div className={`${styles.resultItem} ${styles.suggestionCard}`}>
                                            <h2 className={styles.subTitle}>Score</h2>
                                            <div class={styles.summaryScore}>
                                                <Score score={GetTotalScore(result)}/>
                                            </div>
                                            <div className={styles.suggestionsContainer}>
                                                <h2 className={styles.subTitle}>Suggestions</h2>
                                                {recommendations.map((rec, index) => (
                                                    <p key={index}>{index + 1}. {rec.text}</p>
                                                    // <p key={index}>{index + 1}. {rec}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className={styles.resultItem}>
                                        <h2 className={styles.subTitle}>Popular Prompts</h2>
                                        {result.prompts && result.prompts.map((prompt, index) => (
                                        <div key={index} className={styles.promptItem}>
                                            <div>
                                                <h4>{prompt}</h4>
                                                {visibleAnswers[index]
                                                    ?   <div>
                                                            <ul className={styles.promptAnswers}>
                                                                {result.answers[index].map((ans, i) => (
                                                                    <li key={i} className={styles.answer}>{ans}</li>
                                                                ))}
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

                                    <div className={styles.resultItem}>
                                        <div className={styles.resultRow}>
                                            <h2 className={styles.subTitle}>Structure Analysis</h2>
                                            <div className={styles.structureScore}>
                                                <Score score={result.scrape? result.scrape.overall_score : 0}/>
                                            </div>
                                        </div>
                                        {result.scrape && 
                                            <>
                                            <div>
                                                <div className={styles.structureSummary}>
                                                    <h3>Summary</h3>
                                                    {result.scrape.summary}
                                                </div>
                                                <div className={styles.structureStrengthsAndWeaknesses}>
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
                                                
                                                <h3>Overview</h3>
                                                <table className={`${styles.styledTable} ${styles.fullTable}`}>
                                                    <thead>
                                                        <tr>
                                                            <th>Factor</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.scrape && Object.entries(result.scrape.key_factors).map(([key, value]) => {
                                                            return (
                                                                <tr>
                                                                    <td>{key}</td>
                                                                    <td>{value}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>

                                                <h3>Technical Scan</h3>
                                                <table className={`${styles.styledTable} ${styles.fullTable}`}>
                                                    <thead>
                                                        <tr>
                                                            <th>Factor</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.technical_scan && Object.entries(result.technical_scan).map(([key, value]) => {
                                                            return (
                                                                <tr>
                                                                    <td>{key}</td>
                                                                    <td>{value}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>

                                                <h3>Recommendations</h3>
                                                {result.scrape && result.scrape.recommendations}
                                            </div>
                                        </>}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
  );
}

export default QueryResult
