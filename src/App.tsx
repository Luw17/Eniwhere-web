// src/App.tsx
import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import styles from "./App.module.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Logout");
    // Aqui você pode redirecionar ou limpar o auth token
  };

  return (
    <div className={styles.container}>
      <Header
        onToggleSidebar={handleToggleSidebar}
        onLogout={handleLogout}
        logoSrc="/logoeniwhere.svg"
      />

      {/* Sidebar sempre renderizada, só anima a entrada/saída */}
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={styles.body}>
        <main className={styles.main}>
          {/* Conteúdo principal aqui */}
          <h1>Bem-vindo ao sistema</h1>
        </main>
      </div>
    </div>
  );
}

export default App;
