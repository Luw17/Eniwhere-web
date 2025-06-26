// src/components/KpiCard/KpiCard.tsx
import styles from './KpiCard.module.css';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface KpiCardProps {
  title: string;
  value: string;
type: "line" | "bar" | "pie" | "gauge";
  data: DataPoint[];
  color?: string;
}

export default function KpiCard({ title, value, type, data, color = "#8884d8" }: KpiCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <h2 className={styles.value}>{value}</h2>
        <div className={styles.chart}>
          {type === "line" && (
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={data}>
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          )}

          {type === "bar" && (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={data}>
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          )}

{type === "pie" && (
  <div className={styles.pieWrapper}>
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={75}
          fill={color}
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? color : "#eee"} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className={styles.centerOverlay}>
      <h2 className={styles.value}>{value}</h2>
      <span className={styles.subLabel}>{total} ordens</span>
    </div>
  </div>
)}

{type === "gauge" && (
  <div className={styles.pieWrapper}>
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={[
            { name: "Taxa", value: parseFloat(value) },
            { name: "Restante", value: 100 - parseFloat(value) }
          ]}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          <Cell fill={color} />
          <Cell fill="#f0f0f0" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className={styles.centerOverlay}>
      <h2 className={styles.value}>{value}%</h2>
    </div>
  </div>
)}




        </div>
      </div>
    </div>
  );
}
