import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import styles from './QueryResult.module.css';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Score from '../components/Score';

const API_URL = process.env.REACT_APP_QUERY_SVC_URL;

function QueryResult() {
    const { id } = useParams();
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    let intervalId;

    React.useEffect(() => {
        async function fetchResult() {
            try {
                const res = await fetch(API_URL + `/query/${id}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.detail || "Unknown error");

                setResult(data);

                if (data.status === "complete")
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

                            {result.status === 'complete' && (
                                <div className={styles.results}>
                                    <h1 className={styles.title}>AEO Report for {result.site_url}</h1>

                                    {result.prompts.map((prompt, index) => (
                                        <div key={index} className={styles.resultItem}>
                                            <h3>{prompt}</h3>
                                            <ul>
                                                {result.answers[index].map((ans, i) => (
                                                    <li key={i} className={styles.answer}>{ans}</li>
                                                ))}
                                            </ul>
                                            <Score score={Math.floor(Math.random() * 101)}/>
                                        </div>
                                    ))}
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
