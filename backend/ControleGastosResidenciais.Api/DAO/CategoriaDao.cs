using ControleGastosResidenciais.Api.Data;
using ControleGastosResidenciais.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.DAO
{
    // Classe responsável pelo acesso e manipulação dos dados de categorias.
    public class CategoriaDao
    {
        private readonly AppDbContext _context;

        public CategoriaDao(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Categoria> CriarAsync(Categoria categoria)
        {
            _context.Categoria.Add(categoria);
            await _context.SaveChangesAsync();
            return categoria;
        }

        public async Task<List<Categoria>> ListarAsync()
        {
            return await _context.Categoria
                .Where(c => !c.excluido)
                .OrderBy(c => c.descricao)
                .ToListAsync();
        }

        public async Task<Categoria?> BuscarPorCodigoAsync(int codigo)
        {
            return await _context.Categoria
                .FirstOrDefaultAsync(c => c.codigo == codigo && !c.excluido);
        }

        // Calcula os totais de receitas, despesas e saldo por categoria,
        // além dos totais gerais do relatório.
        public async Task<object> ObterTotaisPorCategoriaAsync()
        {
            var categorias = await _context.Categoria
                .Where(c => !c.excluido)
                .OrderBy(c => c.descricao)
                .ToListAsync();

            var transacoes = await _context.Transacao
                .Where(t => !t.excluido)
                .ToListAsync();

            var lista = categorias.Select(categoria =>
            {
                var transacoesCategoria = transacoes
                    .Where(t => t.codCategoria == categoria.codigo)
                    .ToList();

                var totalReceitas = transacoesCategoria
                    .Where(t => t.tipo == 2)
                    .Sum(t => t.valor);

                var totalDespesas = transacoesCategoria
                    .Where(t => t.tipo == 1)
                    .Sum(t => t.valor);

                return new
                {
                    codigoCategoria = categoria.codigo,
                    descricaoCategoria = categoria.descricao,
                    totalReceitas,
                    totalDespesas,
                    saldo = totalReceitas - totalDespesas
                };
            }).ToList();

            var totaisGerais = new
            {
                totalReceitas = lista.Sum(x => x.totalReceitas),
                totalDespesas = lista.Sum(x => x.totalDespesas),
                saldoLiquido = lista.Sum(x => x.saldo)
            };

            return new
            {
                categorias = lista,
                totaisGerais
            };
        }
    }
}