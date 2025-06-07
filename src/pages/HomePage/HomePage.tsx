// src/pages/HomePage/HomePage.tsx
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Section from "../../components/Section/Section";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const pendingServices = [
    {
      name: "Constantine",
      device: "IPHONE 15",
      date: "17/05/2025",
      id: "0001",
      status: "Em andamento",
      color: "yellow" as const,
    },
    {
      name: "Ana",
      device: "IPHONE 13",
      date: "10/05/2025",
      id: "0002",
      status: "Em andamento",
      color: "yellow" as const,
    },
    {
      name: "Breno",
      device: "XIAOMI redmi note 11",
      date: "30/04/2025",
      id: "0003",
      status: "Em andamento",
      color: "yellow" as const,
    },
    {
      name: "João gestor",
      device: "SAMSUNG galaxy M31",
      date: "12/04/2025",
      id: "0004",
      status: "Em andamento",
      color: "yellow" as const,
    },
  ];

  const recentServices = [
    {
      name: "Constantine",
      device: "IPHONE 15",
      date: "17/05/2025",
      id: "0001",
      status: "Em andamento",
      color: "yellow" as const,
    },
    {
      name: "Raissa",
      device: "MOTOROLA Moto E 30",
      date: "17/05/2025",
      id: "0005",
      status: "Cancelado",
      color: "red" as const,
    },
    {
      name: "Marta",
      device: "MOTOROLA moto E 20",
      date: "16/04/2025",
      id: "0004",
      status: "Concluído",
      color: "blue" as const,
    },
    {
      name: "Karina",
      device: "SAMSUNG galaxy A31",
      date: "16/04/2025",
      id: "0006",
      status: "Concluído",
      color: "blue" as const,
    },
  ];

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header title="BEM VINDO(A), RENOVE!" />
        <Section title="Serviços pendentes" link="Ver mais" data={pendingServices} />
        <Section title="Criadas recentemente" link="Ver todos" data={recentServices} />
      </main>
    </div>
  );
}
