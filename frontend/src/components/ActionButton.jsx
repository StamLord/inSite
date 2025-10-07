import styles from "./ActionButton.module.css";

const style = [styles.styleA, styles.styleB]

export default function ActionButton({ type, text, onClick}) {
    return (
        <button 
            onClick={onClick}
            className={`${styles.actionButton} ${style[type % style.length]}`}>
                {text}
        </button>
    );
}
