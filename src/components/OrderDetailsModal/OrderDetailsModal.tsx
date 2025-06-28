import { useState, useEffect } from "react";

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

  useEffect(() => {
    setEditCost(order.cost?.toString() ?? "");
    setEditWork(order.work?.toString() ?? "");
    setEditWarranty(order.warranty ?? "");
    setEditFeedback(order.feedback?.toString() ?? "");
    setEditDeadline(order.deadline ? new Date(order.deadline).toISOString().slice(0, 10) : "");
    setEditProblem(order.problem ?? "");
    setEditStatus(order.status);
  }, [order]);

  async function handleSave() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Token não encontrado, faça login novamente.");
      return;
    }

    // Garante que status nunca será null ou vazio
    const safeStatus = editStatus && editStatus.trim() !== "" ? editStatus : order.status;

    const body = {
      cost: editCost ? parseFloat(editCost) : null,
      work: editWork ? parseFloat(editWork) : null,
      warranty: editWarranty || null,
      feedback: editFeedback ? parseInt(editFeedback) : null,
      deadline: editDeadline || null,
      problem: editProblem || null,
      status: safeStatus,
    };

    try {
      const response = await fetch(`http://localhost:3001/eniwhere/order/${order.id}`, {
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

      // Atualiza localmente o objeto com os novos valores
      const updatedOrder = { ...order, ...body };
      onUpdate(updatedOrder);
      onClose();
      alert("Ordem atualizada com sucesso!");
    } catch (error) {
      alert("Erro ao salvar a ordem: " + error);
    }
  }

  return (
    <>
      <h2>Ordem #{order.id}</h2>

      <p>
        <strong>Status:</strong>{" "}
        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </p>

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

      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        Salvar
      </button>
    </>
  );
}
