import { useEffect, useState } from "react";
import { criarCategoria, listarCategorias } from "../api/categoriasApi";
import type { Categoria } from "../types/Categoria";

// Converte o valor numérico da finalidade em um texto legível para exibição na tela.
function getFinalidadeTexto(finalidade: number): string {
  switch (finalidade) {
    case 1:
      return "Despesa";
    case 2:
      return "Receita";
    case 3:
      return "Ambas";
    default:
      return "Desconhecida";
  }
}

// Página responsável pelo cadastro e listagem de categorias.
export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<number>(3);

  // Carrega as categorias cadastradas ao abrir a página.
  async function carregarCategorias() {
    try {
      setErro("");
      const dados = await listarCategorias();
      setCategorias(dados);
    } catch (erro: unknown) {
      console.error("Erro ao carregar categorias:", erro);
      setErro("Erro ao carregar categorias da API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  // Envia uma nova categoria para a API e atualiza a listagem após o cadastro.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setErro("");
      setMensagem("");

      await criarCategoria({
        descricao,
        finalidade,
      });

      setMensagem("Categoria cadastrada com sucesso.");
      setDescricao("");
      setFinalidade(3);

      await carregarCategorias();
    } catch (erro: unknown) {
      console.error("Erro ao cadastrar categoria:", erro);
      setErro("Erro ao cadastrar categoria.");
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Sistema de Controle de Gastos Residenciais
      </h1>

      <div
        style={{
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", marginTop: 0 }}>
          Cadastro de Categoria
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="descricao">Descrição</label>
            <br />
            <input
              id="descricao"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={400}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="finalidade">Finalidade</label>
            <br />
            <select
              id="finalidade"
              value={finalidade}
              onChange={(e) => setFinalidade(Number(e.target.value))}
              style={{ width: "100%" }}
            >
              <option value={1}>Despesa</option>
              <option value={2}>Receita</option>
              <option value={3}>Ambas</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit">Cadastrar</button>
          </div>
        </form>

        {mensagem && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>{mensagem}</p>
        )}

        {erro && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>{erro}</p>
        )}
      </div>

      <div
        style={{
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", marginTop: 0 }}>
          Lista de Categorias
        </h2>

        {carregando && <p>Carregando...</p>}

        {!carregando && !erro && categorias.length === 0 && (
          <p>Nenhuma categoria cadastrada.</p>
        )}

        {!carregando && !erro && categorias.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {categorias.map((categoria) => (
              <li
                key={categoria.codigo}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom: "1px solid #333",
                  flexWrap: "wrap",
                }}
              >
                <span>{categoria.descricao}</span>

                <span>{getFinalidadeTexto(categoria.finalidade)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
