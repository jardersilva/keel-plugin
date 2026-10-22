---
name: setup-workspace
description: Configura o Keel em todos os repositórios de um espaço de trabalho (.code-workspace do VS Code) numa rodada só - detecta cada repo, faz no máximo 5 perguntas comuns, salva os perfis fora dos repositórios e agrupa os projetos no painel.
argument-hint: '[arquivo.code-workspace] [observações]'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *), Read, Grep, Glob
---

# /keel:setup-workspace — perfis de um espaço de trabalho

Objetivo: fazer o `/keel:setup` de **cada repo** de um `.code-workspace` de uma vez e agrupar esses projetos
no painel, em Projetos, sob o espaço de trabalho (D-027). Os perfis ficam em `~/.keel/cache`, **nunca** nos
repositórios. Não crie nem altere arquivos dos repos neste comando.

CLI do Keel: `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs"` (abaixo, `keel`).

Argumentos do usuário: $ARGUMENTS

## Passos

1. Rode `keel workspace detectar [arquivo]`, passando o arquivo se o usuário informou um. Sem arquivo, a CLI
   procura na pasta atual e nas de cima. Se ela devolver `candidatos`, pergunte qual usar e rode de novo.
   Cada item de `repos` traz `pasta`, `situacao`, `remote`, `perfil_existente`, stack e comandos detectados.
   - `situacao` diferente de `repo` (`inexistente`, `remota`, `sem_git`, `duplicada`): só liste no resumo final.
   - Repos com `perfil_existente`: pergunte **uma vez** se é para atualizar todos, só alguns ou pular esses.
2. Para cada repo, leia **pouco**: README, o manifesto e `keel map --pasta <pasta> --profundidade 1`. Não leia
   o código. Com muitos repos (mais de 5), seja ainda mais breve: README e manifesto bastam.
3. Faça **uma única rodada de no máximo 5 perguntas**, numa só mensagem, sobre o que vale para todos e não deu
   para inferir: **modo de entrega** (branch + PR ou direto na branch principal), convenção de branch, commits
   convencionais ou livres, estratégia de merge, áreas sensíveis. Inclua uma lista curta com o que você inferiu
   de diferente por repo (ex.: comando de teste) para o usuário corrigir só as exceções.
4. Para cada repo, monte o perfil (mesmo formato e limites do `/keel:setup`) e salve com heredoc:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" perfil salvar --pasta "<pasta>" <<'KEEL_JSON'
   {
     "resumo": "2 a 5 frases deste repo.",
     "stack": ["TypeScript"],
     "comandos": { "test": "pnpm test" },
     "convencoes": { "entrega": "pr", "branch": "feat/<slug>", "commits": "convencional", "merge": "squash" },
     "secoes": { "arquitetura": "..." }
   }
   KEEL_JSON
   ```

   - As convenções respondidas no passo 3 entram em todos, salvo as exceções.
   - Se a CLI recusar o JSON, corrija os campos apontados e tente de novo.

5. Rode `keel workspace vincular [arquivo]` (o mesmo arquivo do passo 1). Ele cria o espaço de trabalho no
   Keel Team e agrupa os repos com remote. Repos de dev aguardando aprovação aparecem como "ainda não cadastrados":
   o grupo vale para eles quando o lead aprovar e alguém rodar o vincular de novo.
6. Rode `keel grafo --workspace [arquivo] --abrir` (o mesmo arquivo do passo 1) para mostrar o grafo do espaço
   de trabalho, com os repos ligados entre si (local; com o compartilhamento da org ligado, cada repo também vai
   para o painel). Não leia o HTML.
7. Mostre um resumo curto: perfis salvos (por repo: stack, entrega, comando de teste), o que ficou agrupado no
   painel e o que ficou de fora, com o motivo (sem remote, em outra organização, sem permissão, sem login), e
   em até 3 linhas o que o grafo mostrou (módulos mais usados, ligações entre repos, áreas quentes) com o
   caminho do arquivo.

Não rode `keel test` em cada repo: só sugira ao usuário rodar quando abrir o repo.
