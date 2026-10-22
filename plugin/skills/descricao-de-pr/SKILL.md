---
name: descricao-de-pr
description: Estrutura padrão de título e descrição de PR do Keel - resumo, motivação, mudanças, como testar, riscos, checklist e changelog. Use ao redigir ou revisar a descrição de um PR.
---

# Descrição de PR

**Título**: mesmo padrão dos commits (`feat(pedidos): exportar pedidos em CSV`), até 72 caracteres.

**Corpo**

```markdown
## Resumo

Uma ou duas frases: o que muda para quem usa.

## Motivação

Por que agora. Link da issue (`Closes #N` / `Fixes #N`).

## Mudanças

- Itens curtos por área (API, banco, UI, testes).

## Como testar

Passos objetivos ou o comando de teste e o que ele cobre.

## Riscos e rollback

O que pode dar errado em produção e como reverter (migration, feature flag, config).

## Checklist

- [ ] Testes cobrem a mudança e as bordas
- [ ] Sem segredo ou dado pessoal novo exposto
- [ ] Contratos de API retrocompatíveis
- [ ] Revisores do Keel sem bloqueantes

## Changelog

- Uma linha voltada ao usuário final (ou "sem impacto para o usuário").
```

Seja factual: só o que está no diff. Sem exageros, sem emojis e sem colar código.
