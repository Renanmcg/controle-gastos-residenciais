using ControleGastosResidenciais.Api.DAO;
using ControleGastosResidenciais.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Api.Controllers
{
    // Controller responsável pelo cadastro e consulta de categorias.
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly CategoriaDao _categoriaDao;

        public CategoriasController(CategoriaDao categoriaDao)
        {
            _categoriaDao = categoriaDao;
        }

        // Cria uma nova categoria após validar os dados enviados.
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] Categoria categoria)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var categoriaCriada = await _categoriaDao.CriarAsync(categoria);
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codigo = categoriaCriada.codigo }, categoriaCriada);
        }
        
        // Lista todas as categorias ativas cadastradas no sistema.
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var categorias = await _categoriaDao.ListarAsync();
            return Ok(categorias);
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> BuscarPorCodigo(int codigo)
        {
            var categoria = await _categoriaDao.BuscarPorCodigoAsync(codigo);

            if (categoria == null)
                return NotFound("Categoria não encontrada.");

            return Ok(categoria);
        }
    }
}