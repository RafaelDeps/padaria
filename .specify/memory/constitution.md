<!--
SYNC IMPACT REPORT
Version change: N/A → 1.0.0
List of modified principles: Initial draft creation
Added sections: Core Principles (I-V), Stack Tecnológica e Restrições, Regras de Negócio e Alertas Críticos, Governance
Templates requiring updates:
- .specify/templates/plan-template.md (✅ aligned)
- .specify/templates/spec-template.md (✅ aligned)
- .specify/templates/tasks-template.md (✅ aligned)
Follow-up TODOs: None
-->
# Sistema de Gestão de Estoque para Padaria Constitution

## Core Principles

### I. Arquitetura MVC Rigorosa
O sistema deve seguir estritamente o padrão Model-View-Controller (MVC). O Backend em Python atua como o Controller central, gerenciando a lógica de negócio e a comunicação com o Banco de Dados (Model - PostgreSQL), enquanto o React provê a interface (View). A separação de responsabilidades deve ser total para garantir manutenibilidade.

### II. Componentização e Código React Limpo
O Frontend deve ser construído com componentes React pequenos, modulares e reutilizáveis. O código deve seguir princípios de Clean Code, evitando componentes gigantes e lógica de negócio complexa dentro da View sempre que possível.

### III. UX Focada em Eficiência e Alertas Visuais
A interface deve ser intuitiva e organizada nos 4 módulos principais: Home, Dashboard, Estoque e Histórico de Movimentações. Alertas críticos devem ser destacados visualmente para ação imediata do usuário, priorizando a prevenção de perdas por validade e falta de insumos.

### IV. Visualização de Estoque em Formato de Tabela
A listagem de itens no módulo "Estoque" DEVE obrigatoriamente ser renderizada em formato de Tabela (Data Table). O uso de cartões (cards) para a listagem principal de estoque é expressamente proibido para garantir a densidade de informação necessária para a gestão.

### V. Performance e Otimização de Consultas
À medida que o histórico de movimentações cresce, as consultas ao PostgreSQL devem ser continuamente monitoradas e otimizadas. Índices e queries eficientes são obrigatórios para evitar lentidão no Dashboard e nos relatórios históricos.

## Stack Tecnológica e Restrições

O projeto baseia-se na seguinte stack:
- **Frontend**: React (JavaScript) com foco em componentização funcional.
- **Backend**: Python, servindo como API e controlador de regras de negócio.
- **Banco de Dados**: PostgreSQL, utilizando tipos de dados apropriados para controle de estoque e datas.
- **Arquitetura**: MVC puro com desacoplamento entre UI e Persistência.

## Regras de Negócio e Alertas Críticos

### Alerta de Validade
O sistema deve emitir avisos visuais claros sempre que o lote de um item estiver a 7 dias (1 semana) ou menos da data de vencimento.

### Alerta de Estoque Baixo
Sinalização visual imediata deve ocorrer quando a quantidade atual de um item atingir ou ficar abaixo do valor definido como "estoque mínimo" no cadastro do produto.

## Governance

- Esta Constituição guia todas as decisões arquiteturais e de design do projeto.
- Mudanças nos princípios fundamentais (especialmente a restrição de visualização em tabela e a stack técnica) exigem uma emenda constitucional formal com incremento de versão MAJOR.
- Toda nova funcionalidade deve ser validada contra estes princípios durante a fase de Planejamento e Code Review.

**Version**: 1.0.0 | **Ratified**: 2026-06-03 | **Last Amended**: 2026-06-03
