import styles from "./UserInfo.module.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function UserInfo() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const disableUser = true;

    return (
        <div className={styles.loginContainer}>
            {disableUser? 
                    <a 
                        className={styles.loginButton}
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfxWxiMF8ZM_Ymg0jF2H-HsMwJk525zDgf2v2t6ght80asBog/viewform">
                        💡 Leave a suggestion
                    </a>
                :
                user? 
                    <div className={styles.welcomeWrapper}>
                        <span className={styles.welcomeMessage}>Logged in as {user.email.split("@")[0]}</span>
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
