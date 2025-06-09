import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Home.module.css';
import Loader from '../components/Loader';

const API_URL = process.env.REACT_APP_QUERY_SVC_URL;

function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL + '/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"url": url}),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Unknown error');
      
      navigate(`/query/${data.id}`)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
        <div className={styles.card}>
        <h1 className={styles.title}>🔍 inSite Analyzer</h1>
        <p className={styles.subtitle}>Enter a website URL to analyze its SEO and Answer Engine Optimization (AEO).</p>
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
            className={styles.input}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a website URL"
            style={{ width: '300px', marginRight: '10px' }}
            />
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>
        </form>

        {loading && <Loader />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    </div>
  );
}

export default Home;
