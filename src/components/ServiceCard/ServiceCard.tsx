import React from 'react';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  name: string;
  device: string;
  date: string;
  id: string;
  status: string;
  color: "yellow" | "red" | "blue" | "green";
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, device, date, id, status, color, onClick }) => {
  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    cancelled: 'Cancelado',
    completed: 'Completa',
  };

  const translatedStatus = statusLabels[status] || status;

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
        style={{
          backgroundColor: color,
          color: color === 'yellow' ? '#000' : '#fff'
        }}
      >
        {translatedStatus}
      </button>
    </div>
  );
};

export default ServiceCard;
