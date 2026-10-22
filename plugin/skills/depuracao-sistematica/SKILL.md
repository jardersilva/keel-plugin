---
name: depuracao-sistematica
description: Método de depuração do Keel - reproduzir, isolar, formular hipótese, verificar e só então corrigir a causa raiz. Use ao investigar um bug, erro ou teste instável.
---

# Depuração sistemática

1. **Reproduzir**: um teste automatizado ou comando que mostra o erro sempre. Sem reprodução, não há
   como provar a correção.
2. **Isolar**: reduza o caso. Qual a menor entrada que falha? Qual commit introduziu
   (`git log -S`, `git bisect` com o usuário)? Qual camada (entrada, regra, banco, integração)?
3. **Hipótese**: uma frase falsificável ("o total ignora a quantidade quando o desconto é zero").
4. **Verificar**: prove ou refute com o mínimo de código (teste focado, log temporário que você remove
   depois). Hipótese refutada: volte ao passo 3; não acumule mudanças especulativas.
5. **Corrigir a causa raiz**, não o sintoma. Verifique se o mesmo padrão existe em outros lugares
   (`Grep`) e mencione ao usuário.
6. **Provar**: o teste de reprodução passa e a suíte continua verde (`keel test`).

Evite: mudar várias coisas de uma vez, "consertar" silenciando o erro (catch vazio, retry cego) e
apagar o teste que falha.
