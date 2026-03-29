using ControleGastosResidenciais.Api.DAO;
using ControleGastosResidenciais.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api
{
    // Configuração principal da API:
    // controllers, banco SQLite, Swagger, DAOs e política de CORS para o front-end.
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Serviços da API
            builder.Services.AddControllers();

            // Contexto do Entity Framework com SQLite
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<PessoaDao>();
            builder.Services.AddScoped<CategoriaDao>();
            builder.Services.AddScoped<TransacaoDao>();

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("FrontEnd", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Swagger no ambiente de desenvolvimento
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("FrontEnd");

            app.MapControllers();

            app.Run();
        }
    }
}