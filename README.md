# Controle de Gastos Residenciais

Sistema de controle de gastos residenciais.

## Tecnologias
- Back-end: C# / .NET
- Front-end: React + TypeScript
- Persistência: SQLite

## Estrutura
- `backend/` -> API e persistência
- `frontend/` -> interface web

## Regras de negócio implementadas
- Cadastro, edição, exclusão e listagem de pessoas
- Exclusão lógica das transações vinculadas ao excluir uma pessoa
- Cadastro e listagem de categorias
- Cadastro e listagem de transações
- Menores de idade só podem possuir transações do tipo despesa
- Categorias compatíveis com o tipo da transação
- Consulta de totais por pessoa
- Consulta de totais por categoria
