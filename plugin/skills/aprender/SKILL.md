---
name: aprender
description: Registra uma lição aprendida ou regra do repositório como proposta de aprendizado, para o tech lead aprovar. Use quando o usuário pedir para lembrar uma regra, convenção ou lição para as próximas sessões.
argument-hint: '<lição em texto livre>'
disable-model-invocation: true
allowed-tools: mcp__plugin_keel_keel__propor_aprendizado, mcp__plugin_keel_keel__buscar_aprendizados
---

# /keel:aprender — registrar um aprendizado

Lição: $ARGUMENTS

Registra a lição como **proposta** de aprendizado do repositório. Ela não vale na hora: entra na fila de
propostas do painel (Conhecimento → Propostas) e, quando o tech lead aprova, passa a aparecer em
`buscar_aprendizados` na sessão seguinte de todo o time.

## Passos

1. Se `$ARGUMENTS` estiver vazio, pergunte ao usuário qual é a lição e pare até ele responder.
2. Reescreva a lição como uma regra curta e acionável, no imperativo, dizendo o que fazer (não só o que
   evitar) e quando vale. Exemplo: "Use prepared statements em toda query que recebe entrada do usuário".
   Não inclua código-fonte, segredos, nomes de clientes nem dados pessoais: a proposta vai para o backend.
3. Chame `buscar_aprendizados` com os termos principais. Se já houver uma regra equivalente aprovada, mostre
   ao usuário e pergunte se ainda quer propor (pode ser só um ajuste de texto).
4. Pergunte, em uma linha, o que motivou a lição (a evidência: o bug, a revisão ou o incidente). Se o
   usuário não quiser dizer, siga sem evidência.
5. Chame `propor_aprendizado` com o texto e a evidência.
6. Responda em uma ou duas linhas: o texto proposto e que ele aguarda aprovação no painel. Se a ferramenta
   disser que guardou offline, avise que a proposta será enviada no próximo `keel sync`.
