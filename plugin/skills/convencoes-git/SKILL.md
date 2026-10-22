---
name: convencoes-git
description: Convenções de git do Keel - nome de branch pelo perfil, commits convencionais, quando usar rebase ou merge e o que nunca fazer em main/master. Use ao criar branch, commitar ou preparar push.
---

# Convenções de git

Siga o perfil do projeto (injetado no início da sessão). Na falta dele, use estes padrões.

**Branch** (entrega por PR; na entrega direta não há branch de trabalho)

- Padrão do perfil (ex.: `feat/<slug>`, `fix/<slug>`), criada a partir da principal atualizada.
- `<slug>`: 2 a 5 palavras em kebab-case, sem acento (`feat/exportar-pedidos-csv`).
- Com issue: inclua o número quando o time usa (`fix/123-total-carrinho`).

**Commits** (perfil `convencional`)

- `tipo(escopo opcional): resumo no imperativo, até 72 caracteres`.
- Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`, `build`.
- Corpo: o porquê, não o como. `BREAKING CHANGE:` no rodapé quando quebrar contrato.
- Um commit por mudança lógica. Testes e implementação da mesma mudança andam juntos.

**Integração**

- Perfil `squash`/`merge`: atualize a branch com merge da principal.
- Perfil `rebase`: `git rebase` na principal, e depois `git push --force-with-lease` só na própria branch.

**Nunca**

- Commitar direto em `main`/`master` quando o perfil usa entrega por PR. (Com **entrega direta**, o
  time commita na branch principal: siga o perfil, sempre com confirmação do usuário antes de commitar e
  enviar.)
- `push --force` em branch compartilhada (a política do Keel bloqueia em main/master).
- Commitar segredos (`.env`, chaves). Se aparecerem no diff, pare e avise o usuário.
- Commitar arquivos de controle de IA (planos, relatórios, notas de agente).
