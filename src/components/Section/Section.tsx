// src/components/Section/Section.tsx
import Card from "../Card/Card";
import styles from "./Section.module.css";

type ServiceData = {
  name: string;
  device: string;
  date: string;
  id: string;
  status: string;
  color: "yellow" | "red" | "blue";
};

type SectionProps = {
  title: string;
  link: string;
  data: ServiceData[];
};

export default function Section({ title, link, data }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        <a href="#">{link}</a>
      </div>
      <div className={styles.cardContainer}>
        {data.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
