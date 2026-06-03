# Feature Specification: Core Inventory Management System

**Feature Branch**: `001-bakery-inventory-management`  
**Created**: 2026-06-03  
**Status**: Draft  
**Input**: Comprehensive bakery stock management requirements.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprehensive Stock Control (Priority: P1)

Como gerente da padaria, eu quero cadastrar e gerenciar meus produtos e ingredientes para ter controle total sobre o que está disponível na produção e para venda.

**Why this priority**: Fundamental para a operação básica do sistema. Sem dados de produtos, não há gestão.

**Independent Test**: Pode ser testado criando um novo ingrediente (ex: Farinha), verificando se ele aparece na listagem de estoque e se pode ser editado.

**Acceptance Scenarios**:

1. **Given** que estou na tela de cadastro de item, **When** eu preencho Nome, Categoria, Quantidade Inicial, Estoque Mínimo, Preço Unitário e Data de Validade e clico em salvar, **Then** o item deve ser persistido com sucesso.
2. **Given** que um item já existe, **When** eu tento excluir um produto que ainda possui saldo em estoque, **Then** o sistema deve pedir confirmação adicional ou alertar sobre a perda de rastro de valor.

---

### User Story 2 - Registro de Movimentações (Priority: P1)

Como atendente ou padeiro, eu quero registrar entradas (compras/produção) e saídas (vendas/descartes) para que o saldo do estoque seja atualizado em tempo real.

**Why this priority**: Mantém a acurácia dos dados. Sem isso, o estoque torna-se obsoleto rapidamente.

**Independent Test**: Registrar uma saída de 5 pães e verificar se a "Quantidade Atual" no estoque diminuiu exatamente em 5 unidades.

**Acceptance Scenarios**:

1. **Given** um item com estoque 10, **When** registro uma saída de 11 unidades, **Then** o sistema deve bloquear a operação ou exibir um alerta crítico de "Estoque Insuficiente".
2. **Given** o registro de uma movimentação, **When** salvo a operação, **Then** o sistema deve gravar automaticamente o usuário logado e o timestamp da ação.

---

### User Story 3 - Prevenção de Perdas e Alertas (Priority: P2)

Como gerente da padaria, eu quero ser alertado visualmente sobre itens vencendo ou com estoque baixo para evitar desperdício financeiro e interrupção da produção.

**Why this priority**: Diferencial de negócio focado em rentabilidade e eficiência.

**Independent Test**: Inserir um lote de leite que vence em 5 dias e verificar se ele aparece destacado com o alerta de validade.

**Acceptance Scenarios**:

1. **Given** um produto com validade em 6 dias, **When** acesso a lista de estoque ou dashboard, **Then** o item deve estar destacado visualmente como "Vencimento Próximo".
2. **Given** um produto sem saídas há 16 dias, **When** visualizo os alertas, **Then** ele deve ser listado como "Item Encalhado".

---

### User Story 4 - Visão Executiva e Métricas (Priority: P3)

Como dono da padaria, eu quero visualizar um dashboard com métricas financeiras e de volume para entender a saúde do meu negócio e identificar onde estou perdendo dinheiro.

**Why this priority**: Suporte à decisão estratégica.

**Independent Test**: Comparar o "Valor Total do Estoque" no dashboard com a soma de (Quantidade * Preço Unitário) de todos os itens na tabela.

**Acceptance Scenarios**:

1. **Given** a tela de Dashboard, **When** visualizo os cards de resumo, **Then** devo ver o somatório em Reais (R$) de todos os produtos que vencem na próxima semana (Valor em Risco).
2. **Given** o histórico de descartes do mês, **When** olho o custo de desperdício, **Then** o sistema deve somar o valor de custo de todos os itens marcados como "Saída: Descarte".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir CRUD completo (Criar, Ler, Atualizar, Excluir) de Produtos e Ingredientes.
- **FR-002**: Cada item MUST possuir obrigatoriamente: Nome, Categoria (Ingrediente, Pães, Bolos, Doces, Bebidas, etc), Quantidade Atual, Estoque Mínimo, Preço Unitário e Data de Validade.
- **FR-003**: A visualização de Estoque MUST ser em formato de TABELA (Data Table) com colunas para todos os campos do FR-002.
- **FR-004**: A tabela de estoque MUST suportar busca por nome e ordenação por qualquer coluna.
- **FR-005**: O sistema MUST impedir saídas de estoque que resultem em saldo negativo, a menos que uma permissão de "Gerente" seja concedida no momento.
- **FR-006**: O sistema MUST registrar cada movimentação com: Timestamp, Item, Tipo (Entrada/Saída), Motivo (Venda, Compra, Produção, Descarte), Quantidade, Usuário e Observação.
- **FR-007**: Alerta de Vencimento: O sistema MUST destacar itens com validade <= 7 dias.
- **FR-008**: Alerta de Estoque Baixo: O sistema MUST destacar itens com Quantidade Atual <= Estoque Mínimo.
- **FR-009**: Alerta de Itens Encalhados: O sistema MUST identificar itens sem movimentação de saída nos últimos 15 dias.
- **FR-010**: O Dashboard MUST exibir cards com: Total de Produtos, Qtd Estoque Baixo, Qtd Próximos ao Vencimento e Valor Total do Estoque.
- **FR-011**: O Dashboard MUST exibir um gráfico de distribuição de itens por categoria.
- **FR-012**: O Dashboard MUST exibir métricas de performance: "Produto Mais Vendido" (maior volume de saída-venda) e "Produto que Mais Vence" (maior volume de saída-descarte).
- **FR-013**: O Dashboard MUST exibir o "Valor Financeiro em Risco" (Soma de R$ de itens vencendo em 7 dias).
- **FR-014**: O Dashboard MUST exibir o "Custo Total de Desperdício" acumulado no mês atual.
- **FR-015**: O Dashboard MUST exibir um feed rápido das últimas 5 movimentações.

### Key Entities *(include if feature involves data)*

- **Item (Produto/Ingrediente)**: Representa o estoque físico. Atributos: ID, Nome, Categoria, Qty, MinQty, Preço, Validade.
- **Movimentação**: Registro histórico de alteração de saldo. Atributos: ID, ItemID, Tipo, Motivo, Qty, UserID, Timestamp, Nota.
- **Usuário**: Pessoa responsável pela ação (Sistema de autenticação simples).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O gerente consegue identificar todos os produtos que precisam de reposição em menos de 10 segundos através do dashboard.
- **SC-002**: O sistema deve alertar 100% dos itens que estão a 7 dias do vencimento.
- **SC-003**: O erro humano de estoque negativo deve ser reduzido a zero através do bloqueio de sistema.
- **SC-004**: O tempo para registrar uma nova entrada de mercadoria não deve ultrapassar 45 segundos.

## Assumptions

- O sistema assume que todos os itens têm uma data de validade (mesmo que seja longa).
- Assume-se que o "Preço Unitário" cadastrado no item é o preço de custo para cálculos de desperdício e o preço de venda para valor de estoque (ou vice-versa, dependendo da configuração que será definida no design).
- O controle de acesso básico (Usuário) é necessário para o log de movimentações.
- A moeda padrão do sistema é o Real (BRL).
