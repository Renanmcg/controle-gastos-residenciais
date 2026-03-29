using ControleGastosResidenciais.Api.Data;
using ControleGastosResidenciais.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.DAO
{
    // Classe responsável pelo acesso e manipulação dos dados de transações.
    public class TransacaoDao
    {
        private readonly AppDbContext _context;

        public TransacaoDao(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Transacao> CriarAsync(Transacao transacao)
        {
            _context.Transacao.Add(transacao);
            await _context.SaveChangesAsync();
            return transacao;
        }

        // Lista apenas transações ativas, ordenadas das mais recentes para as mais antigas.
        public async Task<List<Transacao>> ListarAsync()
        {
            return await _context.Transacao
                .Where(t => !t.excluido)
                .OrderByDescending(t => t.dataCriacao)
                .ToListAsync();
        }

        public async Task<Transacao?> BuscarPorCodigoAsync(int codigo)
        {
            return await _context.Transacao
                .FirstOrDefaultAsync(t => t.codigo == codigo && !t.excluido);
        }

        public async Task<List<Transacao>> ListarPorPessoaAsync(int codPessoa)
        {
            return await _context.Transacao
                .Where(t => t.codPessoa == codPessoa && !t.excluido)
                .OrderByDescending(t => t.dataCriacao)
                .ToListAsync();
        }

        public async Task<List<Transacao>> ListarPorCategoriaAsync(int codCategoria)
        {
            return await _context.Transacao
                .Where(t => t.codCategoria == codCategoria && !t.excluido)
                .OrderByDescending(t => t.dataCriacao)
                .ToListAsync();
        }

        // Esse método é usado ao excluir uma pessoa do sistema.
        // Realiza exclusão lógica das transações vinculadas a uma pessoa.
        public async Task ExcluirPorPessoaAsync(int codPessoa)
        {
            var transacoes = await _context.Transacao
                .Where(t => t.codPessoa == codPessoa && !t.excluido)
                .ToListAsync();

            foreach (var transacao in transacoes)
            {
                transacao.excluido = true;
                transacao.dataExclusao = DateTime.Now;
            }

            await _context.SaveChangesAsync();
        }
    }
}