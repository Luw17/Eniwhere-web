// src/App.tsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import styles from "./App.module.css";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    console.log("Logout");
  };

  return (
    <Router>
      <div className={styles.container}>
        {isAuthenticated && (
          <>
            <Header
              onToggleSidebar={handleToggleSidebar}
              onLogout={handleLogout}
              logoSrc="/logoeniwhere.svg"
            />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </>
        )}

        <div className={styles.body}>
          <main className={styles.main}>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? <Navigate to="/home" /> : <LoginPage onLogin={handleLogin} />
                }
              />
              <Route
                path="/home"
                element={
                  isAuthenticated ? <HomePage /> : <Navigate to="/" />
                }
              />

              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
