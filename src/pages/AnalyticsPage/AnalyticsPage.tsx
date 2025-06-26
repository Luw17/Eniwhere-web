import KpiCard from "../../components/KpiCard/KpiCard";
import styles from "./AnalyticsPage.module.css";

type KpiType = "line" | "bar" | "pie" | "gauge";

interface DataPoint {
  name: string;
  value: number;
}

interface Kpi {
  title: string;
  value: string;
  type: KpiType;
  color?: string;
  data: DataPoint[];
}

const kpis: Kpi[] = [
  {
    title: "Lead Time de Serviço",
    value: "2.4 dias",
    type: "line",
    color: "#4E79A7",
    data: [
      { name: "Jan", value: 3 },
      { name: "Fev", value: 2.6 },
      { name: "Mar", value: 2.4 },
      { name: "Abr", value: 2.2 },
    ],
  },
  {
    title: "Retrabalho",
    value: "5%",
    type: "bar",
    color: "#F28E2B",
    data: [
      { name: "Jan", value: 6 },
      { name: "Fev", value: 5 },
      { name: "Mar", value: 4 },
      { name: "Abr", value: 5 },
    ],
  },
  {
    title: "Faturamento Médio",
    value: "R$ 620,00",
    type: "line",
    color: "#59A14F",
    data: [
      { name: "Jan", value: 500 },
      { name: "Fev", value: 600 },
      { name: "Mar", value: 650 },
      { name: "Abr", value: 720 },
    ],
  },
  {
    title: "Taxa de Fidelização",
    value: "88%",
    type: "pie",
    color: "#EDC948",
    data: [
      { name: "Fidelizados", value: 88 },
      { name: "Não fidelizados", value: 12 },
    ],
  },
  {
    title: "Taxa de Conversão",
    value: "35%",
    type: "bar",
    color: "#B07AA1",
    data: [
      { name: "Jan", value: 30 },
      { name: "Fev", value: 34 },
      { name: "Mar", value: 35 },
      { name: "Abr", value: 36 },
    ],
  },
  {
    title: "Pesquisa de Satisfação",
    value: "93%",
    type: "pie",
    color: "#FF9DA7",
    data: [
      { name: "Satisfeitos", value: 93 },
      { name: "Insatisfeitos", value: 7 },
    ],
  },
  {
  title: "Taxa de Conversão",
  value: "47",
  type: "gauge",
  color: "#7C83FD",
  data: [], // não será usado, mas pode deixar vazio
},
];

export default function AnalyticsPage() {
  return (
    <div className={styles.container}>
      {kpis.map((kpi, index) => (
        <KpiCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          type={kpi.type}
          data={kpi.data}
          color={kpi.color}
        />
      ))}
    </div>
  );
}
