using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastosResidenciais.Api.Models
{
    public class Transacao
    {
        [Key]
        public int codigo { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres.")]
        public string descricao { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal valor { get; set; }

        [Required(ErrorMessage = "O tipo é obrigatório.")]
        [Range(1, 2, ErrorMessage = "O tipo informado é inválido.")]
        public int tipo { get; set; }
        // 1 = Despesa
        // 2 = Receita

        [Required(ErrorMessage = "A pessoa é obrigatória.")]
        public int codPessoa { get; set; }

        [Required(ErrorMessage = "A categoria é obrigatória.")]
        public int codCategoria { get; set; }

        public bool excluido { get; set; } = false;

        public DateTime dataCriacao { get; set; } = DateTime.Now;

        public DateTime? dataAlteracao { get; set; }

        public DateTime? dataExclusao { get; set; }
    }
}