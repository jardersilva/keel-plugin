---
name: porque
description: Explica o último bloqueio de política do Keel nesta sessão - qual ação, qual regra, por quê e como pedir exceção.
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *)
---

# /keel:porque

1. Rode `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" porque --sessao ${CLAUDE_SESSION_ID}`.
2. Explique ao usuário, em linguagem simples:
   - o que foi bloqueado e qual regra;
   - por que a regra existe (o risco que ela evita);
   - uma alternativa segura para atingir o mesmo objetivo, se houver;
   - como pedir exceção (no Keel Open: o próprio usuário executa a ação fora do Claude; no Keel Team:
     solicitação pelo painel, aprovada pelo tech lead).
3. Se o fluxo parou num portão (hook Stop) e não numa política, rode também
   `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" fluxo status --sessao ${CLAUDE_SESSION_ID}` e explique o
   que falta.

Nunca sugira formas de contornar a política.
