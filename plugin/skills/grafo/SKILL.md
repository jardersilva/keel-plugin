---
name: grafo
description: Gera e abre o grafo interativo do projeto (ou do espaço de trabalho) - módulos, dependências, áreas quentes, aprendizados e arquivos protegidos - tudo local, sem enviar nada.
argument-hint: '[workspace] [arquivo.code-workspace]'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" *)
---

# /keel:grafo — o que o Keel sabe do projeto, em um grafo

Objetivo: gerar o grafo do projeto em `~/.keel/grafos/` (HTML autocontido, abre offline) e abri-lo no
navegador. Nada é gravado no repositório nem enviado ao Keel Team (D-028).

CLI do Keel: `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs"` (abaixo, `keel`).

Argumentos do usuário: $ARGUMENTS

## Passos

1. Se o usuário pediu o espaço de trabalho (ou passou um `.code-workspace`), rode
   `keel grafo --workspace [arquivo] --abrir`. Senão, `keel grafo --abrir`. Se a CLI disser que há vários
   `.code-workspace`, pergunte qual usar e rode de novo com o arquivo.
2. Mostre ao usuário, em até 6 linhas, o que a CLI resumiu: módulos mais usados, áreas quentes, módulos
   com aprendizados e com arquivos protegidos, e o caminho do arquivo (caso o navegador não abra sozinho).
3. Sugira o próximo passo útil, se houver: revisar uma área quente com `/keel:review`, registrar um
   aprendizado com `/keel:aprender`, ou ver o impacto de um arquivo com `keel impacto <arquivo>`.

Não leia o HTML gerado nem o código do projeto: o resumo da CLI basta.
