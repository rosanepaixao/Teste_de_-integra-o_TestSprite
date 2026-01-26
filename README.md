# Time Tracker

Projeto de acompanhamento de tempo para tarefas e projetos, com foco em registro manual ou via timer, histórico e relatórios. A implementação atual inclui uma página de formulário de tarefa em HTML/CSS com lógica em JavaScript puro.

## Como rodar o projeto

Como o projeto é estático (HTML/CSS/JS), você pode abrir o arquivo diretamente no navegador ou servir com um servidor local simples.

### Opção 1: abrir direto no navegador

1. Navegue até o arquivo:

```
src/ui/pages/task-form.html
```

2. Abra-o no navegador de sua preferência.

### Opção 2: servir com um servidor local

A partir da raiz do projeto, execute um servidor local. Exemplo com Python:

```
python3 -m http.server 8000
```

Em seguida, acesse no navegador:

```
http://localhost:8000/src/ui/pages/task-form.html
```

## Estrutura principal

```
src/
  ui/
    pages/       # páginas HTML
    styles/      # folhas de estilo
  domain/        # regras de negócio e entidades
  data/          # repositórios e storage
```

## Observações

- Os projetos são armazenados localmente no `localStorage` do navegador, portanto os dados ficam salvos no mesmo navegador/dispositivo.
- Não há backend ou dependências de build no momento.
