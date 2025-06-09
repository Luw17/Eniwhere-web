import React from 'react';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  name: string;
  device: string;
  date: string;
  id: string;
  status: string;
  color: "yellow" | "red" | "blue";
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, device, date, id, status, color }) => {
  return (
    <div className={styles.card}>
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
        style={{ backgroundColor: color || '#fff176' }} // amarelo padrão
      >
        {status}
      </button>
    </div>
  );
};

export default ServiceCard;
