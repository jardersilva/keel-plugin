---
name: feature
description: Fluxo completo de feature com portões - entender, planejar com aprovação, branch, implementar, testar, revisar, corrigir e abrir o PR.
argument-hint: '<descrição da feature | #issue>'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *), mcp__plugin_keel_keel__carregar_skill
---

# /keel:feature — da descrição ao PR

Pedido: $ARGUMENTS

CLI do Keel: `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs"` (abaixo, `keel`). Sessão: `${CLAUDE_SESSION_ID}`.
Todo comando `keel fluxo`/`keel test`/`keel achados` leva `--sessao ${CLAUDE_SESSION_ID}`.

O fluxo é uma máquina de estados com **portões**. O Keel bloqueia a parada (hook Stop) enquanto houver
portão automático pendente. Ao terminar cada etapa, rode `keel fluxo avancar --sessao ${CLAUDE_SESSION_ID}`.
Se ele recusar, faça o que a mensagem pede. Em dúvida, `keel fluxo status --sessao ${CLAUDE_SESSION_ID}`.

## 0. Triagem e início

O time define no painel os **roteiros** (etapas, agentes e portões) e as **skills**. A triagem escolhe
um roteiro e as skills para este pedido; o usuário confirma.

1. Se o pedido não cita arquivos, peça ao agente **keel:explorador** só os caminhos prováveis (lista
   curta, sem trechos).
2. `keel triagem propor --sessao ${CLAUDE_SESSION_ID} --comando feature --pedido "<pedido>" --arquivos "<caminhos separados por vírgula>"`
3. Se a saída pedir a classificação, rode o agente **keel:triador** com o bloco ```json que ela trouxe e
   depois repita o comando com `--classificacao`, passando a resposta do triador por heredoc
   (`<<'KEEL_JSON' ... KEEL_JSON`).
4. Mostre a proposta ao usuário como veio (roteiro, skills, motivo, regras obrigatórias) e **espere**:
   "ok" confirma; ele pode trocar o roteiro ou as skills. Regras obrigatórias e skills obrigatórias não
   saem com a edição.
5. `keel fluxo iniciar feature --roteiro <slug> --skills <a,b> --sessao ${CLAUDE_SESSION_ID} --descricao "<resumo em uma linha>"`
   (acrescente `--issue #N` se o pedido citar uma issue). Se já houver fluxo ativo, pergunte ao usuário
   se deve abandoná-lo antes de usar `--forcar`.
6. Carregue as skills que a saída listar com a ferramenta MCP `carregar_skill` e siga as instruções
   delas durante o fluxo.

**As etapas são as do roteiro** (a saída de `keel fluxo status` mostra a ordem, os agentes e os
portões). As seções abaixo descrevem cada etapa pelo nome: pule as que o roteiro não tem e, numa etapa
de revisão, rode exatamente os revisores que o status pedir.

## 1. ENTENDER

- Se o pedido cita `#N` e o `gh` está disponível: `gh issue view N` (título, descrição, critérios).
- Use o agente **keel:explorador** para localizar o código relevante. Ele devolve só caminhos e
  trechos-chave; não leia dezenas de arquivos no contexto principal.
- Requisito ambíguo: pergunte ao usuário (no máximo 3 perguntas, numa mensagem só) e espere.
- `keel fluxo avancar`.

## 2. PLANEJAR (portão humano: `plano_aprovado`)

- Use o agente **keel:planejador** com o pedido, o resumo do explorador e as linhas "Restrições do time" e
  "Instruções do time" do contexto, se houver.
- Mostre ao usuário: objetivo, arquivos afetados, passos, riscos, estratégia de testes, restrições do time
  (como o plano as respeita) e tamanho. Siga o plano aprovado nas etapas seguintes.
- **Pare e espere a aprovação explícita.** Só depois de o usuário aprovar:
  `keel fluxo aprovar plano_aprovado --sessao ${CLAUDE_SESSION_ID}` e `keel fluxo avancar`.
- Pedido de ajuste: revise o plano e mostre de novo.

## 3. BRANCH (só na entrega por PR)

- Se o perfil diz **entrega direta**, esta etapa não existe no fluxo: siga para IMPLEMENTAR.
- Crie a branch pela convenção do perfil (padrão `feat/<slug>`) a partir da branch principal
  atualizada. Nunca trabalhe direto em `main`/`master`.
- `keel fluxo avancar`.

## 4. IMPLEMENTAR

- Siga o plano passo a passo. Leia só os arquivos que vai mudar ou que servem de modelo.
- Siga as convenções do projeto (skill keel:revisao-de-codigo como referência).
- `keel fluxo avancar`.

