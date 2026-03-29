using ControleGastosResidenciais.Api.DAO;
using ControleGastosResidenciais.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Api.Controllers
{
    // Controller responsável pelo cadastro e consulta de transações.
    // Também aplica as principais regras de negócio do sistema.
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoDao _transacaoDao;
        private readonly PessoaDao _pessoaDao;
        private readonly CategoriaDao _categoriaDao;

        public TransacoesController(
            TransacaoDao transacaoDao,
            PessoaDao pessoaDao,
            CategoriaDao categoriaDao)
        {
            _transacaoDao = transacaoDao;
            _pessoaDao = pessoaDao;
            _categoriaDao = categoriaDao;
        }

        // Cria uma nova transação após validar as regras de negócio:
        // tipo válido, pessoa existente, categoria existente,
        // restrição para menores de idade e compatibilidade da categoria.
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] Transacao transacao)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validação do tipo da transação:
            // 1 = Despesa
            // 2 = Receita
            if (transacao.tipo != 1 && transacao.tipo != 2)
                return BadRequest("O tipo da transação informado é inválido.");

            var pessoa = await _pessoaDao.BuscarPorCodigoAsync(transacao.codPessoa);

            if (pessoa == null)
                return NotFound("A pessoa informada não foi encontrada.");

            var categoria = await _categoriaDao.BuscarPorCodigoAsync(transacao.codCategoria);

            if (categoria == null)
                return NotFound("A categoria informada não foi encontrada.");

            // Regra de negócio:
            // Se a pessoa for menor de idade, só pode ter transações do tipo despesa.
            if (pessoa.idade < 18 && transacao.tipo != 1)
                return BadRequest("Menores de idade só podem possuir transações do tipo despesa.");

            // Regra de negócio:
            // finalidade da categoria:
            // 1 = Despesa
            // 2 = Receita
            // 3 = Ambas
            //
            // tipo da transação:
            // 1 = Despesa
            // 2 = Receita
            //
            // Se a finalidade for 3 (Ambas), aceita tanto 1 quanto 2.
            // Caso contrário, a finalidade deve ser igual ao tipo.
            if (categoria.finalidade != 3 && categoria.finalidade != transacao.tipo)
                return BadRequest("A categoria informada não é compatível com o tipo da transação.");

            var transacaoCriada = await _transacaoDao.CriarAsync(transacao);

            return CreatedAtAction(
                nameof(BuscarPorCodigo),
                new { codigo = transacaoCriada.codigo },
                transacaoCriada
            );
        }


        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var transacoes = await _transacaoDao.ListarAsync();
            return Ok(transacoes);
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> BuscarPorCodigo(int codigo)
        {
            var transacao = await _transacaoDao.BuscarPorCodigoAsync(codigo);

            if (transacao == null)
                return NotFound("Transação não encontrada.");

            return Ok(transacao);
        }
    }
}