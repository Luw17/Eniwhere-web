import { useState, useEffect } from "react";
import styles from "./OrderDetailsModal.module.css";

// DEFINIÇÃO DA URL BASE (Local ou Nuvem)
const apiUrl = import.meta.env.VITE_API_URL;

type Picture = {
  id: number;
  path: string;
};

type ServiceOrder = {
  id: number;
  created_at: string;
  status: string;
  userDevice?: {
    user?: { name: string };
    device?: { model: string };
  };
  completed_at?: string | null;
  feedback?: number | null;
  warranty?: string | null;
  cost?: number | null;
  work?: number | null;
  deadline?: string | null;
  problem?: string | null;
  pictures?: Picture[];
};

interface OrderDetailsModalProps {
  order: ServiceOrder;
  onClose: () => void;
  onUpdate: (updatedOrder: ServiceOrder) => void;
}

export default function OrderDetailsModal({ order, onClose, onUpdate }: OrderDetailsModalProps) {
  const [editCost, setEditCost] = useState(order.cost?.toString() ?? "");
  const [editWork, setEditWork] = useState(order.work?.toString() ?? "");
  const [editWarranty, setEditWarranty] = useState(order.warranty ?? "");
  const [editFeedback, setEditFeedback] = useState(order.feedback?.toString() ?? "");
  const [editDeadline, setEditDeadline] = useState(order.deadline ? new Date(order.deadline).toISOString().slice(0, 10) : "");
  const [editProblem, setEditProblem] = useState(order.problem ?? "");
  const [editStatus, setEditStatus] = useState(order.status);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setEditCost(order.cost?.toString() ?? "");
    setEditWork(order.work?.toString() ?? "");
    setEditWarranty(order.warranty ?? "");
    setEditFeedback(order.feedback?.toString() ?? "");
    setEditDeadline(order.deadline ? new Date(order.deadline).toISOString().slice(0, 10) : "");
    setEditProblem(order.problem ?? "");
    setEditStatus(order.status);
    setCurrentImageIndex(0);
  }, [order]);

  const pictures = order.pictures ?? [];

  const handlePrevImage = () => {
    setCurrentImageIndex((i) => (i === 0 ? pictures.length - 1 : i - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((i) => (i === pictures.length - 1 ? 0 : i + 1));
  };

  async function handleSave() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Token não encontrado, faça login novamente.");
      return;
    }

    const parseNullableDecimal = (value: string): number | null => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    const safeStatus = editStatus && editStatus.trim() !== "" ? editStatus : order.status;

    const body = {
      cost: parseNullableDecimal(editCost),
      work: parseNullableDecimal(editWork),
      warranty: editWarranty || null,
      feedback: editFeedback ? parseInt(editFeedback) : null,
      deadline: editDeadline || null,
      problem: editProblem || null,
      status: safeStatus,
    };

    try {
      // AJUSTE AQUI: Usando apiUrl
      const response = await fetch(`${apiUrl}/eniwhere/order/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        alert("Erro ao salvar a ordem.");
        return;
      }

      const updatedOrder = { ...order, ...body };
      onUpdate(updatedOrder);
      onClose();
      alert("Ordem atualizada com sucesso!");
    } catch (error) {
      alert("Erro ao salvar a ordem: " + error);
    }
  }

  return (
    <div className={styles.modalContent}>
      <div className={styles.details}>
        <h2>Ordem #{order.id}</h2>

        <p>
          <strong>Cliente:</strong> {order.userDevice?.user?.name ?? "Usuário desconhecido"}
        </p>

        <p>
          <strong>Dispositivo:</strong> {order.userDevice?.device?.model ?? "Desconhecido"}
        </p>

        <p>
          <strong>Data criação:</strong> {new Date(order.created_at).toLocaleDateString("pt-BR")}
        </p>

        <p>
          <strong>Data conclusão:</strong>{" "}
          {order.completed_at ? new Date(order.completed_at).toLocaleDateString("pt-BR") : "—"}
        </p>

        <p>
          <strong>Custo:</strong>{" "}
          <input type="number" step="0.01" value={editCost} onChange={(e) => setEditCost(e.target.value)} />
        </p>

        <p>
          <strong>Trabalho:</strong>{" "}
          <input type="number" step="0.01" value={editWork} onChange={(e) => setEditWork(e.target.value)} />
        </p>

        <p>
          <strong>Garantia:</strong>{" "}
          <input type="text" value={editWarranty} onChange={(e) => setEditWarranty(e.target.value)} />
        </p>

        <p>
          <strong>Feedback:</strong>{" "}
          <input
            type="number"
            min="0"
            max="5"
            value={editFeedback}
            onChange={(e) => setEditFeedback(e.target.value)}
          />
        </p>

        <p>
          <strong>Prazo:</strong>{" "}
          <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
        </p>

        <p>
          <strong>Problema:</strong>{" "}
          <textarea rows={3} value={editProblem} onChange={(e) => setEditProblem(e.target.value)} />
        </p>

        <div className={styles.statusButtons}>
          {[
            { value: "pending", label: "Pendente", color: "#999" },
            { value: "in_progress", label: "Em andamento", color: "#ffeb00" },
            { value: "completed", label: "Concluído", color: "#4CAF50" },
            { value: "cancelled", label: "Cancelado", color: "#f44336" },
          ].map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              style={{
                backgroundColor: editStatus === value ? color : "transparent",
                color: editStatus === value ? "#000" : "#444",
                border: `2px solid ${color}`,
              }}
              onClick={() => setEditStatus(value)}
              className={styles.statusButton}
            >
              {label}
            </button>
          ))}
        </div>

        <button onClick={handleSave} style={{ marginTop: "1rem" }}>
          Salvar
        </button>
      </div>

      <div className={styles.imageCarousel}>
        {pictures.length > 0 ? (
          <>
            <img
              // AJUSTE AQUI: Usando apiUrl
              src={`${apiUrl}/uploads/${pictures[currentImageIndex].path}`}
              alt={`Imagem ${currentImageIndex + 1} da ordem ${order.id}`}
              className={styles.carouselImage}
            />
            {pictures.length > 1 && (
              <div className={styles.carouselControls}>
                <button onClick={handlePrevImage} aria-label="Imagem anterior">
                  ←
                </button>
                <span>
                  {currentImageIndex + 1} / {pictures.length}
                </span>
                <button onClick={handleNextImage} aria-label="Próxima imagem">
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Sem imagens disponíveis</p>
        )}
      </div>
    </div>
  );
}