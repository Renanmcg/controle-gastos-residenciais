import { api } from "./axios";
import type { Transacao } from "../types/Transacao";

// Funções responsáveis por consumir os endpoints de transações da Web API. 
export async function listarTransacoes(): Promise<Transacao[]> {
  const response = await api.get<Transacao[]>("/Transacoes");
  return response.data;
}

export async function criarTransacao(transacao: {
  descricao: string;
  valor: number;
  tipo: number;
  codPessoa: number;
  codCategoria: number;
}): Promise<Transacao> {
  const response = await api.post<Transacao>("/Transacoes", transacao);
  return response.data;
}