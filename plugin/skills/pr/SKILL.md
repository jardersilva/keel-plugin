---
name: pr
description: Gera título, descrição, checklist e changelog do PR a partir do diff e abre o PR com o gh, após confirmação do usuário.
argument-hint: '[base] [--draft]'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *)
---

# /keel:pr — abrir o PR

Argumentos: $ARGUMENTS

1. Se o perfil do projeto diz **entrega direta** (o time não usa PR), avise o usuário e pergunte se
   quer mesmo abrir um PR antes de continuar.
2. Confira o estado: branch atual (não abra PR de `main`/`master`), mudanças não commitadas e se o
   `gh` está autenticado (`gh auth status`). Sem `gh`: entregue o texto do PR ao usuário e pare.
3. Se houver mudanças não commitadas, proponha os commits pela convenção do perfil
   (skill keel:convencoes-git) e peça confirmação.
4. Use o agente **keel:redator-pr** com o diff em relação à base (`git diff <base>...HEAD`), o
   `git log --oneline <base>..HEAD`, a issue vinculada (se houver) e o resultado do último `keel test`.
5. Mostre título e descrição ao usuário e peça confirmação antes de `git push -u origin <branch>` e de
   `gh pr create --title ... --body-file -` (corpo via stdin; `--draft` se pedido).
6. Com fluxo ativo, registre o PR:
   `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" fluxo pr <url> --sessao ${CLAUDE_SESSION_ID}`.
7. Devolva o link do PR.
