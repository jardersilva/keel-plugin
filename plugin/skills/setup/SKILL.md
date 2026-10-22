---
name: setup
description: Configura o Keel neste repositório - detecta stack e comandos, faz no máximo 5 perguntas e salva o perfil do projeto fora do repositório.
argument-hint: '[observações sobre o projeto]'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *), Read, Grep, Glob
---

# /keel:setup — perfil do projeto

Objetivo: gerar o **perfil do projeto** que o Keel injeta no início de cada sessão (resumo curto,
stack, comandos, convenções e seções detalhadas). O perfil fica em `~/.keel/cache`, **nunca** no
repositório. Não crie nem altere arquivos do repo neste comando.

CLI do Keel: `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs"` (abaixo, `keel`).

Observações do usuário: $ARGUMENTS

## Passos

1. Rode `keel perfil detectar`. Ele devolve stack, gerenciador de pacotes, comandos detectados,
   arquivos usados como evidência e se já existe perfil. Se já existir, rode `keel perfil mostrar` e
   pergunte se o usuário quer atualizar.
2. Complete o entendimento lendo **pouco**: README, o manifesto do projeto e a estrutura de pastas de
   primeiro nível (`keel map --profundidade 1`). Não leia o código inteiro.
3. Faça **no máximo 5 perguntas**, só sobre o que não deu para inferir e muda o trabalho do agente.
   Bons exemplos: comando de teste correto, **modo de entrega** (o time trabalha com branch + PR, ou
   direto na branch principal?), convenção de branch (`feat/<slug>`?), commits convencionais ou livres,
   estratégia de merge (squash/merge/rebase), áreas sensíveis (pagamentos, migrations).
   Agrupe as perguntas numa só mensagem.
4. Monte o perfil e salve com heredoc (não crie arquivo temporário):

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" perfil salvar <<'KEEL_JSON'
   {
     "resumo": "2 a 5 frases: o que é o sistema, arquitetura, onde fica o quê.",
     "stack": ["TypeScript", "Node.js", "Postgres"],
     "gerenciador_pacotes": "pnpm",
     "comandos": { "build": "pnpm build", "test": "pnpm test", "lint": "pnpm lint", "typecheck": "pnpm typecheck" },
     "convencoes": { "entrega": "pr", "branch": "feat/<slug>", "commits": "convencional", "merge": "squash" },
     "secoes": {
       "arquitetura": "camadas, módulos principais e fluxo de uma requisição",
       "testes": "onde ficam, como rodar um teste só, fixtures",
       "banco": "ORM, migrations, convenções"
     }
   }
   KEEL_JSON
   ```

   - `resumo`: até 1.500 caracteres. É injetado em toda sessão, então seja denso.
   - `secoes`: detalhes sob demanda (até 20.000 caracteres cada). Só o que for útil e verificado no código.
   - Omita comandos que o projeto não tem. Sem `test`, o `keel test` passa a rodar a verificação
     disponível (typecheck, lint e build); avise o usuário que o portão de testes do fluxo usará isso.
   - `convencoes.entrega`: `"pr"` (branch + pull request, padrão) ou `"direto"` (o time commita na
     branch principal, sem PR; os fluxos pulam a etapa BRANCH e terminam em COMMIT). Com `direto`,
     `branch` e `merge` não se aplicam: deixe os padrões.

5. Se a CLI recusar o JSON, corrija os campos apontados e tente de novo.
6. Rode `keel test` uma vez para confirmar que o comando de teste (ou a verificação) funciona, e
   mostre ao usuário um resumo do perfil salvo (stack, comandos, convenções, entrega, seções).
7. Rode `keel grafo --abrir` para fechar o setup mostrando o grafo do projeto (local, em `~/.keel/grafos/`;
   com o compartilhamento da org ligado, ele também vai para o painel). Some ao resumo, em até 3 linhas, os
   módulos mais usados e as áreas quentes que a CLI listou, e o caminho do arquivo. Não leia o HTML.

Se o repositório não tiver remote, avise: o perfil vale só nesta máquina.

Se o usuário quiser configurar vários repos de um `.code-workspace` de uma vez, indique o `/keel:setup-workspace`.
