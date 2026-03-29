export interface TotalCategoriaItem {
  codigoCategoria: number;
  descricaoCategoria: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGeraisCategorias {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface TotaisPorCategoriaResponse {
  categorias: TotalCategoriaItem[];
  totaisGerais: TotaisGeraisCategorias;
}