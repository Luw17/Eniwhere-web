// src/components/Card/Card.tsx
import styles from "./Card.module.css";

type CardProps = {
  name: string;
  device: string;
  date: string;
  id: string;
  status: string;
  color: "yellow" | "red" | "blue";
};

export default function Card({ name, device, date, id, status, color }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.header}>{name}</div>
      <div className={styles.imagePlaceholder} />
      <div className={styles.details}>
        <p>{device}</p>
        <span>ID: {id}</span>
        <p>{date}</p>
      </div>
      <div className={styles.status}>{status}</div>
    </div>
  );
}
