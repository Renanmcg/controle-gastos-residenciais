using System.ComponentModel.DataAnnotations;

namespace ControleGastosResidenciais.Api.Models
{
    public class Pessoa
    {
        [Key]
        public int codigo { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres.")]
        public string nome { get; set; } = string.Empty;

        [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150.")]
        public int idade { get; set; }

        public bool excluido { get; set; } = false;

        public DateTime dataCriacao { get; set; } = DateTime.Now;

        public DateTime? dataAlteracao { get; set; }

        public DateTime? dataExclusao { get; set; }

    }
}