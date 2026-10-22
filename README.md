# Keel — plugin para o Claude Code

Da feature/fix até o PR: fluxos com portões, revisores, política de segurança e saídas enxutas, dentro do
Claude Code. Versão 0.1.1.

## Instalar

No Claude Code:

```
/plugin marketplace add jardersilva/keel-plugin
/plugin install keel@keel
```

No terminal (Node.js 22 ou mais novo), para o comando `keel`:

```bash
npm i -g "@jarder.dev/keel"
keel login        # opcional: liga o Keel Team (painel, perfis e regras do time)
```

Dentro de um repositório, rode `/keel:setup`. Para atualizar: `/plugin marketplace update keel` e
`npm i -g "@jarder.dev/keel@latest"` (as aspas evitam o erro do `@` no PowerShell).

Este repositório é gerado automaticamente a cada versão: não contém o código-fonte.
