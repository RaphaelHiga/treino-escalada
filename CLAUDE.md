# Diário de Escalada (treino-escalada)

App de treino de escalada em português (pt-BR), feito como PWA de um arquivo só.

## Estrutura

- `index.html`: todo o app (CSS, SVGs e JS). As linhas são longas; leia por trechos (`sed -n` + `cut -c`).
- `sw.js`: service worker. **A cada mudança publicada, aumente o número em `CACHE`** (ex.: v64 -> v65), senão o celular não pega a versão nova.
- Os dados ficam no `localStorage` (`diario-escalada-v3`) e são normalizados em `normalizar()`. Campo novo em `D` precisa entrar lá para sobreviver ao importar backup.

## Exercícios

- Lista em `EX` (configuração no topo do script). Cada um tem:
  - `k`, `cat` (`superior` | `inferior` | `core` | `especifico`), `nome`, `curto`, `proto`;
  - `lev`: `true` = só a carga conta no % do peso; `false` = peso + carga;
  - `maos`: tem lado esquerdo e direito; `membro`: nome do lado, `"mão"` por padrão (o Búlgaro usa `"perna"`);
  - `cor`: fundo do frango.
- Cada exercício também precisa de entradas em `CORTES` (Frango, Frangão e Máquina, em % do peso), `INFO` e `CUIDADOS`.
- Acompanhados: `D.ativos`. Sem escolha salva, valem os de `ATIVOS_PADRAO`. Use `exAtivos()` ou `exOrdem()` nas telas; `EX` inteiro só onde importam os registros antigos (histórico, sessões).
- Desligar um exercício não apaga os registros. Nos Ajustes, o exercício desligado aparece como ovo (`ovoEspera`). Os cortes ficam embaixo de cada exercício ligado.

## Padrões de interface

- Abrir, recolher, ligar e desligar blocos usa `animarBloco(k, render, ancora)`: a altura desliza, sem pulo. Respeite `RM` (reduzir movimento).
- Textos curtos e diretos, sem travessão, no tom do frango.
- Teste no Chromium com Playwright (já instalado globalmente) antes de enviar.

## Desempenho

Com meses de registros, as contas de fase e de conquistas rodam milhares de vezes por toque. Três atalhos seguram isso:

- `datas()` devolve a lista guardada e **congelada**: para `reverse()` ou `sort()`, copie antes com `.slice()`.
- `diasEntre` usa o número de cada dia guardado (`diaN`), sem criar datas.
- Durante o `render()`, `progressoFase`, `dorRecente` e `calcConquistas` ficam guardados em `MEMO` (só enquanto o render roda). Por isso o render nunca mexe em `D.sessoes`, `D.pesos` nem `D.cortes`; mudanças de dados acontecem antes, nas ações.

## Pendências

- [ ] **Revisar os treinos.** Os 9 exercícios novos foram sugestões iniciais e ainda não foram validados pelo usuário:
  - Superior: Paralela, Desenvolvimento e Flexão de Braço;
  - Inferior: Agachamento, Terra Romeno e Agachamento Búlgaro;
  - Core: Elevação de Pernas, Prancha e Caminhada com Mala.

  Revisar com o usuário:
  - a escolha dos exercícios (trocar, tirar ou incluir);
  - os protocolos (séries e repetições ou tempo);
  - os cortes das fases;
  - os textos de "Como fazer" e "Cuidados";
  - se faz sentido medir exercícios só por tempo ou repetições, sem carga. Hoje o app mede tudo em kg e % do peso.

  Também pode mudar quais vêm ligados por padrão (`ATIVOS_PADRAO`). Ao começar um assunto sobre exercícios ou treinos, lembre o usuário desta pendência.
