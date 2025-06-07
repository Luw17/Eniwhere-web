// src/components/Sidebar/Sidebar.tsx
import { FiX } from "react-icons/fi";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      {/* Botão de fechar */}
      <button className={styles.closeButton} onClick={onClose}>
        <FiX size={20} />
      </button>

      <img src="../src/assets/logoeniwhere.svg" alt="Logo" className={styles.logo} />

      <button className={styles.createOrder}>Criar ordem</button>

      <nav className={styles.nav}>
        <a href="#">Histórico</a>
        <a href="#">Agenda</a>
        <a href="#">Configurações</a>
        <a href="#" className={styles.assinatura}>Assinatura</a>
      </nav>

      <div className={styles.plusFunctions}>
        <span className={styles.plusTitle}>Funções PLUS</span>
        <button className={styles.analytics}>Analitics</button>
        <button className={styles.entime}>Enitime</button>
      </div>
    </aside>
  );
}
