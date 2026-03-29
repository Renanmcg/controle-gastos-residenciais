import { useEffect, useState } from "react";
import {
  criarPessoa,
  editarPessoa,
  excluirPessoa,
  listarPessoas,
} from "../api/pessoasApi";
import type { Pessoa } from "../types/Pessoa";

// Página responsável pelo cadastro, edição, exclusão e listagem de pessoas.
export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<number>(0);

  const [codigoEdicao, setCodigoEdicao] = useState<number | null>(null);
  const [editando, setEditando] = useState(false);

  // Carrega a lista inicial de pessoas ao abrir a página.
  async function carregarPessoas() {
    try {
      setErro("");
      const dados = await listarPessoas();
      setPessoas(dados);
    } catch (erro: unknown) {
      console.error("Erro ao carregar pessoas:", erro);
      setErro("Erro ao carregar pessoas da API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  // O mesmo formulário é usado para cadastro e edição.
  // Se houver uma pessoa em edição, atualiza; caso contrário, cria um novo registro.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setErro("");
      setMensagem("");

      if (editando && codigoEdicao !== null) {
        await editarPessoa({
          codigo: codigoEdicao,
          nome,
          idade,
        });

        setMensagem("Pessoa editada com sucesso.");
      } else {
        await criarPessoa({
          nome,
          idade,
        });

        setMensagem("Pessoa cadastrada com sucesso.");
      }

      setNome("");
      setIdade(0);
      setCodigoEdicao(null);
      setEditando(false);

      await carregarPessoas();
    } catch (erro: unknown) {
      console.error("Erro ao salvar pessoa:", erro);
      setErro("Erro ao salvar pessoa.");
    }
  }

  // Solicita confirmação antes de excluir a pessoa selecionada.
  async function handleExcluir(codigo: number) {
    const confirmou = window.confirm("Deseja realmente excluir esta pessoa?");
    if (!confirmou) return;

    try {
      setErro("");
      setMensagem("");

      await excluirPessoa(codigo);

      setMensagem("Pessoa excluída com sucesso.");
      await carregarPessoas();
    } catch (erro: unknown) {
      console.error("Erro ao excluir pessoa:", erro);
      setErro("Erro ao excluir pessoa.");
    }
  }

  // Preenche o formulário com os dados da pessoa escolhida para edição.
  function handleEditar(pessoa: Pessoa) {
    setNome(pessoa.nome);
    setIdade(pessoa.idade);
    setCodigoEdicao(pessoa.codigo);
    setEditando(true);
    setMensagem("");
    setErro("");
  }

  // Limpa o formulário e encerra o modo de edição.
  function handleCancelarEdicao() {
    setNome("");
    setIdade(0);
    setCodigoEdicao(null);
    setEditando(false);
    setMensagem("");
    setErro("");
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
          {editando ? "Edição de Pessoa" : "Cadastro de Pessoa"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="nome">Nome</label>
            <br />
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={200}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="idade">Idade</label>
            <br />
            <input
              id="idade"
              type="number"
              value={idade}
              onChange={(e) => setIdade(Number(e.target.value))}
              min={0}
              max={150}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button type="submit">
              {editando ? "Salvar edição" : "Cadastrar"}
            </button>

            {editando && (
              <button type="button" onClick={handleCancelarEdicao}>
                Cancelar
              </button>
            )}
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
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Lista de Pessoas</h2>

        {carregando && <p>Carregando...</p>}

        {!carregando && !erro && pessoas.length === 0 && (
          <p>Nenhuma pessoa cadastrada.</p>
        )}

        {!carregando && !erro && pessoas.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pessoas.map((pessoa) => (
              <li
                key={pessoa.codigo}
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
                <span>
                  {pessoa.nome} - {pessoa.idade} anos
                </span>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => handleEditar(pessoa)}>Editar</button>
                  <button onClick={() => handleExcluir(pessoa.codigo)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
