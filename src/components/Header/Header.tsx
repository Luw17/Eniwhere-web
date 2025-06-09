// src/components/Header/Header.tsx
import styles from './Header.module.css';
import { FiMenu, FiLogOut } from 'react-icons/fi';

type HeaderProps = {
  onToggleSidebar: () => void;
  onLogout: () => void;
  logoSrc: string;
};

const Header = ({ onToggleSidebar, onLogout}: HeaderProps) => {
  return (
    <header className={styles.header}>
  <div className={styles.leftSection}>
    <button onClick={onToggleSidebar} className={styles.iconButton}>
      <FiMenu size={20} />
    </button>
  </div>

  <div className={styles.centerSection}>
    <img src={"../src/assets/eniwhere2.svg"} alt="Logo" className={styles.logo} />
  </div>

  <div className={styles.rightSection}>
    <button onClick={onLogout} className={styles.iconButton}>
      <FiLogOut size={20} />
    </button>
  </div>
</header>

  );
};

export default Header;
