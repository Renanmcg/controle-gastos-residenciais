import { Link } from "react-router-dom";

// Página inicial da aplicação.
// Exibe atalhos rápidos para os principais módulos do sistema.
export default function HomePage() {
  // Estilo base reutilizado nos cards clicáveis da página inicial.
  const cardStyle: React.CSSProperties = {
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "18px",
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1 style={{ marginBottom: "16px" }}>
        Sistema de Controle de Gastos Residenciais
      </h1>

      <p style={{ marginBottom: "40px", fontSize: "18px" }}>
        Gerencie pessoas, categorias, transações e relatórios em um só lugar.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <Link to="/pessoas" style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Pessoas</h3>
          <p style={{ marginBottom: 0 }}>
            Cadastre, edite e exclua pessoas do sistema.
          </p>
        </Link>

        <Link to="/categorias" style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Categorias</h3>
          <p style={{ marginBottom: 0 }}>
            Organize receitas, despesas e categorias mistas.
          </p>
        </Link>

        <Link to="/transacoes" style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Transações</h3>
          <p style={{ marginBottom: 0 }}>
            Registre movimentações e valide regras de negócio.
          </p>
        </Link>

        <Link to="/totais-por-pessoa" style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Relatórios</h3>
          <p style={{ marginBottom: 0 }}>
            Consulte totais por pessoa e por categoria.
          </p>
        </Link>
      </div>
    </div>
  );
}
