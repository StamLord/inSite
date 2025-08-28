import styles from './KeyAction.module.css';

export default function KeyAction({tag, title, description}) {
    const colorKey = {
        "HIGH IMPACT" : styles.orange,
        "QUICK WIN" : styles.green,
        "LOW IMPACT" : styles.purple,
    }

    return <div className={styles.container}>
        <div className={styles.header}>
            <span className={`${styles.tag} ${colorKey[tag]}`}>
                {tag.toUpperCase()}
            </span>
            <h3 className={styles.title}>{title}</h3>
        </div>
        <p>{description}</p>
    </div>
};