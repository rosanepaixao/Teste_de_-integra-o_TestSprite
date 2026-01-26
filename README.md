# Time Tracker

Projeto de acompanhamento de tempo para tarefas e projetos, com foco em registro manual ou via timer, histórico e relatórios. Agora utiliza React + TypeScript com Vite e Zustand, mantendo camadas de domínio e dados.

## Como rodar o projeto

### Desenvolvimento

1. Instale as dependências:

```
npm install
```

2. Rode o Vite:

```
npm run dev
```

3. Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Estrutura principal

```
src/
  app/           # bootstrap do React
  features/      # páginas e componentes por feature
  application/   # casos de uso (orquestra domínio/dados)
  domain/        # regras de negócio e entidades
  data/          # repositórios e storage
  shared/        # utils, styles e componentes reutilizáveis
  legacy/        # HTML/CSS original para referência
```

## Observações

- Os projetos são armazenados localmente no `localStorage` do navegador, portanto os dados ficam salvos no mesmo navegador/dispositivo.
- Não há backend.
