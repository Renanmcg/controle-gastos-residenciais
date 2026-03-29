import { api } from "./axios";
import type { TotaisPorPessoaResponse } from "../types/TotaisPorPessoa";
import type { TotaisPorCategoriaResponse } from "../types/TotaisPorCategoria";

// Funções responsáveis por consumir os endpoints de relatórios da Web API.
export async function listarTotaisPorPessoa(): Promise<TotaisPorPessoaResponse> {
  const response = await api.get<TotaisPorPessoaResponse>(
    "/Relatorios/totais-por-pessoa"
  );
  return response.data;
}

export async function listarTotaisPorCategoria(): Promise<TotaisPorCategoriaResponse> {
  const response = await api.get<TotaisPorCategoriaResponse>(
    "/Relatorios/totais-por-categoria"
  );
  return response.data;
}