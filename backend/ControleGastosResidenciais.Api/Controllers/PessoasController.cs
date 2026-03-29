using ControleGastosResidenciais.Api.DAO;
using ControleGastosResidenciais.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Api.Controllers
{
    // Controller responsável pelo gerenciamento de pessoas:
    // cadastro, edição, exclusão e listagem.
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly PessoaDao _pessoaDao;
        private readonly TransacaoDao _transacaoDao;

        public PessoasController(PessoaDao pessoaDao, TransacaoDao transacaoDao)
        {
            _pessoaDao = pessoaDao;
            _transacaoDao = transacaoDao;
        }

        // Cria uma nova pessoa após validar os dados enviados pela requisição.
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] Pessoa pessoa)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var pessoaCriada = await _pessoaDao.CriarAsync(pessoa);
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codigo = pessoaCriada.codigo }, pessoaCriada);
        }



        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var pessoas = await _pessoaDao.ListarAsync();
            return Ok(pessoas);
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> BuscarPorCodigo(int codigo)
        {
            var pessoa = await _pessoaDao.BuscarPorCodigoAsync(codigo);

            if (pessoa == null)
                return NotFound("Pessoa não encontrada.");

            return Ok(pessoa);
        }

        // Atualiza os dados de uma pessoa existente.
        // O código da rota deve coincidir com o código enviado no corpo da requisição.
        [HttpPut("{codigo}")]
        public async Task<IActionResult> Editar(int codigo, [FromBody] Pessoa pessoa)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (codigo != pessoa.codigo)
                return BadRequest("O código informado na rota é diferente do código do objeto.");

            var pessoaEditada = await _pessoaDao.EditarAsync(pessoa);

            if (pessoaEditada == null)
                return NotFound("Pessoa não encontrada.");

            return Ok(pessoaEditada);
        }

        // Exclui logicamente a pessoa e também remove logicamente
        // todas as transações vinculadas a ela.
        [HttpDelete("{codigo}")]
        public async Task<IActionResult> Excluir(int codigo)
        {
            var pessoa = await _pessoaDao.BuscarPorCodigoAsync(codigo);

            if (pessoa == null)
                return NotFound("Pessoa não encontrada.");

            // Regra do sistema:
            // ao excluir uma pessoa, todas as transações dela também devem ser excluídas.
            var excluiuPessoa = await _pessoaDao.ExcluirAsync(codigo);

            if (!excluiuPessoa)
                return BadRequest("Não foi possível excluir a pessoa.");

            await _transacaoDao.ExcluirPorPessoaAsync(codigo);

            return Ok("Pessoa e transações vinculadas excluídas com sucesso.");
        }
    }
}