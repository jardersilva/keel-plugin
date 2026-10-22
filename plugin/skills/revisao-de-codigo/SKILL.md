---
name: revisao-de-codigo
description: Checklist base de revisão de código do Keel e o formato JSON obrigatório dos achados (severidade, arquivo, linha, regra, explicação, correção). Use ao revisar um diff ou antes de considerar uma mudança pronta.
---

# Revisão de código

**Checklist**

1. Corretude: faz o que o pedido/plano diz? Bordas, nulos, erros e concorrência tratados?
2. Segurança: entrada validada na borda, autorização por recurso, nenhum segredo no código, sem
   injeção (SQL, shell, HTML), dados pessoais mínimos.
3. Testes: cobrem o comportamento novo e as bordas? Nenhum teste enfraquecido?
4. Dados: sem consulta em loop (N+1), listagens paginadas, migrations reversíveis e sem lock longo.
5. Contratos: API e eventos retrocompatíveis (clientes antigos continuam funcionando).
6. Legibilidade: nomes claros, funções curtas, sem duplicação desnecessária, segue o padrão do projeto.
7. Operação: erros logados com contexto, timeouts em chamadas externas, nada que derrube em escala.

**Severidade**

- `bloqueante`: bug, falha de segurança, perda de dados, quebra de contrato, teste ausente para a mudança.
- `importante`: problema real que deve ser corrigido ou justificado (performance, manutenção, borda).
- `sugestao`: melhoria opcional.

**Formato obrigatório** (um bloco por revisor; `linha` e `correcao_sugerida` são opcionais):

```json
{
  "revisor": "revisor-qualidade",
  "achados": [
    {
      "severidade": "importante",
      "arquivo": "src/pedidos/servico.ts",
      "linha": 42,
      "regra": "consulta-em-loop",
      "explicacao": "Busca o cliente de cada pedido dentro do loop (N+1).",
      "correcao_sugerida": "Carregar os clientes em lote antes do loop."
    }
  ]
}
```

- `regra`: identificador estável em kebab-case (`sql-injection`, `consulta-em-loop`), para medir
  achados recorrentes.
- `explicacao`: descreva o problema **sem colar trechos de código**.
- Sem problemas: `"achados": []`.
