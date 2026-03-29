import { api } from "./axios";
import type { Pessoa } from "../types/Pessoa";

// Funções responsáveis por consumir os endpoints de pessoas da Web API.
export async function listarPessoas(): Promise<Pessoa[]> {
  const response = await api.get<Pessoa[]>("/Pessoas");
  return response.data;
}

export async function criarPessoa(pessoa: {
  nome: string;
  idade: number;
}): Promise<Pessoa> {
  const response = await api.post<Pessoa>("/Pessoas", pessoa);
  return response.data;
}

export async function excluirPessoa(codigo: number): Promise<void> {
  await api.delete(`/Pessoas/${codigo}`);
}

export async function editarPessoa(pessoa: {
  codigo: number;
  nome: string;
  idade: number;
}): Promise<Pessoa> {
  const response = await api.put<Pessoa>(`/Pessoas/${pessoa.codigo}`, pessoa);
  return response.data;
}