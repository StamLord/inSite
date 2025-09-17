import styles from './KeyAction.module.css';

export default function KeyAction({tag, title, description}) {
    const colorKey = {
        "High Impact" : styles.orange,
        "Easy Win" : styles.green,
        "Medium Impact" : styles.purple,
    }

    return <div className={styles.container}>
        <div className={styles.header}>
            <span className={`${styles.tag} ${colorKey[tag]}`}>
                {tag}
            </span>
            <h3 className={styles.title}>{title}</h3>
        </div>
        <p>{description}</p>
    </div>
};