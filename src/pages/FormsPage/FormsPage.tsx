import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FormsPage.module.css";

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
}

const statusKey: Record<string, string> = {
  "Aguardando retirada": "aguardando",
  "Em andamento": "andamento",
  Concluído: "concluido",
  Cancelado: "cancelado",
};

export default function Formulario() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
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
  });

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

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in form) {
      if (key !== "imgs") {
        formData.append(key, (form as any)[key]);
      }
    }
    form.imgs.forEach((file) => formData.append("imgs", file));

    try {
      const response = await fetch("http://localhost:3001/eniwhere/formulario", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao enviar o formulário");

      alert("Formulário enviado!");
      navigate("/");
    } catch (err) {
      alert("Falha ao enviar formulário");
      console.error(err);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        {step === 1 ? (
          <button onClick={() => navigate("/")} className={styles.smallBtn}>Sair</button>
        ) : (
          <button onClick={() => setStep(1)} className={styles.smallBtn}>Voltar</button>
        )}

        {step === 1 && (
          <>
            <h1 className={styles.title}>FORMULÁRIO</h1>
            <h2 className={styles.section}>QUEM É O CLIENTE?</h2>
            <div className={styles.row}>
              <input className={styles.input} placeholder="Nome" value={form.nome} onChange={handle("nome")} />
              <input className={styles.input} placeholder="Telefone" value={form.tel} onChange={handle("tel")} maxLength={14} />
            </div>
            <input className={styles.input} placeholder="E-mail" value={form.email} onChange={handle("email")} />
            <input className={styles.input} placeholder="Aparelho/marca" value={form.aparelho} onChange={handle("aparelho")} />

            <h2 className={styles.section}>QUAL O TRAMPO?</h2>
            <div className={styles.row}>
              <label className={styles.dropzone}>
                {form.imgs.length > 0 ? (
                  <div className={styles.thumbGrid}>
                    {form.imgs.map((img, i) => (
                      <img key={i} src={URL.createObjectURL(img)} className={styles.thumb} alt={`img-${i}`} />
                    ))}
                  </div>
                ) : (
                  <>
                    <span className={styles.plus}>＋</span>
                    <p>Adicione uma imagem do estado<br />do aparelho quando chegou à loja</p>
                  </>
                )}
                <input type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
              </label>

              <ul className={styles.radioGroup}>
                {["Troca de tela", "Troca de bateria", "Reparo de software", "Troca de conector de carga", "Troca/adição de película", "Outros…"].map((txt) => (
                  <li key={txt}>
                    <label className={styles.radio}>
                      <input type="radio" name="job" checked={form.trampo === txt} onChange={() => setForm({ ...form, trampo: txt })} />
                      <span>{txt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {form.trampo === "Outros…" && (
              <input className={styles.input} placeholder="Descreva o serviço" value={form.trampoOutro} onChange={handle("trampoOutro")} />
            )}
            <div className={styles.actions}>
              <button type="reset" className={styles.cleanBtn} onClick={() => setForm({ ...form, nome: "", tel: "", email: "", aparelho: "", trampo: "", trampoOutro: "", imgs: [] })}>Limpar</button>
              <button onClick={() => setStep(2)} className={styles.primaryBtn} disabled={!form.nome || !form.tel || !form.trampo}>Próximo</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className={styles.title}>QUASE LÁ…</h1>
            <div className={styles.row}>
              <div className={styles.col}>
                <input className={styles.input} placeholder="Valor" value={form.valor} onChange={handle("valor")} />
                <input className={styles.input} placeholder="Prazo" value={form.prazo} onChange={handle("prazo")} />
              </div>
              <div className={styles.col}>
                <ul className={styles.clientInfo}>
                  <li><strong>Nome:</strong> {form.nome}</li>
                  <li><strong>Email:</strong> {form.email}</li>
                  <li><strong>Tel:</strong> {form.tel}</li>
                </ul>
                <input className={`${styles.input} ${styles.garante}`} placeholder="Garantia" value={form.garantia} onChange={handle("garantia")} />
              </div>
            </div>

            <h2 className={`${styles.section} ${styles.statusHeader}`}>STATUS</h2>
            <div className={styles.statusRow}>
              {Object.keys(statusKey).map((label) => (
                <label key={label} className={`${styles.status} ${styles[statusKey[label]]} ${form.status === label ? styles.statusSelected : ""}`}>
                  <input type="radio" name="status" checked={form.status === label} onChange={() => setForm({ ...form, status: label })} />
                  {label}
                </label>
              ))}
            </div>

            <details className={styles.obsContainer}>
              <summary className={styles.obsHeader}>Observações?</summary>
              <textarea rows={6} placeholder="Insira aqui observações e pontos a destacar neste pedido" className={styles.textarea} value={form.obs} onChange={handle("obs")} />
            </details>

            <p className={styles.note}>
              Valor, prazo, status e garantia podem ser atualizados no futuro
            </p>

            <div className={styles.actions}>
              <button type="button" className={styles.cleanBtn} onClick={() => setStep(1)}>Voltar</button>
              <button onClick={handleSubmit} className={styles.primaryBtn} disabled={!form.status}>Finalizar</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
