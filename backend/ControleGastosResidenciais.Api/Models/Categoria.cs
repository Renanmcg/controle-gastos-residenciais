using System.ComponentModel.DataAnnotations;

namespace ControleGastosResidenciais.Api.Models
{
    public class Categoria
    {
        [Key]
        public int codigo { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres.")]
        public string descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "A finalidade é obrigatória.")]
        [Range(1, 3, ErrorMessage = "A finalidade informada é inválida.")]
        public int finalidade { get; set; }
        // 1 = Despesa
        // 2 = Receita
        // 3 = Ambas

        public bool excluido { get; set; } = false;

        public DateTime dataCriacao { get; set; } = DateTime.Now;

        public DateTime? dataAlteracao { get; set; }

        public DateTime? dataExclusao { get; set; }
    }
}