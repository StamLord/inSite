import { useEffect, useState } from 'react';
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
import ReportFeedback from '../components/ReportFeedback';
import ActionButton from '../components/ActionButton';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_QUERY_SVC_URL;

function CapitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function QueryResult() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleAnswers, setVisibleAnswers] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();

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
        const base = 25;
        const total = Math.round((getPromptsScore() + getConfidenceScore() + getStructureScore()) / 4);
        return base + total;
    }

    function getTotalScoreMessage() {
        const score = getTotalScore();
        if (score <= 50)
            return "Don’t worry, this isn’t a reflection of your brand’s quality, just how it’s currently represented in AI models."
        else if (score <= 75)
            return "You’re on the right track! This score reflects how AI models currently understand your brand — not its real-world strength."
        else
            return "Great job! Your brand is already making its mark in AI models!"
    }
    useEffect(() => {
        if (result) {
            setRecommendations(getRecommendations(result, 5));
        }
    }, [result])

    useEffect(() => {
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
        { id: "structure", label: "AI Readability"},
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
                <ActionButton 
                    text="← Back to Analyze" 
                    type={0} 
                    onClick={() => {navigate("/analyze")}}
                />
                <ReportFeedback report_id={result.id}/>
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
                            <div className={`${styles.resultItem} ${styles.suggestionCard}`} style={{flex: "2"}}>
                                <h2>Total Score</h2>
                                <div class={styles.summaryScore}>
                                    <Score score={getTotalScore()}/>
                                </div>
                                <span>{getTotalScoreMessage()}</span>
                            </div>
                        </div>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <h2 className={styles.subTitle}>Suggestions</h2>
                                {recommendations.map((rec, index) => {
                                    return (
                                        <KeyAction tag={rec.tag} title={rec.title} description={rec.content}/>
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
                                    <p>Recognized: {result.known? "✔️" : "❌"}</p>
                                    <p>Summary: {result.known? result.summary : "N/A"}</p>
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
                                {!result.prompts && 
                                    <div>
                                        <p style={{margin: 0}}>We couldn’t find any popular prompts for this brand yet. Looks like you’re ahead of the curve!</p>
                                        <p style={{margin: 0}}>Try adding your brand to a few conversations or check back soon once it starts gaining traction.</p>
                                    </div>
                                }
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
                                                    <p className={styles.showAnswer} onClick={() => {ToggleAnswer(index)}}>Hide Answer</p>
                                                </div>
                                            :   <p className={styles.showAnswer} onClick={() => {ToggleAnswer(index)}}>Show Answer</p>
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

                {activeTab === "structure" && !result.scrape && 
                    <div className={styles.cardContent}>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <p>An error occurred while scraping the site.</p>
                            </div>
                        </div>
                    </div>
                }

                {activeTab === "structure" && result.scrape &&
                    <div className={styles.cardContent}>
                        <div className={styles.resultRow}>
                            <div className={styles.resultItem}>
                                <div className={styles.resultRow}>
                                    <h2 className={styles.subTitle}>AI Readability Analysis</h2>
                                    <div className={styles.structureScore}>
                                        <Score score={result.scrape.overall_score}/>
                                    </div>
                                </div>
                                <div>
                                    <h3 className={styles.structureTitle}></h3>
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
                                <h2 className={styles.subTitle}>Important</h2>
                                <p>
                                    LLMs primarily read RAW HTML. JavaScript-injected tags may not be visible in AI answers or this scan. If something you expected appears as missing, it’s likely not part of the page’s original HTML.
                                </p>
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
                                            const score = lower === "missing" || lower === "weak" || lower === "shallow"? "bad" : lower === "not enough info"? "mid" : "good";
                                            return (
                                                <tr>
                                                    <td>{key}</td>
                                                    <td>
                                                        <span className={`${styles.overviewResult} ${
                                                            score === "bad"? styles.bad : 
                                                            score === "mid" ? styles.mid : 
                                                            styles.good
                                                        }`}>
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
                                            const score = lower === "missing" || lower === "weak" || lower.includes("unreachable") || lower.includes("disallows")? "bad" : lower === "not enough info"? "mid" : "good";
                                            return (
                                                <tr>
                                                    <td>{key}</td>
                                                    <td>
                                                        <span className={`${styles.overviewResult} ${
                                                            score === "bad"? styles.bad : 
                                                            score === "mid" ? styles.mid : 
                                                            styles.good
                                                        }`}>
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
                    </div>
                }

                <div style={{display: "flex", justifyContent: "center"}}>
                    <ActionButton 
                        text="← Back to Analyze" 
                        type={0} 
                        onClick={() => {navigate("/analyze")}}
                    />
                </div>
            </div>
            </>
            }
            <Footer/>
        </div>
  );
}

export default QueryResult
