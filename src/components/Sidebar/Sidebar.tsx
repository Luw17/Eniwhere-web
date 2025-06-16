// src/components/Sidebar/Sidebar.tsx
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Importando o hook useNavigate
import styles from "./Sidebar.module.css";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate(); // Hook de navegação

  // Função para redirecionar ao clicar no logo
  const handleLogoClick = () => {
    navigate("/"); // Redireciona para a página inicial
  };

  // Função para redirecionar ao clicar no botão Analytics
  const handleAnalyticsClick = () => {
    navigate("/analytics"); // Redireciona para a página de Analytics
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
        onClick={handleLogoClick} // Usando a função de navegação
      />

      <button className={styles.createOrder}>Criar ordem</button>

      <nav className={styles.nav}>
        <a href="#">Histórico</a>
        <a href="#">Agenda</a>
        <a href="#">Configurações</a>
        <a href="#" className={styles.assinatura}>Assinatura</a>
      </nav>

      <div className={styles.plusFunctions}>
        <span className={styles.plusTitle}>Funções PLUS</span>
        {/* Botão Analytics que agora redireciona para a rota /analytics */}
        <button className={styles.analytics} onClick={handleAnalyticsClick}>
          Analytics
        </button>
        <button className={styles.entime}>Enitime</button>
      </div>
    </aside>
  );
}
