using ControleGastosResidenciais.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Pessoa> Pessoa { get; set; }
        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Transacao> Transacao { get; set; }

        // Configura os relacionamentos da entidade Transacao e a precisão do valor monetário.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Impede exclusão física em cascata, pois o sistema trabalha com exclusão lógica.
            modelBuilder.Entity<Transacao>()
                .HasOne<Pessoa>()
                .WithMany()
                .HasForeignKey(t => t.codPessoa)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transacao>()
                .HasOne<Categoria>()
                .WithMany()
                .HasForeignKey(t => t.codCategoria)
                .OnDelete(DeleteBehavior.Restrict);

            // Define precisão do valor monetário armazenado no banco.
            modelBuilder.Entity<Transacao>()
                .Property(t => t.valor)
                .HasPrecision(18, 2);
        }
    }
}