import { useEffect, useState } from "react";
import { listarTotaisPorCategoria } from "../api/relatoriosApi";
import type {
  TotalCategoriaItem,
  TotaisGeraisCategorias,
} from "../types/TotaisPorCategoria";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Página responsável por exibir o relatório consolidado de totais por categoria.
export default function TotaisPorCategoriaPage() {
  const [itens, setItens] = useState<TotalCategoriaItem[]>([]);
  const [totaisGerais, setTotaisGerais] =
    useState<TotaisGeraisCategorias | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca os dados consolidados do relatório por categoria e atualiza a tabela.
  async function carregarTotais() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await listarTotaisPorCategoria();
      setItens(dados.categorias);
      setTotaisGerais(dados.totaisGerais);
    } catch (erro: unknown) {
      console.error("Erro ao carregar totais por categoria:", erro);
      setErro("Não foi possível carregar os totais por categoria.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTotais();
  }, []);

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
        }}
      >
        <h2 style={{ textAlign: "center", marginTop: 0 }}>
          Totais por Categoria
        </h2>

        {carregando && <p>Carregando...</p>}
        {erro && <p style={{ textAlign: "center" }}>{erro}</p>}

        {!carregando && !erro && itens.length === 0 && (
          <p style={{ textAlign: "center" }}>Nenhum dado encontrado.</p>
        )}

        {!carregando && !erro && itens.length > 0 && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #555", padding: "10px" }}>
                      Código
                    </th>
                    <th style={{ border: "1px solid #555", padding: "10px" }}>
                      Categoria
                    </th>
                    <th style={{ border: "1px solid #555", padding: "10px" }}>
                      Total de Receitas
                    </th>
                    <th style={{ border: "1px solid #555", padding: "10px" }}>
                      Total de Despesas
                    </th>
                    <th style={{ border: "1px solid #555", padding: "10px" }}>
                      Saldo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.codigoCategoria}>
                      <td style={{ border: "1px solid #555", padding: "10px" }}>
                        {item.codigoCategoria}
                      </td>
                      <td style={{ border: "1px solid #555", padding: "10px" }}>
                        {item.descricaoCategoria}
                      </td>
                      <td style={{ border: "1px solid #555", padding: "10px" }}>
                        {formatarMoeda(item.totalReceitas)}
                      </td>
                      <td style={{ border: "1px solid #555", padding: "10px" }}>
                        {formatarMoeda(item.totalDespesas)}
                      </td>
                      <td style={{ border: "1px solid #555", padding: "10px" }}>
                        {formatarMoeda(item.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totaisGerais && (
              <div
                style={{
                  marginTop: "25px",
                  textAlign: "center",
                  lineHeight: "1.9",
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>Totais Gerais</h3>
                <div>
                  <strong>Total de Receitas:</strong>{" "}
                  {formatarMoeda(totaisGerais.totalReceitas)}
                </div>
                <div>
                  <strong>Total de Despesas:</strong>{" "}
                  {formatarMoeda(totaisGerais.totalDespesas)}
                </div>
                <div>
                  <strong>Saldo Líquido:</strong>{" "}
                  {formatarMoeda(totaisGerais.saldoLiquido)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}