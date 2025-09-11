import { useState } from "react";
import styles from "./Account.module.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const API_URL = process.env.REACT_APP_QUERY_SVC_URL;
    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSignup && password !== confirmPassword) {
            setFormError("Passwords do not match");
            return;
        }

        const endpoint = isSignup? "/register" : "/login";
        const res = await fetch(API_URL + endpoint, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            mode: "cors",
            credentials: "include",
            body: JSON.stringify({ 
                "email" : email, 
                "password" : password 
            })
        })

        if (res.ok)
            navigate("/");
        else {
            const data = await res.json()
            setFormError(data.detail);
        }
    };

    return (
        <div className={styles.accountContainer}>
            <Navbar />
            <div className={styles.authFormWrapper}>
                {formError !== "" && <span className={styles.formError}>{formError}</span>}
                <form className={styles.authForm} onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </label>

                    <label>
                        Password
                        <input 
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {!isSignup && (
                        <a className={styles.forgotPassword}>Forgot your password?</a>
                    )}

                    {isSignup && (
                        <label>
                            Confirm Password
                            <input 
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                    )}

                    <button type="submit" className={styles.submitButton}>
                        {isSignup ? "Sign Up" : "Login"}
                    </button>
                    
                    {isSignup?
                        <p>Already have an account? <a onClick={() => setIsSignup(false)}>Login</a></p>
                        :
                        <p>Don't have an account? <a onClick={() => setIsSignup(true)}>Sign Up</a></p>
                    }
                    
                </form>
            </div>
        </div>
    );
}