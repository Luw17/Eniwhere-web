// src/components/Section/Section.tsx
import ServiceCard from "../ServiceCard/ServiceCard";
import styles from "./Section.module.css";

interface Service {
  name: string;
  device: string;
  date: string;
  id: string;
  status: string;
  color: "yellow" | "red" | "blue";
}

interface SectionProps {
  title: string;
  link: string;
  data: Service[];
}

export default function Section({ title, link, data }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <button className={styles.sectionLinkBtn}>{link}</button>
      </div>
      <div className={styles.cardList}>
        {data.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  );
}
