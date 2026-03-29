# Controle de Gastos Residenciais

Sistema de controle de gastos residenciais.

## Tecnologias
- Back-end: C# / .NET
- Front-end: React + TypeScript
- Persistência: SQLite

## Estrutura
- `backend/` -> API e persistência
- `frontend/` -> interface web

## Como executar

### Back-end
1. Acesse a pasta `backend`
2. Abra o arquivo da solução no Visual Studio
3. Execute a API

### Front-end
1. Acesse a pasta `frontend`
2. Execute `npm install`
3. Execute `npm run dev`

## Regras de negócio implementadas
- Cadastro, edição, exclusão e listagem de pessoas
- Exclusão lógica das transações vinculadas ao excluir uma pessoa
- Cadastro e listagem de categorias
- Cadastro e listagem de transações
- Menores de idade só podem possuir transações do tipo despesa
- Categorias compatíveis com o tipo da transação
- Consulta de totais por pessoa
- Consulta de totais por categoria
