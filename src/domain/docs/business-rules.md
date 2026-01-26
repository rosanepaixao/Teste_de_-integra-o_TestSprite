# Regras de domínio — Time Tracker

Este documento resume as regras de negócio aplicadas às entidades do domínio.

## Duração e cálculo de tempo

- Durações são armazenadas em **segundos** (`durationSeconds`).
- Não é permitido persistir tarefas com duração **igual a zero**.
- Tarefas com timer somam apenas intervalos ativos (pausas não contam).

## Estados e modos válidos

- `Project.status` deve ser `active` ou `deleted`.
- `Task.mode` deve ser `manual` ou `timer`.
- `Task.status` deve ser `running`, `paused` ou `finished`.

## Associação projeto-tarefa

- `Task.projectId` é opcional; `null` representa "Sem projeto".
- Projetos removidos são **soft deleted** (`status = "deleted"`) e não podem ser
  escolhidos em novas tarefas, mas permanecem vinculados ao histórico.

## Datas de referência

- Tarefas manuais usam `loggedAt` como data de referência.
- Tarefas com timer usam `startAt` como data de referência.

## Integridade do timer

- Apenas **uma tarefa com timer ativo** pode existir por vez.
- Cada intervalo de timer deve ter `startedAt` antes de `stoppedAt`.
