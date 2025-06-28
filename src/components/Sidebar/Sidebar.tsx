// src/components/Sidebar/Sidebar.tsx
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      {/* Botão de fechar */}
      <button className={styles.closeButton} onClick={onClose}>
        <FiX size={20} />
      </button>

      {/* Logo com clique para navegação */}
      <img
        src="../src/assets/logoeniwhere.svg"
        alt="Logo"
        className={styles.logo}
        onClick={() => handleNavigate("/")}
      />

      <button
        className={styles.createOrder}
        onClick={() => handleNavigate("/formulario")}
      >
        Criar ordem
      </button>

      <nav className={styles.nav}>
        <a href="#" onClick={onClose}>Histórico</a>
        <a href="#" onClick={onClose}>Agenda</a>
        <a href="#" onClick={onClose}>Configurações</a>
        <a href="#" onClick={onClose} className={styles.assinatura}>
          Assinatura
        </a>
      </nav>

      <div className={styles.plusFunctions}>
        <span className={styles.plusTitle}>Funções PLUS</span>
        <button
          className={styles.analytics}
          onClick={() => handleNavigate("/analytics")}
        >
          Analytics
        </button>
        <button className={styles.entime} onClick={onClose}>Enitime</button>
      </div>
    </aside>
  );
}
