import { useEffect, useState } from "react";
import Section from "../../components/Section/Section";
import Modal from "../../components/OrderModal/OrderModal";
import styles from "./HomePage.module.css";

type Service = {
  id: string;
  name: string;
  device: string;
  date: string;
  status: string;
  color: "yellow" | "blue" | "green" | "red";
};

type ServiceOrder = {
  id: number;
  created_at: string;
  status: string;
  userDevice?: {
    user?: {
      name: string;
    };
    device?: {
      model: string;
    };
  };
  completed_at?: string | null;
  feedback?: number | null;
  warranty?: string | null;
  cost?: number | null;
  work?: number | null;
  deadline?: string | null;
  problem?: string | null;
};

export default function HomePage() {
  const [pendingServices, setPendingServices] = useState<Service[]>([]);
  const [recentServices, setRecentServices] = useState<Service[]>([]);

  const [pendingServicesFull, setPendingServicesFull] = useState<
    ServiceOrder[]
  >([]);
  const [recentServicesFull, setRecentServicesFull] = useState<ServiceOrder[]>(
    []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const mapOrdersToServices = (orders: ServiceOrder[]): Service[] => {
    return orders.map((order) => {
      const dateObj = new Date(order.created_at);
      const dateFormatted = dateObj.toLocaleDateString("pt-BR");

      let color: Service["color"];
      switch (order.status) {
        case "andamento":
          color = "yellow";
          break;
        case "aguardando":
          color = "blue";
          break;
        case "concluido":
          color = "green";
          break;
        case "cancelado":
          color = "red";
          break;
        default:
          color = "blue";
      }

      return {
        id: order.id.toString(),
        name: order.userDevice?.user?.name ?? "Usuário desconhecido",
        device: order.userDevice?.device?.model ?? "Dispositivo desconhecido",
        date: dateFormatted,
        status: order.status,
        color,
      };
    });
  };

  function handleCardClick(service: Service) {
    const idNum = Number(service.id);
    const fullOrder =
      pendingServicesFull.find((o) => o.id === idNum) ||
      recentServicesFull.find((o) => o.id === idNum);

    if (fullOrder) {
      setSelectedOrder(fullOrder);
      setModalOpen(true);
    } else {
      alert("Detalhes da ordem não encontrados.");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("Token não encontrado no localStorage.");
      return;
    }

    const fetchRecentOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/eniwhere/order/store",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          console.error(
            "Erro na resposta da API (recentes):",
            response.statusText
          );
          return;
        }

        const data: ServiceOrder[] = await response.json();
        setRecentServicesFull(data);
        setRecentServices(mapOrdersToServices(data));
      } catch (error) {
        console.error("Erro ao buscar ordens recentes:", error);
      }
    };

    const fetchPendingOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/eniwhere/order/storeNstatus",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ status: "pending" }),
          }
        );

        if (!response.ok) {
          console.error(
            "Erro na resposta da API (pendentes):",
            response.statusText
          );
          return;
        }

        const data: ServiceOrder[] = await response.json();
        setPendingServicesFull(data);
        setPendingServices(mapOrdersToServices(data));
      } catch (error) {
        console.error("Erro ao buscar ordens pendentes:", error);
      }
    };

    fetchRecentOrders();
    fetchPendingOrders();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Section
          title="Serviços pendentes"
          link="Ver mais"
          data={pendingServices}
          pageSize={10}
          onCardClick={handleCardClick}
        />
        <Section
          title="Criadas recentemente"
          link="Ver todos"
          data={recentServices}
          pageSize={10}
          onCardClick={handleCardClick}
        />
      </main>

      {modalOpen && selectedOrder && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h2>Ordem #{selectedOrder.id}</h2>
          <p>
            <strong>Status:</strong> {selectedOrder.status}
          </p>
          <p>
            <strong>Cliente:</strong>{" "}
            {selectedOrder.userDevice?.user?.name ?? "Usuário desconhecido"}
          </p>
          <p>
            <strong>Dispositivo:</strong>{" "}
            {selectedOrder.userDevice?.device?.model ?? "Desconhecido"}
          </p>
          <p>
            <strong>Data criação:</strong>{" "}
            {new Date(selectedOrder.created_at).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <strong>Data conclusão:</strong>{" "}
            {selectedOrder.completed_at
              ? new Date(selectedOrder.completed_at).toLocaleDateString("pt-BR")
              : "—"}
          </p>
          <p>
            <strong>Custo:</strong> {selectedOrder.cost ?? "—"}
          </p>
          <p>
            <strong>Trabalho:</strong> {selectedOrder.work ?? "—"}
          </p>
          <p>
            <strong>Garantia:</strong> {selectedOrder.warranty ?? "—"}
          </p>
          <p>
            <strong>Feedback:</strong> {selectedOrder.feedback ?? "—"}
          </p>
          <p>
            <strong>Prazo:</strong> {selectedOrder.deadline ?? "—"}
          </p>
          <p>
            <strong>Problema:</strong> {selectedOrder.problem ?? "—"}
          </p>
        </Modal>
      )}
    </div>
  );
}
