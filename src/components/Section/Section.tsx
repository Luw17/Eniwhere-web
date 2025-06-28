import { useState } from "react";
import ServiceCard from "../ServiceCard/ServiceCard";
import styles from "./Section.module.css";

interface Service {
  id: string;
  name: string;
  device: string;
  date: string;
  status: string;
  color: "yellow" | "red" | "blue" | "green";
  imageUrl?: string;  // adicionado para imagem opcional
}

interface SectionProps {
  title: string;
  link: string;
  data: Service[];
  pageSize?: number;
  onCardClick?: (service: Service) => void;
}

export default function Section({ title, link, data, pageSize = 10, onCardClick }: SectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [fade, setFade] = useState(true);

  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = data.slice(startIndex, startIndex + pageSize);

  const changePage = (newPage: number) => {
    setFade(false);

    setTimeout(() => {
      setCurrentPage(newPage);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <button className={styles.sectionLinkBtn}>{link}</button>
      </div>

      <div className={`${styles.cardList} ${fade ? styles.fadeIn : styles.fadeOut}`}>
        {currentItems.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            onClick={() => onCardClick && onCardClick(service)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            &lt; Anterior
          </button>
          <span className={styles.pageIndicator}>
            {currentPage} / {totalPages}
          </span>
          <button
            className={styles.paginationBtn}
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Próximo &gt;
          </button>
        </div>
      )}
    </section>
  );
}
