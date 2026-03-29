export interface Categoria {
  codigo: number;
  descricao: string;
  finalidade: number;
  excluido: boolean;
  dataCriacao: string;
  dataAlteracao?: string | null;
  dataExclusao?: string | null;
}