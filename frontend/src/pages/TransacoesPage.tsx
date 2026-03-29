import { useEffect, useState } from "react";
import { listarTransacoes, criarTransacao } from "../api/transacoesApi";
import { listarPessoas } from "../api/pessoasApi";
import { listarCategorias } from "../api/categoriasApi";
import type { Transacao } from "../types/Transacao";
import type { Pessoa } from "../types/Pessoa";
import type { Categoria } from "../types/Categoria";

function getTipoTexto(tipo: number): string {
  switch (tipo) {
    case 1:
      return "Despesa";
    case 2:
      return "Receita";
    default:
      return "Desconhecido";
  }
}

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

// Página responsável pelo cadastro e listagem de transações.
// Também carrega as pessoas e categorias necessárias para o formulário.
export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [tipo, setTipo] = useState<number>(1);
  const [codPessoa, setCodPessoa] = useState<number>(0);
  const [codCategoria, setCodCategoria] = useState<number>(0);

  // Carrega os dados necessários da tela:
  // transações já cadastradas, pessoas e categorias.
  async function carregarTudo() {
    try {
      setCarregando(true);
      setErroCarregamento("");

      const [dadosTransacoes, dadosPessoas, dadosCategorias] =
        await Promise.all([
          listarTransacoes(),
          listarPessoas(),
          listarCategorias(),
        ]);

      setTransacoes(dadosTransacoes);
      setPessoas(dadosPessoas);
      setCategorias(dadosCategorias);
    } catch (erro: unknown) {
      console.error("Erro ao carregar dados:", erro);
      setErroCarregamento("Erro ao carregar dados da API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  // Envia a transação para a API.
  // Em caso de erro de regra de negócio, exibe a mensagem retornada pelo back-end.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setErroFormulario("");
      setMensagem("");

      await criarTransacao({
        descricao,
        valor,
        tipo,
        codPessoa,
        codCategoria,
      });

      setMensagem("Transação cadastrada com sucesso.");
      setDescricao("");
      setValor(0);
      setTipo(1);
      setCodPessoa(0);
      setCodCategoria(0);

      await carregarTudo();
    } catch (erro: unknown) {
      console.error("Erro ao cadastrar transação:", erro);

      let mensagemErro = "Erro ao cadastrar transação.";

      if (typeof erro === "object" && erro !== null && "response" in erro) {
        const erroComResponse = erro as {
          response?: {
            data?: unknown;
          };
        };

        if (typeof erroComResponse.response?.data === "string") {
          mensagemErro = erroComResponse.response.data;
        }
      }

      setErroFormulario(mensagemErro);
    }
  }

  // Localiza o nome da pessoa a partir do código para exibir na listagem.
  function getNomePessoa(codigo: number): string {
    const pessoa = pessoas.find((p) => p.codigo === codigo);
    return pessoa ? pessoa.nome : `Pessoa ${codigo}`;
  }

  // Localiza o nome da pessoa a partir do código para exibir na listagem.
  function getDescricaoCategoria(codigo: number): string {
    const categoria = categorias.find((c) => c.codigo === codigo);
    return categoria ? categoria.descricao : `Categoria ${codigo}`;
  }

  // Exibe apenas categorias compatíveis com o tipo selecionado:
  // despesa, receita ou ambas.
  const categoriasCompativeis = categorias.filter((categoria) => {
    return categoria.finalidade === tipo || categoria.finalidade === 3;
  });

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
          Cadastro de Transação
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "450px",
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
            <label htmlFor="valor">Valor</label>
            <br />
            <input
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              min={0.01}
              step={0.01}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="tipo">Tipo</label>
            <br />
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => {
                // Ao trocar o tipo da transação, a categoria selecionada é resetada
                // para evitar incompatibilidade entre tipo e finalidade.
                setTipo(Number(e.target.value));
                setCodCategoria(0);
              }}
              style={{ width: "100%" }}
            >
              <option value={1}>Despesa</option>
              <option value={2}>Receita</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="pessoa">Pessoa</label>
            <br />
            <select
              id="pessoa"
              value={codPessoa}
              onChange={(e) => setCodPessoa(Number(e.target.value))}
              required
              style={{ width: "100%" }}
            >
              <option value={0}>Selecione uma pessoa</option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.codigo} value={pessoa.codigo}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="categoria">Categoria</label>
            <br />
            <select
              id="categoria"
              value={codCategoria}
              onChange={(e) => setCodCategoria(Number(e.target.value))}
              required
              style={{ width: "100%" }}
            >
              <option value={0}>Selecione uma categoria</option>
              {categoriasCompativeis.map((categoria) => (
                <option key={categoria.codigo} value={categoria.codigo}>
                  {categoria.descricao} -{" "}
                  {getFinalidadeTexto(categoria.finalidade)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit">Cadastrar</button>
          </div>
        </form>

        {mensagem && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>{mensagem}</p>
        )}

        {erroFormulario && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>
            {erroFormulario}
          </p>
        )}

        {erroCarregamento && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>
            {erroCarregamento}
          </p>
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
          Lista de Transações
        </h2>

        {carregando && <p>Carregando...</p>}

        {!carregando && transacoes.length === 0 && (
          <p>Nenhuma transação cadastrada.</p>
        )}

        {!carregando && transacoes.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {transacoes.map((transacao) => (
              <li
                key={transacao.codigo}
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
                  {transacao.descricao} - R$ {transacao.valor.toFixed(2)} -{" "}
                  {getTipoTexto(transacao.tipo)} -{" "}
                  {getNomePessoa(transacao.codPessoa)} -{" "}
                  {getDescricaoCategoria(transacao.codCategoria)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
