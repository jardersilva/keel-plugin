---
name: fix
description: Fluxo de correção de bug com reprodução primeiro - entender, reproduzir com teste que falha, diagnosticar, corrigir, testar, revisar e abrir o PR.
argument-hint: '<descrição do bug | #issue>'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *), mcp__plugin_keel_keel__carregar_skill
---

# /keel:fix — reproduzir antes de corrigir

Bug: $ARGUMENTS

CLI do Keel: `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs"` (abaixo, `keel`). Sessão: `${CLAUDE_SESSION_ID}`.
Todo comando `keel fluxo`/`keel test`/`keel achados` leva `--sessao ${CLAUDE_SESSION_ID}`.
Ao terminar cada etapa: `keel fluxo avancar --sessao ${CLAUDE_SESSION_ID}`. Se recusar, faça o que a
mensagem pede. A skill keel:depuracao-sistematica descreve o método.

## 0. Triagem e início

O time define no painel os **roteiros** (etapas, agentes e portões) e as **skills**. A triagem escolhe
um roteiro (ex.: `fix`, `fix-ui`, `fix-api`, `hotfix`) e as skills; o usuário confirma.

1. Se o bug não cita arquivos, peça ao agente **keel:explorador** só os caminhos prováveis.
2. `keel triagem propor --sessao ${CLAUDE_SESSION_ID} --comando fix --pedido "<bug>" --arquivos "<caminhos separados por vírgula>"`
3. Se a saída pedir a classificação, rode o agente **keel:triador** com o bloco ```json dela e repita o
   comando com `--classificacao` e a resposta do triador por heredoc (`<<'KEEL_JSON' ... KEEL_JSON`).
4. Mostre a proposta ao usuário e **espere**: "ok" confirma, ou ele troca roteiro e skills. Regras e
   skills obrigatórias não saem.
5. `keel fluxo iniciar fix --roteiro <slug> --skills <a,b> --sessao ${CLAUDE_SESSION_ID} --descricao "<bug em uma linha>"`
   (`--issue #N` se houver).
6. Carregue as skills listadas com a ferramenta MCP `carregar_skill`.

**As etapas são as do roteiro** (`keel fluxo status` mostra ordem, agentes e portões). Pule as seções
abaixo que o roteiro não tem; na revisão, rode os revisores que o status pedir.

## 1. ENTENDER

Leia a issue (`gh issue view N`, se houver) e use o agente **keel:explorador** para achar o código
envolvido. Sem passos para reproduzir ou comportamento esperado claro: pergunte (máx. 3 perguntas).
`keel fluxo avancar`.

## 2. REPRODUZIR (portão: `teste_falhando`)

- Escreva (ou peça ao **keel:testador**) um teste automatizado que reproduz o bug.
- Rode `keel test --sessao ${CLAUDE_SESSION_ID}`. **Ele precisa falhar pelo motivo do bug.**
- Se a reprodução automatizada for realmente inviável (ex.: depende de hardware ou serviço externo, ou
  o projeto não tem testes automatizados e o usuário não quer criá-los agora), explique ao usuário, mostre
  como reproduzir manualmente e registre:
  `keel fluxo justificar teste_falhando "<motivo>" --sessao ${CLAUDE_SESSION_ID}`.
- `keel fluxo avancar`.

## 3. DIAGNOSTICAR

Isole a causa raiz (hipótese → verificação). Não corrija sintomas. Explique a causa ao usuário em
2 a 4 frases. `keel fluxo avancar`.

## 4. BRANCH (só na entrega por PR)

Branch pela convenção do perfil (ex.: `fix/<slug>`), a partir da principal atualizada.
`keel fluxo avancar`. Na entrega direta esta etapa não existe.

## 5. CORRIGIR (portão: `testes_verdes`)

Correção mínima na causa raiz. `keel test --sessao ${CLAUDE_SESSION_ID}` precisa passar, incluindo o
teste de reprodução. `keel fluxo avancar`.

## 6. REVISAR (portão: `revisao_registrada`)

Os revisores que `keel fluxo status` listar para a etapa (no roteiro `fix`, **keel:revisor-seguranca**,
**keel:revisor-qualidade** e **keel:revisor-padroes**) em paralelo sobre o diff, e depois `keel achados registrar --sessao ${CLAUDE_SESSION_ID}` com as saídas (heredoc,
como no /keel:feature). `keel fluxo avancar`.

## 7. AJUSTAR (portões: `testes_verdes` e `sem_bloqueantes`)

Resolva os bloqueantes, rode `keel test` e uma revisão incremental dos trechos alterados.
`keel fluxo avancar`.

## 8. PR (portão: `pr_aberto`) ou COMMIT (portão: `commit_feito`)

- **Entrega por PR:** commit (skill keel:convencoes-git), agente **keel:redator-pr**, confirmação do
  usuário antes do push, `gh pr create` (mencione `Fixes #N` se houver issue), e então
  `keel fluxo pr <url> --sessao ${CLAUDE_SESSION_ID}` e `keel fluxo avancar`.
- **Entrega direta:** com confirmação do usuário, commit na branch atual (e push, se o time envia
  direto), `keel fluxo commit <hash> --sessao ${CLAUDE_SESSION_ID}` e `keel fluxo avancar`.

Resumo final: causa raiz, correção, o que prova a correção, link do PR ou hash do commit.
