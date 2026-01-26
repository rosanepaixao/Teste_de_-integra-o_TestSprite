# projeto.md — Time Tracker (Tarefas + Projetos + Relatórios)

## 1. Visão geral

Esta ferramenta tem como objetivo **registrar e calcular o tempo gasto em tarefas**, com suporte a:

- Criação de tarefas com nome, projeto opcional e tempo registrado via **timer** ou **entrada manual**
- Histórico completo de tarefas
- Filtros por intervalo de datas (e por projeto)
- Gestão de projetos (criar, renomear, remover)
- Relatórios de horas geral e por projeto, considerando um período selecionado

O sistema deve ser simples, rápido e confiável, permitindo rastrear trabalho diário e gerar totais claros por intervalo de datas.

---

## 2. Escopo

### 2.1 Dentro do escopo

- CRUD de Projetos (criar, renomear, remover)
- Criação e listagem de Tarefas
- Timer de tarefa (start / pause / resume / stop)
- Inserção manual de tempo total (horas e minutos)
- Associação opcional de tarefa a um projeto
- Filtros por intervalo de datas
- Relatórios de horas (geral e por projeto)

### 2.2 Fora do escopo (versão inicial)

- Autenticação / múltiplos usuários
- Integrações externas (Jira, Trello, etc.)
- Exportação de relatórios (CSV, PDF)
- Controle financeiro / billing
- Aprovação de horas
- Múltiplos fusos horários

---

## 3. Personas e casos de uso

### Persona principal

Profissional que precisa medir o tempo gasto em tarefas diárias, organizadas por projeto, para análise de produtividade e geração de relatórios.

### Casos de uso

1. Criar projeto “Cliente A”
2. Criar tarefa “Reunião de alinhamento”, associar ao projeto e iniciar timer
3. Pausar e retomar o timer
4. Finalizar a tarefa
5. Criar tarefa “Correção de bug” com tempo manual (ex.: 2h30)
6. Filtrar tarefas por período
7. Gerar relatório geral
8. Gerar relatório por projeto

---

## 4. Requisitos funcionais

### RF-01 — Listar tarefas

**Descrição:**  
O sistema deve exibir todas as tarefas registradas, ordenadas por data (mais recente primeiro).

**Dados exibidos:**

- Nome da tarefa
- Projeto (ou “Sem projeto”)
- Data
- Duração total (HH:MM)
- Status (Em andamento / Finalizada)

**Critérios de aceitação:**

- Todas as tarefas devem ser acessíveis no histórico
- A duração exibida deve refletir o cálculo real do tempo

---

### RF-02 — Filtrar tarefas por data

**Descrição:**  
Permitir filtrar tarefas por intervalo de datas.

**Critérios de aceitação:**

- Filtro com data inicial e final
- Intervalo inclusivo
- Opção para limpar filtros

---

### RF-03 — Filtrar tarefas por projeto

**Descrição:**  
Permitir filtrar tarefas por projeto específico ou “Sem projeto”.

**Critérios de aceitação:**

- Funciona em conjunto com filtro de data
- Projetos removidos seguem regra definida no RF-06

---

### RF-04 — Criar tarefa com tempo manual

**Campos obrigatórios:**

- Nome
- Duração (horas/minutos)

**Campos opcionais:**

- Projeto

**Critérios de aceitação:**

- Nome não pode ser vazio
- Duração deve ser maior que zero
- Tarefa criada já deve estar finalizada

---

### RF-05 — Criar tarefa com timer

**Fluxo:**

1. Informar nome e projeto (opcional)
2. Iniciar timer
3. Pausar / retomar
4. Finalizar tarefa

**Critérios de aceitação:**

- Timer contabiliza apenas períodos ativos
- Pausas não entram no cálculo
- Ao finalizar, a duração é persistida

---

### RF-06 — Gerenciar projetos

#### RF-06.1 Criar projeto

- Campo obrigatório: nome

**Validações:**

