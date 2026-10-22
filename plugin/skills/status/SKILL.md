---
name: status
description: Mostra a etapa atual do fluxo do Keel nesta sessão, os portões pendentes e o que fazer para avançar.
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *)
---

# /keel:status

Rode `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" fluxo status --sessao ${CLAUDE_SESSION_ID}` e mostre o
resultado ao usuário, explicando em uma frase o próximo passo de cada portão pendente.

Sem fluxo ativo, diga isso (se a saída mencionar um fluxo em outra sessão, pergunte se o usuário
quer retomá-lo com `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" fluxo retomar --sessao ${CLAUDE_SESSION_ID}`) e lembre os comandos disponíveis: `/keel:feature`, `/keel:fix`,
`/keel:review`, `/keel:pr`. (Consumo de tokens por sessão chega com o Keel Team.)
