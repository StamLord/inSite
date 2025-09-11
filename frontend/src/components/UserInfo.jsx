import styles from "./UserInfo.module.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function UserInfo() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className={styles.loginContainer}>
            {user? 
                <div className={styles.welcomeWrapper}>
                    <span className={styles.welcomeMessage}>Logged in as {user.split("@")[0]}</span>
                    <button className={styles.loginButton}>Logout</button>
                </div>
            :
                <>
                    <button className={styles.loginButton} onClick={() => {navigate('/account')}}>Login</button>
                    <button className={styles.demoButton}>Get a Demo</button>
                </>
             }
        </div>
    );
}
