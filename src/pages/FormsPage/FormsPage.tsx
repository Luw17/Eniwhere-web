import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FormsPage.module.css";

// DEFINIÇÃO DA URL BASE (Local ou Nuvem)
const apiUrl = import.meta.env.VITE_API_URL;

interface FormData {
  nome: string;
  tel: string;
  email: string;
  aparelho: string;
  trampo: string;
  trampoOutro: string;
  imgs: File[];
  valor: string;
  prazo: string;
  garantia: string;
  status: string;
  obs: string;
  document: string;
}

interface Device {
  id: number;
  deviceName: string;
  model: string;
  brand: string;
  active: boolean;
}

const statusOptions = [
  { label: "Pendente", value: "pending" },
  { label: "Em andamento", value: "in_progress" },
];

export default function Formulario() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [devices, setDevices] = useState<Device[]>([]);
  const [showDocumentModal, setShowDocumentModal] = useState(true);
  const [showUserChoiceModal, setShowUserChoiceModal] = useState(false);
  const [documentInput, setDocumentInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  const [form, setForm] = useState<FormData>({
    nome: "",
    tel: "",
    email: "",
    aparelho: "",
    trampo: "",
    trampoOutro: "",
    imgs: [],
    valor: "",
    prazo: "",
    garantia: "",
    status: "",
    obs: "",
    document: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }

    // AJUSTE AQUI: Usando apiUrl
    fetch(`${apiUrl}/eniwhere/devices`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data: Device[]) => {
        const ativos = data.filter((d) => d.active);
        setDevices(ativos);
      })
      .catch((err) => {
        console.error("Erro ao buscar dispositivos:", err);
      });
  }, []);

  const handle =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.imgs.length > 4) {
      alert("Máximo de 4 imagens");
      return;
    }
    setForm({ ...form, imgs: [...form.imgs, ...files] });
  };

  const verifyDocument = async () => {
    if (!documentInput.trim()) {
      alert("Digite o documento.");
      return;
    }

    setIsVerifying(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        setIsVerifying(false);
        return;
      }

      // AJUSTE AQUI: Usando apiUrl
      const res = await fetch(
        `${apiUrl}/eniwhere/user/verify/${encodeURIComponent(documentInput)}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!res.ok) throw new Error("Erro na verificação");

      const isValid = await res.json();

      if (isValid === true) {
        // AJUSTE AQUI: Usando apiUrl
        const userRes = await fetch(
          `${apiUrl}/eniwhere/user/document/${encodeURIComponent(documentInput)}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );

        if (!userRes.ok) throw new Error("Erro ao buscar dados do usuário");

        const user = await userRes.json();

        setForm((prev) => ({
          ...prev,
          document: documentInput,
          nome: user.name || "",
          tel: user.phone || "",
          email: user.email || "",
        }));

        setUserExists(true);
        setShowDocumentModal(false);
      } else {
        setUserExists(false);
        setShowDocumentModal(false);
        setShowUserChoiceModal(true);
      }
    } catch (err) {
      alert("Erro ao verificar documento.");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateUserChoice = () => {
    setForm((prev) => ({
      ...prev,
      document: documentInput,
    }));
    setShowUserChoiceModal(false);
  };

  const handleRedigitarDocumento = () => {
    setShowUserChoiceModal(false);
    setShowDocumentModal(true);
    setDocumentInput("");
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      if (userExists === false) {
        // AJUSTE AQUI: Usando apiUrl
        const resUser = await fetch(`${apiUrl}/eniwhere/user`, {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document: form.document,
            name: form.nome,
            email: form.email,
            phone: form.tel,
            username: form.email,
            userPassword: "senha123",
            number: 0,
          }),
        });

        if (!resUser.ok) {
          const text = await resUser.text();
          throw new Error(`Erro ao criar usuário: ${text}`);
        }
      }

      const formData = new FormData();

      formData.append("workerId", "1");
      formData.append("document", form.document);
      formData.append("deviceId", form.aparelho);
      formData.append("work", "0");
      formData.append(
        "problem",
        form.trampo === "Outros…" ? form.trampoOutro : form.trampo
      );
      formData.append("deadline", form.prazo);

      // ✅ Aqui: envia "0" se estiver vazio
      formData.append("cost", form.valor.trim() === "" ? "0" : form.valor);

      formData.append("status", form.status);
      formData.append("storeId", "1");

      form.imgs.forEach((file) => {
        formData.append("images", file);
      });

      // AJUSTE AQUI: Usando apiUrl
      const response = await fetch(`${apiUrl}/eniwhere/order`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Erro ao enviar o formulário: ${err}`);
      }

      alert("Formulário enviado com sucesso!");
      navigate("/");
    } catch (err: any) {
      alert(`Falha ao enviar formulário: ${err.message || err}`);
      console.error(err);
    }
  };

  return (
    <>
      {/* Modal para documento */}
      {showDocumentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Informe o documento</h2>
            <input
              className={styles.input}
              type="text"
              placeholder="Documento"
              value={documentInput}
              onChange={(e) => setDocumentInput(e.target.value)}
            />
            <div className={styles.actions} style={{ justifyContent: "center", marginTop: 20 }}>
              <button
                className={styles.cleanBtn}
                onClick={() => navigate("/")}
                style={{ marginRight: 10 }}
              >
                Fechar
              </button>
              <button
                className={styles.primaryBtn}
                onClick={verifyDocument}
                disabled={isVerifying}
              >
                {isVerifying ? "Verificando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal escolha criar usuário ou redigitar documento */}
      {showUserChoiceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Usuário não encontrado</h2>
            <p>Deseja cadastrar ou digitar outro documento?</p>
            <div className={styles.actions}>
              <button
                className={styles.cleanBtn}
                onClick={handleRedigitarDocumento}
              >
                Redigitar
              </button>
              <button
                className={styles.primaryBtn}
                onClick={handleCreateUserChoice}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className={styles.page}
        style={{
          filter: showDocumentModal || showUserChoiceModal ? "blur(2px)" : "none",
          pointerEvents:
            showDocumentModal || showUserChoiceModal ? "none" : "auto",
        }}
      >
        <section className={styles.card}>
          {step === 1 ? (
            <button onClick={() => navigate("/")} className={styles.smallBtn}>
              Sair
            </button>
          ) : (
            <button onClick={() => setStep(1)} className={styles.smallBtn}>
              Voltar
            </button>
          )}

          {step === 1 && (
            <>
              <h1 className={styles.title}>FORMULÁRIO</h1>

              {/* Exibir campos nome, telefone e email só se usuário NÃO existir */}
              {userExists === false && (
                <>
                  <h2 className={styles.section}>QUEM É O CLIENTE?</h2>
                  <div className={styles.row}>
                    <input
                      className={styles.input}
                      placeholder="Nome"
                      value={form.nome}
                      onChange={handle("nome")}
                    />
                    <input
                      className={styles.input}
                      placeholder="Telefone"
                      value={form.tel}
                      onChange={handle("tel")}
                      maxLength={14}
                    />
                  </div>
                  <input
                    className={styles.input}
                    placeholder="E-mail"
                    value={form.email}
                    onChange={handle("email")}
                  />
                </>
              )}

              <select
                className={styles.select}
                value={form.aparelho}
                onChange={(e) => setForm({ ...form, aparelho: e.target.value })}
              >
                <option value="">Selecione um dispositivo</option>
                {devices.map((d) => (
                  <option key={d.id} value={d.id.toString()}>
                    {d.deviceName} - {d.brand} - {d.model}
                  </option>
                ))}
              </select>

              <h2 className={styles.section}>QUAL O TRAMPO?</h2>
              <div className={styles.row}>
                <label className={styles.dropzone}>
                  {form.imgs.length > 0 ? (
                    <div className={styles.thumbGrid}>
                      {form.imgs.map((img, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(img)}
                          className={styles.thumb}
                          alt={`img-${i}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <span className={styles.plus}>＋</span>
                      <p>
                        Adicione uma imagem do estado
                        <br />
                        do aparelho quando chegou à loja
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </label>

                <ul className={styles.radioGroup}>
                  {[
                    "Troca de tela",
                    "Troca de bateria",
                    "Reparo de software",
                    "Troca de conector de carga",
                    "Troca/adição de película",
                    "Outros…",
                  ].map((txt) => (
                    <li key={txt}>
                      <label className={styles.radio}>
                        <input
                          type="radio"
                          name="job"
                          checked={form.trampo === txt}
                          onChange={() => setForm({ ...form, trampo: txt })}
                        />
                        <span>{txt}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {form.trampo === "Outros…" && (
                <input
                  className={styles.input}
                  placeholder="Descreva o serviço"
                  value={form.trampoOutro}
                  onChange={handle("trampoOutro")}
                />
              )}

              <div className={styles.actions}>
                <button
                  type="reset"
                  className={styles.cleanBtn}
                  onClick={() =>
                    setForm({
                      ...form,
                      nome: "",
                      tel: "",
                      email: "",
                      aparelho: "",
                      trampo: "",
                      trampoOutro: "",
                      imgs: [],
                      document: "",
                    })
                  }
                >
                  Limpar
                </button>
                <button
                  onClick={() => setStep(2)}
                  className={styles.primaryBtn}
                  disabled={!form.trampo || !form.aparelho || !form.document}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className={styles.title}>QUASE LÁ…</h1>
              <div className={styles.row}>
                <div className={styles.col}>
                  <input
                    className={styles.input}
                    placeholder="Valor"
                    value={form.valor}
                    onChange={handle("valor")}
                  />
                  <input
                    className={styles.input}
                    placeholder="Prazo"
                    value={form.prazo}
                    onChange={handle("prazo")}
                  />
                </div>
                <div className={styles.col}>
                  <ul className={styles.clientInfo}>
                    <li>
                      <strong>Nome:</strong> {form.nome}
                    </li>
                    <li>
                      <strong>Email:</strong> {form.email}
                    </li>
                    <li>
                      <strong>Tel:</strong> {form.tel}
                    </li>
                  </ul>
                  <input
                    className={`${styles.input} ${styles.garante}`}
                    placeholder="Garantia"
                    value={form.garantia}
                    onChange={handle("garantia")}
                  />
                </div>
              </div>

              <h2 className={`${styles.section} ${styles.statusHeader}`}>
                STATUS
              </h2>
              <div className={styles.statusRow}>
                {statusOptions.map(({ label, value }) => (
                  <label
                    key={value}
                    className={`${styles.status} ${
                      form.status === value ? styles.statusSelected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={value}
                      checked={form.status === value}
                      onChange={() => setForm({ ...form, status: value })}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <p className={styles.note}>
                Valor, prazo, status e garantia podem ser atualizados no futuro
              </p>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cleanBtn}
                  onClick={() => setStep(1)}
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  className={styles.primaryBtn}
                  disabled={!form.status}
                >
                  Finalizar
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}