using ControleGastosResidenciais.Api.Data;
using ControleGastosResidenciais.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.DAO
{
    // Define precisão do valor monetário armazenado no banco.
    public class PessoaDao
    {
        private readonly AppDbContext _context;

        public PessoaDao(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Pessoa> CriarAsync(Pessoa pessoa)
        {
            _context.Pessoa.Add(pessoa);
            await _context.SaveChangesAsync();
            return pessoa;
        }

        public async Task<List<Pessoa>> ListarAsync()
        {
            return await _context.Pessoa
                .Where(p => !p.excluido)
                .OrderBy(p => p.nome)
                .ToListAsync();
        }

        public async Task<Pessoa?> BuscarPorCodigoAsync(int codigo)
        {
            return await _context.Pessoa
                .FirstOrDefaultAsync(p => p.codigo == codigo && !p.excluido);
        }

        public async Task<Pessoa?> EditarAsync(Pessoa pessoaAtualizada)
        {
            var pessoa = await _context.Pessoa
                .FirstOrDefaultAsync(p => p.codigo == pessoaAtualizada.codigo && !p.excluido);

            if (pessoa == null)
                return null;

            pessoa.nome = pessoaAtualizada.nome;
            pessoa.idade = pessoaAtualizada.idade;
            pessoa.dataAlteracao = DateTime.Now;

            await _context.SaveChangesAsync();
            return pessoa;
        }

        // Realiza exclusão lógica da pessoa, marcando o registro como excluído.
        public async Task<bool> ExcluirAsync(int codigo)
        {
            var pessoa = await _context.Pessoa
                .FirstOrDefaultAsync(p => p.codigo == codigo && !p.excluido);

            if (pessoa == null)
                return false;

            pessoa.excluido = true;
            pessoa.dataExclusao = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // Calcula os totais de receitas, despesas e saldo por pessoa,
        // além dos totais gerais do relatório.
        public async Task<object> ObterTotaisPorPessoaAsync()
        {
            var pessoas = await _context.Pessoa
                .Where(p => !p.excluido)
                .OrderBy(p => p.nome)
                .ToListAsync();

            var transacoes = await _context.Transacao
                .Where(t => !t.excluido)
                .ToListAsync();

            var lista = pessoas.Select(pessoa =>
            {
                var transacoesPessoa = transacoes
                    .Where(t => t.codPessoa == pessoa.codigo)
                    .ToList();

                var totalReceitas = transacoesPessoa
                    .Where(t => t.tipo == 2)
                    .Sum(t => t.valor);

                var totalDespesas = transacoesPessoa
                    .Where(t => t.tipo == 1)
                    .Sum(t => t.valor);

                return new
                {
                    codigoPessoa = pessoa.codigo,
                    nomePessoa = pessoa.nome,
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
                pessoas = lista,
                totaisGerais
            };
        }
    }
}