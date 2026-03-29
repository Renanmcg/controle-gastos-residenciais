using ControleGastosResidenciais.Api.DAO;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Api.Controllers
{
    // Controller responsável pelos relatórios consolidados do sistema.
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly PessoaDao _pessoaDao;
        private readonly CategoriaDao _categoriaDao;

        public RelatoriosController(PessoaDao pessoaDao, CategoriaDao categoriaDao)
        {
            _pessoaDao = pessoaDao;
            _categoriaDao = categoriaDao;
        }

        // Retorna os totais de receitas, despesas e saldo agrupados por pessoa,
        // além dos totais gerais do relatório.
        [HttpGet("totais-por-pessoa")]
        public async Task<IActionResult> ObterTotaisPorPessoa()
        {
            var resultado = await _pessoaDao.ObterTotaisPorPessoaAsync();
            return Ok(resultado);
        }

        // Retorna os totais de receitas, despesas e saldo agrupados por categoria,
        // além dos totais gerais do relatório.
        [HttpGet("totais-por-categoria")]
        public async Task<IActionResult> ObterTotaisPorCategoria()
        {
            var resultado = await _categoriaDao.ObterTotaisPorCategoriaAsync();
            return Ok(resultado);
        }
    }
}