## 5. TESTAR (portão: `testes_verdes`)

- Use o agente **keel:testador** para escrever/ajustar testes dos critérios e bordas. Se o projeto não
  tem testes automatizados, não crie a infraestrutura de testes sem o usuário pedir.
- Rode `keel test --sessao ${CLAUDE_SESSION_ID}`. A saída já vem enxuta (status + falhas). Sem testes
  no projeto, ele roda typecheck, lint e build no lugar.
- Corrija até passar. Qualquer edição depois do teste invalida o resultado: rode de novo.
- `keel fluxo avancar`.

## 6. REVISAR (portão: `revisao_registrada`)

- Monte o material da revisão: `git diff --stat` e o diff completo da branch em relação à base
  (se passar de ~1.500 linhas, envie a lista de arquivos e os trechos alterados mais relevantes).
  Se o contexto da sessão tiver "Restrições do time" ou "Instruções do time", copie essas linhas no
  material: os revisores conferem o diff contra elas.
- Rode **em paralelo** os revisores da etapa, passando o material: os que `keel fluxo status` listar
  (no roteiro completo, **keel:revisor-seguranca**, **keel:revisor-qualidade** e
  **keel:revisor-padroes**). O portão só abre com a saída de todos eles.
- Registre as saídas de uma vez (cole as respostas como vieram, com os blocos ```json):

  ```bash
  node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" achados registrar --sessao ${CLAUDE_SESSION_ID} <<'KEEL_JSON'
  <saídas dos revisores>
  KEEL_JSON
  ```

- `keel fluxo avancar`.

## 7. CORRIGIR (portões: `testes_verdes` e `sem_bloqueantes`)

- Resolva todos os achados **bloqueantes**. Resolva os **importantes** ou justifique ao usuário por
  que não. Sugestões são opcionais.
- Depois de corrigir: `keel test --sessao ${CLAUDE_SESSION_ID}` e uma nova revisão **só dos trechos
  alterados** (revisão incremental), registrada com
  `keel achados registrar --sessao ${CLAUDE_SESSION_ID}` (heredoc, como na etapa 6).
- `keel fluxo avancar`.

## 8a. PR (portão: `pr_aberto`) — entrega por PR

- Faça commits seguindo a convenção do perfil (skill keel:convencoes-git).
- Use o agente **keel:redator-pr** para título, descrição, checklist e changelog
  (skill keel:descricao-de-pr).
- Mostre o resumo ao usuário e peça confirmação antes do `git push` e do `gh pr create`.
- Abra o PR com `gh pr create` e registre: `keel fluxo pr <url> --sessao ${CLAUDE_SESSION_ID}`.
- `keel fluxo avancar` conclui o fluxo.

## 8b. COMMIT (portão: `commit_feito`) — entrega direta

- Mostre ao usuário o resumo da mudança e a mensagem de commit proposta (convenção do perfil) e peça
  confirmação antes de commitar e antes de enviar (`git push`), se o time envia direto.
- Commite na branch atual e registre: `keel fluxo commit <hash> --sessao ${CLAUDE_SESSION_ID}`
  (o hash sai de `git rev-parse --short HEAD`).
- `keel fluxo avancar` conclui o fluxo.

## 9. CONCLUÍDO

Resumo final ao usuário: link do PR (ou hash do commit), o que foi feito, verificação, achados
resolvidos e pendências.

## Regras

- O Keel nunca cria arquivos de controle no repositório: estado e perfil ficam em `~/.keel`.
- Bloqueio de política (hook): não tente contornar. Explique ao usuário; `/keel:porque` detalha.
- **Restrições do time** (linha "Restrições do time" no contexto): o que estiver restrito (branch, commit,
  push, PR) não é executado. Entregue ao usuário o nome da branch, a mensagem de commit ou o título e a
  descrição do PR, e registre só o que ele informar (`keel fluxo commit <hash> --sessao ${CLAUDE_SESSION_ID}` ou
  `keel fluxo pr <url> --sessao ${CLAUDE_SESSION_ID}`).
- Se o usuário pedir para parar o fluxo: `keel fluxo abandonar --sessao ${CLAUDE_SESSION_ID}`.
- Se o contexto avisar de um fluxo em andamento em outra sessão (ex.: depois de abrir outro terminal),
  pergunte ao usuário antes de iniciar um novo; para continuar o anterior:
  `keel fluxo retomar --sessao ${CLAUDE_SESSION_ID}`.
- Arquivos alterados fora do Edit/Write (pelo shell, pelo IDE) também invalidam testes e revisões: o
  Keel compara a árvore do repo. Rode `keel test` de novo quando ele pedir.
