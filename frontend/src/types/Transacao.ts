export interface Transacao {
  codigo: number;
  descricao: string;
  valor: number;
  tipo: number;
  codPessoa: number;
  codCategoria: number;
  excluido: boolean;
  dataCriacao: string;
  dataAlteracao?: string | null;
  dataExclusao?: string | null;
}