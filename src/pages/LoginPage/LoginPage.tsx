import React, { useState, useEffect } from "react";
import styles from "./LoginPage.module.css";

type LoginPageProps = {
  onLogin: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

    

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await fetch("http://localhost:3001/eniwhere/verify-token", {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            onLogin(); // Token válido: pula login
            return;
          } else {
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          console.error("Erro ao verificar token:", error);
          localStorage.removeItem("authToken");
        }
      }
      setIsCheckingToken(false);
    };

    checkAuthToken();
  }, [onLogin]);


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoggingIn(true);

  try {
    const response = await fetch("http://localhost:3001/eniwhere/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, userPassword: password }),
    });

    const result = await response.json();

    if(!result.id){
      alert("Usuário ou senha inválidos.");
      return;
    }
    else if (result.role !== "store") {
      alert("Apenas usuários com permissão de loja podem acessar.");
      return;
    }
    else{
      setUserId(result.id);
      setShow2FAModal(true);
    }
  } catch (error) {
    console.error("Erro ao conectar à API:", error);
    alert("Erro na conexão com o servidor.");
  } finally {
    setIsLoggingIn(false);
  }
};



const handle2FAVerification = async () => {
  if (!userId) return;
  setIsVerifying2FA(true);

  try {
    const response = await fetch(
      "http://localhost:3001/eniwhere/verify-2fa",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: twoFACode }),
      }
    );

    const result = await response.text();

    if (result.startsWith("Bearer ")) {
      localStorage.setItem("authToken", result);
      setShow2FAModal(false);
      onLogin();
    } else {
      alert("Código 2FA inválido.");
    }
  } catch (error) {
    console.error("Erro na verificação 2FA:", error);
    alert("Erro ao verificar o código 2FA.");
  } finally {
    setIsVerifying2FA(false);
  }
};



  if (isCheckingToken) {
    return <div>Verificando autenticação...</div>;
  }

  return (
    <div className={styles["login-background"]}>
      <div className={styles["login-box"]}>
        <span className={styles.header}>BEM‑VINDO(A)!</span>

        <form onSubmit={handleLogin}>
          <div className={styles["input-group"]}>
            <label>Usuário</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles["input-group"]}>
            <label>Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles["forgot-password"]}>
            <a href="#">esqueci a senha</a>
          </div>

          <button
            id="login-button"
            type="submit"
            className={styles.button}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </button>


          <div className={styles["signup-text"]}>
            não possui conta? <a href="#">cadastre-se</a>
          </div>
        </form>
      </div>

      {show2FAModal && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-box"]}>
            <button
              className={styles["close-button"]}
              onClick={() => setShow2FAModal(false)}
            >
              ×
            </button>
            <h3 className={styles["modal-title"]}>
              Digite o código de Autenticação
            </h3>
            <input
              type="text"
              maxLength={6}
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              className={styles["modal-input"]}
            />
            <button
              onClick={handle2FAVerification}
              className={styles["modal-button"]}
              disabled={isVerifying2FA}
            >
              {isVerifying2FA ? "Verificando..." : "Verificar"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
