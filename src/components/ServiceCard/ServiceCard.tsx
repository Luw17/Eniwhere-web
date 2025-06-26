import React from 'react';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  name: string;
  device: string;
  date: string;
  id: string;
  status: string;
  color: "yellow" | "red" | "blue" | "green";
  onClick?: () => void;  // novo prop opcional
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, device, date, id, status, color, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.header}>
        <span>{name}</span>
      </div>
      <div className={styles.imagePlaceholder}></div>
      <div className={styles.id}>ID: {id}</div>
      <div className={styles.details}>
        <strong>{device}</strong>
        <p>{date}</p>
      </div>
      <button
        className={styles.status}
        style={{ backgroundColor: color || '#fff176' }}
      >
        {status}
      </button>
    </div>
  );
};

export default ServiceCard;
