---
name: testes-eficientes
description: Como testar com o Keel - keel test com saída enxuta, teste que falha antes de corrigir, o que cobrir e como não desperdiçar contexto com logs. Use ao escrever, rodar ou depurar testes.
---

# Testes eficientes

**Rodar**

- Use `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" test` em vez do comando cru. Ele roda o comando do
  perfil e devolve só o status, as falhas com contexto e o resumo (limite: `--linhas N`).
- Argumentos extras vão depois de `--` (ex.: `keel test -- src/carrinho.test.ts` para um arquivo).
- Num fluxo ativo, passe `--sessao ${CLAUDE_SESSION_ID}`: o resultado alimenta o portão `testes_verdes`.
- `keel lint` e `keel typecheck` seguem o mesmo princípio.

**Escrever**

- Bug: primeiro um teste que **falha** pelo motivo do bug; depois a correção; o teste passa.
- Cubra os critérios de aceite e as bordas: vazio, limite, inválido, sem permissão, duplicado, erro de
  dependência externa.
- Um comportamento por teste, com nome que descreve o comportamento ("rejeita desconto acima de 100").
- Siga o framework e o estilo de teste que o projeto já usa; não introduza outro.
- Teste deve ser determinístico: sem relógio real, rede ou ordem aleatória sem controle.

**Nunca**

- Enfraquecer, pular ou apagar um teste para "ficar verde".
- Colar logs inteiros no contexto. Se precisar de mais detalhe, rode só o teste que falha.
