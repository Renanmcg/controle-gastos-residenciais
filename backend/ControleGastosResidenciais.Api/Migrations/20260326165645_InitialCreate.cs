using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleGastosResidenciais.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categoria",
                columns: table => new
                {
                    codigo = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    descricao = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    finalidade = table.Column<int>(type: "INTEGER", nullable: false),
                    excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    dataCriacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    dataAlteracao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    dataExclusao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categoria", x => x.codigo);
                });

            migrationBuilder.CreateTable(
                name: "Pessoa",
                columns: table => new
                {
                    codigo = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nome = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    idade = table.Column<int>(type: "INTEGER", nullable: false),
                    excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    dataCriacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    dataAlteracao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    dataExclusao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pessoa", x => x.codigo);
                });

            migrationBuilder.CreateTable(
                name: "Transacao",
                columns: table => new
                {
                    codigo = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    descricao = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    valor = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    tipo = table.Column<int>(type: "INTEGER", nullable: false),
                    codPessoa = table.Column<int>(type: "INTEGER", nullable: false),
                    codCategoria = table.Column<int>(type: "INTEGER", nullable: false),
                    excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    dataCriacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    dataAlteracao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    dataExclusao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacao", x => x.codigo);
                    table.ForeignKey(
                        name: "FK_Transacao_Categoria_codCategoria",
                        column: x => x.codCategoria,
                        principalTable: "Categoria",
                        principalColumn: "codigo",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transacao_Pessoa_codPessoa",
                        column: x => x.codPessoa,
                        principalTable: "Pessoa",
                        principalColumn: "codigo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transacao_codCategoria",
                table: "Transacao",
                column: "codCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_Transacao_codPessoa",
                table: "Transacao",
                column: "codPessoa");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transacao");

            migrationBuilder.DropTable(
                name: "Categoria");

            migrationBuilder.DropTable(
                name: "Pessoa");
        }
    }
}