- Nome não vazio
- Não permitir duplicidade (case-insensitive)

---

#### RF-06.2 Renomear projeto

**Critérios de aceitação:**

- Novo nome reflete em todas as tarefas associadas

---

#### RF-06.3 Remover projeto

**Regra adotada (recomendada):**

- _Soft delete_: projeto é marcado como removido
- Tarefas antigas continuam associadas

**Critérios de aceitação:**

- Confirmação antes da remoção
- Projeto removido não aparece para seleção em novas tarefas

---

### RF-07 — Associar tarefa a projeto

**Descrição:**  
Durante a criação da tarefa, o usuário pode escolher um projeto existente.

**Critérios de aceitação:**

- Apenas projetos ativos aparecem para seleção
- Associação é opcional

---

### RF-08 — Relatórios de horas

#### RF-08.1 Relatório geral

- Total de horas no período
- Total de tarefas
- (Opcional) distribuição por dia

---

#### RF-08.2 Relatório por projeto

- Total de horas por projeto
- Total de tarefas por projeto
- Categoria “Sem projeto”
- Categoria “Projeto removido” (se aplicável)

**Critérios de aceitação:**

- Soma dos projetos deve bater com o total geral
- Período selecionado é respeitado

---

## 5. Regras de negócio

### RN-01 — Unidade de tempo

- Armazenar duração internamente em segundos
- Exibir no formato HH:MM
- Entrada manual aceita horas e minutos

---

### RN-02 — Duração mínima

- Não permitir tarefas com duração zero

---

### RN-03 — Timer único ativo

**Decisão:**  
Apenas **uma tarefa com timer ativo por vez**.

---

### RN-04 — Data de referência

- Tarefas manuais usam `logged_at`
- Tarefas com timer usam `start_at`

---

### RN-05 — Integridade projeto-tarefa

- Tarefa pode existir sem projeto
- Projeto removido não invalida histórico

---

## 6. Requisitos não funcionais

### RNF-01 — Persistência

- Dados persistidos localmente
- Sobrevivem a reinício da aplicação

---

### RNF-02 — Performance

- Suportar milhares de tarefas
- Uso de paginação ou virtualização se necessário

---

### RNF-03 — Confiabilidade do timer

- Cálculo baseado em timestamps reais
- Não depender apenas de contagem contínua

---

### RNF-04 — Usabilidade

- Criação rápida de tarefas
- Interface simples e direta

---

## 7. Modelo de dados (proposto)

### Projeto

- `id`
- `name`
- `status` (active | deleted)
- `created_at`
- `updated_at`

---

### Tarefa

- `id`
- `name`
- `project_id` (nullable)
- `mode` (manual | timer)
- `status` (running | paused | finished)
- `duration_seconds`
- `start_at`
- `end_at`
- `logged_at`
- `created_at`
- `updated_at`

---

### Intervalos de timer (opcional, recomendado)

- `task_id`
- `started_at`
- `stopped_at`

---

## 8. Telas mínimas

### Tela — Lista de tarefas

- Lista com filtros
- Botão “Nova tarefa”

---

### Tela — Nova tarefa

- Nome
- Projeto
- Escolha: tempo manual ou timer

---

### Tela — Projetos

- Criar
- Renomear
- Remover

---

### Tela — Relatórios

- Seleção de período
- Visualização geral ou por projeto

---

## 9. Cenários de teste

- Criar tarefa manual válida
- Impedir tarefa sem duração
- Timer com pausa e retomada
- Filtro por data
- Renomear projeto reflete nas tarefas
- Remoção de projeto mantém histórico
- Relatório geral bate com soma por projeto

---

## 10. Backlog futuro

- Exportação CSV/PDF
- Edição de tarefas
- Tags
- Metas semanais/mensais
- Sincronização em nuvem
- Multi-dispositivo

---

## 11. Decisões assumidas

- Um timer ativo por vez
- Soft delete de projetos
- Data de referência clara por tipo de tarefa
- Persistência local
