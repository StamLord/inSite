import { useState } from "react";
import styles from "./ReportFeedback.module.css";

export default function ReportFeedback ({ report_id }) {
    const API_URL = process.env.REACT_APP_QUERY_SVC_URL;

    const [feedback, setFeedback] = useState(null);

    function send_feedback(action) {
        setFeedback(action);
        
        fetch(API_URL + `/${action}/${report_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

        }).catch((err) => {
            console.error("Failed to ${action}: ", err);
        })
    }

    return (
        <div className={styles.feedbackContainer}>
            {feedback === null? 
                <p>We'd like to hear your feedback on this report</p>
                :
                <p>Thank you for your feedback!</p>
            }
            <div className={styles.feedbackButtonsContainer}>
                <button 
                    className={`${styles.thumbsDown} ${feedback === "upvote"? styles.inactive : ""}`}
                    onClick={() => {send_feedback("downvote")}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-down-icon lucide-thumbs-down"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>
                </button>
                <button 
                    className={`${styles.thumbsUp} ${feedback === "downvote"? styles.inactive : ""}`}
                    onClick={() => {send_feedback("upvote")}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up-icon lucide-thumbs-up"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                </button>
            </div>
        </div>
    );
}