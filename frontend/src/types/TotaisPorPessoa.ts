export interface TotalPessoaItem {
  codigoPessoa: number;
  nomePessoa: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGeraisPessoas {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface TotaisPorPessoaResponse {
  pessoas: TotalPessoaItem[];
  totaisGerais: TotaisGeraisPessoas;
}