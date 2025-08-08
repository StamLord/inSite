import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Home.module.css';
import HomePage from '../components/HomePage';

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
      <HomePage/>
  );
}

export default Home;
