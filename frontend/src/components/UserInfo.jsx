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
                        className={styles.suggestionButton}
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfxWxiMF8ZM_Ymg0jF2H-HsMwJk525zDgf2v2t6ght80asBog/viewform">
                        <svg 
                            width="20"
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke-width="1.5" 
                            stroke="currentColor" 
                            class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                        Leave a suggestion
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
