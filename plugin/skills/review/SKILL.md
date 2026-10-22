---
name: review
description: Roda os revisores do Keel (segurança, qualidade e padrões) sobre o diff atual da branch e consolida os achados por severidade.
argument-hint: '[base, ex.: main]'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *), Bash(git diff *), Bash(git merge-base *), Bash(git status *)
---

# /keel:review — revisão do diff atual

Base informada: $ARGUMENTS (sem base: a branch principal do repo, `main` ou `master`).

1. Descubra o diff: `git merge-base HEAD <base>` e `git diff <merge-base>` (inclui o que não foi
   commitado). Sem mudanças: avise e encerre.
2. Monte o material: `git diff --stat` e o diff. Acima de ~1.500 linhas, envie a lista de arquivos e os
   trechos mais relevantes por arquivo.
3. Rode **em paralelo** os agentes **keel:revisor-seguranca**, **keel:revisor-qualidade** e
   **keel:revisor-padroes** com o material.
4. Se houver fluxo ativo (`node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" fluxo status --sessao ${CLAUDE_SESSION_ID}`),
   registre as saídas:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" achados registrar --sessao ${CLAUDE_SESSION_ID} <<'KEEL_JSON'
   <saídas dos revisores, como vieram>
   KEEL_JSON
   ```

5. Apresente ao usuário uma lista consolidada, sem duplicatas, ordenada por severidade
   (bloqueante → importante → sugestão), com `arquivo:linha`, o problema e a correção sugerida.
   Não altere código neste comando, a menos que o usuário peça.
