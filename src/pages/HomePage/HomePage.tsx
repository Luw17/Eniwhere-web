import { useEffect, useState } from "react";
import Section from "../../components/Section/Section";
import Modal from "../../components/OrderModal/OrderModal";
import OrderDetailsModal from "../../components/OrderDetailsModal/OrderDetailsModal";
import styles from "./HomePage.module.css";

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
  firstImage?: string; // primeira imagem retornada direto pela API
  completed_at?: string | null;
  feedback?: number | null;
  warranty?: string | null;
  cost?: number | null;
  work?: number | null;
  deadline?: string | null;
  problem?: string | null;
};

type Service = {
  id: string;
  name: string;
  device: string;
  date: string;
  status: string;
  color: "yellow" | "blue" | "green" | "red";
  imageUrl?: string;
};

export default function HomePage() {
  const [pendingServices, setPendingServices] = useState<Service[]>([]);
  const [recentServices, setRecentServices] = useState<Service[]>([]);
  const [inProgressServices, setInProgressServices] = useState<Service[]>([]);

  const [pendingServicesFull, setPendingServicesFull] = useState<ServiceOrder[]>([]);
  const [recentServicesFull, setRecentServicesFull] = useState<ServiceOrder[]>([]);
  const [inProgressServicesFull, setInProgressServicesFull] = useState<ServiceOrder[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const mapOrdersToServices = (orders: ServiceOrder[]): Service[] => {
    return orders.map((order) => {
      const dateObj = new Date(order.created_at);
      const dateFormatted = dateObj.toLocaleDateString("pt-BR");

      let color: Service["color"];
      switch (order.status) {
        case "in_progress":
          color = "yellow";
          break;
        case "pending":
          color = "blue";
          break;
        case "completed":
          color = "green";
          break;
        case "cancelled":
          color = "red";
          break;
        default:
          color = "blue";
      }

      const imageUrl = order.firstImage
        ? `http://localhost:3001/uploads/${order.firstImage}`
        : undefined;

      return {
        id: order.id.toString(),
        name: order.userDevice?.user?.name ?? "Usuário desconhecido",
        device: order.userDevice?.device?.model ?? "Dispositivo desconhecido",
        date: dateFormatted,
        status: order.status,
        color,
        imageUrl,
      };
    });
  };

  const token = localStorage.getItem("authToken") ?? "";

  const fetchRecentOrders = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:3001/eniwhere/order/store", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        console.error("Erro na resposta da API (recentes):", response.statusText);
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
    if (!token) return;
    try {
      const response = await fetch("http://localhost:3001/eniwhere/order/storeNstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status: "pending" }),
      });

      if (!response.ok) {
        console.error("Erro na resposta da API (pendentes):", response.statusText);
        return;
      }

      const data: ServiceOrder[] = await response.json();
      setPendingServicesFull(data);
      setPendingServices(mapOrdersToServices(data));
    } catch (error) {
      console.error("Erro ao buscar ordens pendentes:", error);
    }
  };

  const fetchInProgressOrders = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:3001/eniwhere/order/storeNstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status: "in_progress" }),
      });

      if (!response.ok) {
        console.error("Erro na resposta da API (em andamento):", response.statusText);
        return;
      }

      const data: ServiceOrder[] = await response.json();
      setInProgressServicesFull(data);
      setInProgressServices(mapOrdersToServices(data));
    } catch (error) {
      console.error("Erro ao buscar ordens em andamento:", error);
    }
  };

  const fetchAllOrders = async () => {
    await Promise.all([fetchRecentOrders(), fetchPendingOrders(), fetchInProgressOrders()]);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  function handleCardClick(service: Service) {
    const idNum = Number(service.id);
    const fullOrder =
      pendingServicesFull.find((o) => o.id === idNum) ||
      recentServicesFull.find((o) => o.id === idNum) ||
      inProgressServicesFull.find((o) => o.id === idNum);

    if (fullOrder) {
      setSelectedOrder(fullOrder);
      setModalOpen(true);
    } else {
      alert("Detalhes da ordem não encontrados.");
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Section
          title="Serviços em andamento"
          link="Ver mais"
          data={inProgressServices}
          pageSize={9}
          onCardClick={handleCardClick}
        />
        <Section
          title="Serviços pendentes"
          link="Ver mais"
          data={pendingServices}
          pageSize={9}
          onCardClick={handleCardClick}
        />
        <Section
          title="Criadas recentemente"
          link="Ver todos"
          data={recentServices}
          pageSize={9}
          onCardClick={handleCardClick}
        />
      </main>

      {modalOpen && selectedOrder && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setModalOpen(false)}
            onUpdate={async (updatedOrder) => {
              setSelectedOrder(updatedOrder);

              // Atualizar listas locais imediatamente
              const updateList = (
                listFull: ServiceOrder[],
                setListFull: React.Dispatch<React.SetStateAction<ServiceOrder[]>>,
                listSimple: Service[],
                setListSimple: React.Dispatch<React.SetStateAction<Service[]>>
              ) => {
                const newFull = listFull.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
                setListFull(newFull);
                setListSimple(mapOrdersToServices(newFull));
              };

              updateList(pendingServicesFull, setPendingServicesFull, pendingServices, setPendingServices);
              updateList(recentServicesFull, setRecentServicesFull, recentServices, setRecentServices);
              updateList(inProgressServicesFull, setInProgressServicesFull, inProgressServices, setInProgressServices);

              // Depois refazer o fetch para garantir dados atualizados
              await fetchAllOrders();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
