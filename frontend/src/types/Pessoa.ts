export interface Pessoa {
  codigo: number;
  nome: string;
  idade: number;
  excluido: boolean;
  dataCriacao: string;
  dataAlteracao?: string | null;
  dataExclusao?: string | null;
}