# Cardápio Biza Pizza — Documentação e Contexto

## 1. Diretrizes do Projeto
- **Papel da Assistente:** Consultora técnica do João Leal, gerando prompts prontos, completos e em **bloco único de código** para o Claude executar no terminal.
- **Regra de Segurança:** Não inspecionar pastas nem editar código diretamente, a menos que solicitado explicitamente.
- **Ambiente:** Desenvolvimento e testes locais antes de qualquer subida para produção. Toda alteração é testada no navegador (simulando celular) antes do commit/push.

---

## 2. Visão Geral do Projeto
- **Nome do Projeto:** Cardápio Biza Pizza
- **Objetivo:** Cardápio digital **somente para consulta na mesa (dine-in)** da pizzaria "Biza Pizzas" — sem carrinho, checkout, delivery ou pedido por WhatsApp.
- **Status:** Em produção, publicado e funcional.
- **URL ao vivo:** https://lealsatjoao.github.io/cardapio-biza-pizza/
- **Repositório GitHub:** https://github.com/lealsatjoao/cardapio-biza-pizza (privado)

---

## 3. Funcionalidades Implementadas

### Abas principais (5, com rolagem horizontal se não couberem na tela)
1. **Pastéis** — Salgados (Tradicionais $8 + Especiais $10) e Doces ($8), aviso "montados e fritos na hora" no topo.
2. **Pizzas** — Card de Tamanhos (Broto $27 / Grande $32 / Gigante $40) + aviso de borda recheada no topo, Sabores Tradicionais/Especiais/Doces.
3. **Esfihas** — Combos (Eu/Eu e Você/Nós/Galera), Salgadas ($3,50, exceto Camarão e Espinafre a $4) e Doces ($4); aviso de venda mínima de 5 unidades no topo.
4. **Porções / Massas** — Porções (batata frita, anéis de cebola, frango à passarinho, tábua, entrevero) e Massas (Macarrão na Chapa).
5. **Bebidas** — Refrigerantes (2L $7, 600ml $4, Lata $2 / Guaraná $3), Sucos (Polpa Natural e Caixa 1L) e Água (500ml).

### Outros recursos
- **Tradução completa PT/EN**: botão 🇧🇷/🇺🇸 no cabeçalho troca todo o conteúdo do site em tempo real. Nomes tradicionais dos pratos (ex: Bolonhesa, Catuperu, Entrevero, Macarrão na Chapa, Beijinho) permanecem intactos nas duas línguas; ingredientes, avisos e rótulos de UI são traduzidos.
- **Logo real**: extraída da foto oficial (`bg-biza.jpg`) com fundo transparente, sem animações.
- **Ícones das abas**: fotos reais dos pratos (não desenhos), com fundo removido programaticamente.
- **Fundo fixo**: imagem de madeira com a pizza, presa à tela (não estica/rola), com gradiente escuro no topo para não conflitar com a logo do cabeçalho.
- **Avisos no topo**: todos os avisos importantes (venda mínima, borda recheada, pastel na hora) aparecem antes da lista de itens, não escondidos no rodapé.
- **Mobile-first**, sem bordas brancas (viewport-fit=cover), testado em telas estreitas.

---

## 4. Stack Tecnológico e Arquitetura
- **React 19 + TypeScript + Vite** (`npm run dev` / `npm run build`)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Deploy automático:** GitHub Actions (`.github/workflows/deploy.yml`) builda e publica no GitHub Pages a cada push na branch `main`. Não precisa rodar `npm run build` manualmente para publicar.

---

## 5. Estrutura de Arquivos

```
public/
  bg-biza.jpg          # foto de fundo oficial (madeira + pizza + logo)
  logo-biza.png        # logo "Biza Pizzas" recortada com fundo transparente
  favicon.jpg
  icons/               # ícones das 5 abas principais (fotos reais, fundo removido)
    pastel.png, pizza.png, esfiha.png, porcao.png, bebidas.png

src/
  data/menu.ts         # TODOS os dados do cardápio (preços, sabores, descrições PT/EN)
  utils/translations.ts # dicionário de textos de interface (abas, avisos, rótulos) PT/EN
  components/
    Header.tsx         # logo + botão de idioma + subtítulo
    Tabs.tsx           # componente genérico de abas (principal e sub-abas)
    SectionCard.tsx     # cartão de seção + título de grupo + aviso (Notice)
    MenuItemRow.tsx     # linha de item com número, nome, descrição e preço
    PasteisSection.tsx / PizzasSection.tsx / EsfihasSection.tsx /
    PorcoesSection.tsx / BebidasSection.tsx  # uma por aba principal
  App.tsx              # monta o layout, estado de aba ativa e idioma
```

### Como adicionar ou editar um item do cardápio
Tudo fica em `src/data/menu.ts`. Cada item tem `nome` (fica igual em PT/EN quando é nome tradicional do prato) e `descricao`/`descricaoEn` (ingredientes, aí sim traduzidos). Para editar um preço, sabor ou descrição, basta mudar o texto direto nesse arquivo — não precisa mexer nos componentes.

### Como adicionar/editar uma tradução de interface (não é item do cardápio)
Textos fixos da interface (nome das abas, avisos, "Tamanhos", etc.) ficam em `src/utils/translations.ts`, um bloco `pt` e um `en` espelhados.

---

## 6. Pendências Conhecidas
- **Preços de Bebidas em aberto:** Sucos (Polpa Natural e Caixa 1L) e Água Mineral 500ml ainda não têm preço definido pelo João — aguardando valores para adicionar no mesmo padrão dos refrigerantes.
- **Foto de Porções com marca d'água:** a imagem usada no ícone da aba Porções (`public/icons/porcao.png`) veio de um banco de imagens com marca d'água de preview, usada "por enquanto" a pedido do João. Trocar quando houver uma versão licenciada/limpa.

---

## 7. Histórico de Tarefas
### 15/09/2026
- Projeto inicializado, repositório GitHub criado (depois tornado público para permitir GitHub Pages no plano gratuito).
- Página inicial simples publicada, depois substituída pela aplicação completa (React + Vite + Tailwind).
- Cardápio completo transcrito das fotos do cardápio físico (pastéis, pizzas, esfihas, porções/massas).
- Ajustes visuais: fundo travado em tela cheia, ícones das abas trocados de SVG para fotos reais dos pratos, cabeçalho com logo real extraída da foto oficial, correção de bordas brancas no mobile (viewport-fit=cover).
- Tradução completa do site implementada (PT/EN), com nomes tradicionais dos pratos preservados nas duas línguas.
- Nova aba "Bebidas" criada e depois detalhada por completo: Refrigerantes (2L/600ml/Lata, com preço especial do Guaraná em lata), Sucos (Polpa Natural e Caixa 1L) e Água.
- Avisos informativos (venda mínima de esfihas, borda recheada, pastel na hora) reposicionados do rodapé para o topo de cada aba.
