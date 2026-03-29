import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PessoasPage from "./pages/PessoasPage";
import CategoriasPage from "./pages/CategoriasPage";
import TransacoesPage from "./pages/TransacoesPage";
import TotaisPorPessoaPage from "./pages/TotaisPorPessoaPage";
import TotaisPorCategoriaPage from "./pages/TotaisPorCategoriaPage";

// Componente principal da aplicação.
// Responsável pela navegação entre as páginas usando React Router.
function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <Link to="/">Início</Link>
          <Link to="/pessoas">Pessoas</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/transacoes">Transações</Link>
          <Link to="/totais-por-pessoa">Totais por Pessoa</Link>
          <Link to="/totais-por-categoria">Totais por Categoria</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pessoas" element={<PessoasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/transacoes" element={<TransacoesPage />} />
          <Route path="/totais-por-pessoa" element={<TotaisPorPessoaPage />} />
          <Route
            path="/totais-por-categoria"
            element={<TotaisPorCategoriaPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;