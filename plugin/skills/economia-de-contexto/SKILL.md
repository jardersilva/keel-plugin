---
name: economia-de-contexto
description: Regras do Keel para gastar menos tokens - usar o agente explorador e o mapa do repo, ler só o necessário, saídas enxutas de teste e lint, e subagentes para trabalho pesado. Use antes de explorar um código desconhecido ou quando o contexto estiver crescendo.
---

# Economia de contexto

- **Mapa antes de busca**: a ferramenta MCP `mapa_repo` (ou `node "${CLAUDE_PLUGIN_ROOT}/cli/keel.mjs" map`)
  mostra arquivos e símbolos exportados sem abrir arquivo nenhum.
- **Explorar fora do contexto principal**: para "onde fica X / o que usa Y", use o agente
  **keel:explorador**. Ele lê o que precisar e devolve só caminhos e trechos-chave.
- **Ler pouco**: só os arquivos que vão mudar ou servem de modelo; em arquivo grande, só o trecho
  (`Read` com offset/limit, `Grep` com contexto).
- **Buscas específicas**: nome de função, rota ou tabela, e não padrões genéricos que devolvem dezenas
  de arquivos.
- **Saídas enxutas**: `keel test`, `keel lint` e `keel typecheck` em vez dos comandos crus; nunca
  `cat` de logs inteiros.
- **Subagentes para trabalho pesado**: revisões e exploração rodam em agentes e devolvem resumos.
- **Perfil e aprendizados sob demanda**: o resumo e os comandos já estão no contexto da sessão. Detalhes
  (arquitetura, testes, banco...) vêm de `contexto_projeto(secao)`, e as regras do time de
  `buscar_aprendizados(consulta)`. Não redescubra o
  que o perfil informa.
