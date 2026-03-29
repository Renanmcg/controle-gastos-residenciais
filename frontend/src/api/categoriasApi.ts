import { api } from "./axios";
import type { Categoria } from "../types/Categoria";

// Funções responsáveis por consumir os endpoints de categorias da Web API. 

export async function listarCategorias(): Promise<Categoria[]> {
  const response = await api.get<Categoria[]>("/Categorias");
  return response.data;
}

export async function criarCategoria(categoria: {
  descricao: string;
  finalidade: number;
}): Promise<Categoria> {
  const response = await api.post<Categoria>("/Categorias", categoria);
  return response.data;
}