export interface MenuItem {
  numero: number
  nome: string
  descricao?: string
  precoOverride?: string
}

export interface TamanhoPizza {
  nome: string
  fatias: number
  preco: string
  descricao: string
}

export interface ComboEsfiha {
  nome: string
  subtitulo: string
  preco: string
  composicao: string[]
}

export interface PorcaoItem {
  nome: string
  nomeEn?: string
  preco: string
  descricao?: string
  descricaoEn?: string
}

// ---------- PASTÉIS ----------

export const pasteisSalgadosTradicionais: MenuItem[] = [
  { numero: 1, nome: 'Carne, ovos e mussarela' },
  { numero: 2, nome: 'Carne, cebola, tomate, gotas de limão e mussarela' },
  { numero: 3, nome: 'Carne, catupiry e mussarela' },
  { numero: 4, nome: 'Carne, cheddar e mussarela' },
  { numero: 5, nome: 'Carne, bacon, mussarela e cheddar' },
  { numero: 6, nome: 'Frango, catupiry e mussarela' },
  { numero: 7, nome: 'Frango, cheddar e mussarela' },
  { numero: 8, nome: 'Frango, milho, bacon e mussarela' },
  { numero: 9, nome: 'Frango, creme de leite, milho, tomate e mussarela' },
  { numero: 10, nome: 'Frango, palmito, ervilha, presunto e mussarela' },
  { numero: 11, nome: 'Frango, milho, brócolis e mussarela' },
  { numero: 12, nome: 'Frango, brócolis, bacon, catupiry e mussarela' },
  { numero: 13, nome: 'Calabresa, cheddar e mussarela' },
  { numero: 14, nome: 'Calabresa, catupiry e mussarela' },
  { numero: 15, nome: 'Calabresa, bacon, ovo, cebola e mussarela' },
  { numero: 16, nome: 'Calabresa, tomate, cebola, pimentão e mussarela' },
  { numero: 17, nome: 'Calabresa, milho, ervilha, pimentão e mussarela' },
  { numero: 18, nome: 'Calabresa, catupiry, milho e mussarela' },
  { numero: 19, nome: 'Calabresa, azeitonas e mussarela' },
  { numero: 20, nome: 'Presunto, ovo, cebola e mussarela' },
  { numero: 21, nome: 'Presunto, tomate, orégano, azeitonas e mussarela' },
  { numero: 22, nome: 'Presunto, ervilha, requeijão, ovo e mussarela' },
  { numero: 23, nome: 'Presunto, bacon, requeijão e mussarela' },
  { numero: 24, nome: 'Mussarela, parmesão, provolone e requeijão' },
  { numero: 25, nome: 'Mussarela, parmesão, provolone, requeijão e cheddar' },
  { numero: 26, nome: 'Mussarela e milho' },
  { numero: 27, nome: 'Palmito, mussarela e azeitonas' },
  { numero: 28, nome: 'Palmito, bacon, mussarela e parmesão' },
  { numero: 29, nome: 'Palmito, bacon, champignon e mussarela' },
  { numero: 30, nome: 'Atum, azeitonas e mussarela' },
  { numero: 31, nome: 'Lombo canadense, creme de leite, milho, tomate e mussarela' },
  { numero: 32, nome: 'Lombo canadense, parmesão, requeijão e mussarela' },
  { numero: 33, nome: 'Peito de peru defumado, requeijão e mussarela' },
]

export const pasteisSalgadosEspeciais: MenuItem[] = [
  { numero: 34, nome: 'Salame italiano, calabresa, tomate, orégano e mussarela' },
  { numero: 35, nome: 'Peperone, palmito, azeitonas e mussarela' },
  { numero: 36, nome: 'Camarão, mussarela e catupiry' },
]

export const pasteisDoces: MenuItem[] = [
  { numero: 37, nome: 'Banana com chocolate preto' },
  { numero: 38, nome: 'Banana com chocolate branco' },
  { numero: 39, nome: 'Banana com doce de leite' },
  { numero: 40, nome: 'Banana caramelizada com canela' },
  { numero: 41, nome: 'Doce de leite com queijo' },
  { numero: 42, nome: 'Coco com chocolate preto' },
  { numero: 43, nome: 'Coco com chocolate branco' },
  { numero: 44, nome: 'Chocolate preto com morangos' },
  { numero: 45, nome: 'Chocolate branco com morangos' },
  { numero: 46, nome: 'Chocolate oreo com morangos' },
]

export const pasteisPrecos = {
  tradicionais: '$8,00 +Tax',
  especiais: '$10,00 +Tax',
  doces: '$8,00 +Tax',
}

export const pasteisAviso =
  'Todos os pastéis são montados e fritos na hora. Você pode solicitar a retirada ou inclusão de ingredientes!'

// ---------- PIZZAS ----------

export const tamanhosPizza: TamanhoPizza[] = [
  {
    nome: 'Broto',
    fatias: 6,
    preco: '$27,00 +Tax',
    descricao: 'até 2 sabores tradicionais',
  },
  {
    nome: 'Grande',
    fatias: 8,
    preco: '$32,00 +Tax',
    descricao: 'até 2 sabores tradicionais',
  },
  {
    nome: 'Gigante',
    fatias: 12,
    preco: '$40,00 +Tax',
    descricao: 'até 3 sabores tradicionais + Refrigerante de brinde',
  },
]

export const pizzaBordaDestaque =
  'Todas as pizzas acompanham borda recheada inclusa (Cheddar, Catupiry, Chocolate ou Doce de Leite).'

export const pizzasSalgadasTradicionais: MenuItem[] = [
  { numero: 1, nome: 'A Moda do Pizzaiolo', descricao: 'Milho, ervilha, pimentão e calabresa.' },
  { numero: 2, nome: 'Atum', descricao: 'Atum e cebola.' },
  { numero: 3, nome: 'Bacon', descricao: 'Bacon.' },
  { numero: 4, nome: 'Bolonhesa', descricao: 'Carne moída ao molho bolonhesa, creme de leite e mussarela.' },
  { numero: 5, nome: 'Brócolis', descricao: 'Brócolis e requeijão.' },
  { numero: 6, nome: 'Caipira', descricao: 'Frango desfiado, bacon e milho.' },
  { numero: 7, nome: 'Calabresa', descricao: 'Calabresa e cebola.' },
  { numero: 8, nome: 'Catuperu', descricao: 'Peito de peru defumado e catupiry.' },
  { numero: 9, nome: 'Cinco Queijos', descricao: 'Mussarela, parmesão, requeijão, provolone e cheddar.' },
  { numero: 10, nome: 'Da Casa', descricao: 'Calabresa, pimentão picado, tomate e cebola.' },
  { numero: 11, nome: 'Estação', descricao: 'Lombo defumado, creme de leite, tomate e abacaxi.' },
  { numero: 12, nome: 'Francesa', descricao: 'Calabresa, ovo, bacon e cebola.' },
  { numero: 13, nome: 'Frango com Catupiry', descricao: 'Frango desfiado coberto com catupiry.' },
  { numero: 14, nome: 'Frango Supremo', descricao: 'Frango desfiado, tomate, creme de leite e milho verde.' },
  { numero: 15, nome: 'Humita', descricao: 'Parmesão e milho verde.' },
  { numero: 16, nome: 'Lombinho Supremo', descricao: 'Lombo defumado, parmesão, creme de leite, milho e tomate.' },
  { numero: 17, nome: 'Madre', descricao: 'Palmito, bacon e parmesão.' },
  { numero: 18, nome: 'Maracatu', descricao: 'Linguiça calabresa coberta com requeijão.' },
  { numero: 19, nome: 'Mista', descricao: 'Presunto, frango, palmito e ervilha.' },
  { numero: 20, nome: 'Mussarela', descricao: 'Mussarela e tomate.' },
  { numero: 21, nome: 'Napolitana', descricao: 'Presunto, tomate e mussarela.' },
  { numero: 22, nome: 'Pasqualina', descricao: 'Bacon, parmesão e requeijão.' },
  { numero: 23, nome: 'Portuguesa', descricao: 'Presunto, ovo e cebola.' },
  { numero: 24, nome: 'Quatro Queijos', descricao: 'Mussarela, parmesão, requeijão e provolone.' },
  { numero: 25, nome: 'Romana', descricao: 'Presunto picado, bacon e requeijão.' },
  { numero: 26, nome: 'Romanesca', descricao: 'Presunto, ervilha, requeijão e ovo.' },
  { numero: 27, nome: 'Vegetariana', descricao: 'Palmito, brócolis, tomate, champignon, parmesão e tomate seco.' },
  { numero: 28, nome: 'Toscana', descricao: 'Palmito, bacon e champignon.' },
]

export const pizzasSalgadasEspeciais: MenuItem[] = [
  { numero: 29, nome: 'Camarão', descricao: 'Camarão ao molho coberto com catupiry.', precoOverride: '+$1,00 por fatia' },
  { numero: 30, nome: 'Carioca', descricao: 'Filé mignon, tomate, cebola e alho.' },
  { numero: 31, nome: 'Filé com Cheddar', descricao: 'Filé mignon coberto com cheddar.' },
  { numero: 32, nome: 'Filé Quatro Queijos', descricao: 'Filé mignon, parmesão, provolone, requeijão e mussarela.' },
  { numero: 33, nome: 'Mignon', descricao: 'Filé mignon e parmesão.' },
  { numero: 34, nome: 'Strogonoff de Carne', descricao: 'Estrogonofe de filé mignon, champignon e batata palha.' },
]

export const pizzasDoces: MenuItem[] = [
  { numero: 35, nome: 'Abacaxi com Chocolate Branco', descricao: 'Abacaxi, mussarela, creme de leite e chocolate branco.' },
  { numero: 36, nome: 'Abacaxi Caramelizado com Canela', descricao: 'Abacaxi, mussarela, creme de leite com caramelo e canela.' },
  { numero: 37, nome: 'Banana com Chocolate Preto', descricao: 'Banana, mussarela, creme de leite e chocolate preto.' },
  { numero: 38, nome: 'Banana com Chocolate Branco', descricao: 'Banana, mussarela, creme de leite e chocolate branco.' },
  { numero: 39, nome: 'Banana Caramelizada com Canela', descricao: 'Banana, mussarela, creme de leite com caramelo e canela.' },
  { numero: 40, nome: 'Beijinho', descricao: 'Mussarela, creme de leite, coco, chocolate branco e leite condensado.' },
  { numero: 41, nome: 'Chocolate Branco', descricao: 'Mussarela, creme de leite e chocolate branco.' },
  { numero: 42, nome: 'Chocolate Preto', descricao: 'Mussarela, creme de leite e chocolate ao leite.' },
  { numero: 43, nome: 'Confete', descricao: 'Mussarela, creme de leite, chocolate ao leite e confetes.' },
  { numero: 44, nome: 'Kinder', descricao: 'Chocolate preto ou branco coberto com leite ninho.' },
  { numero: 45, nome: 'Krot', descricao: 'Mussarela, chocolate ao leite coberto com amendoim.' },
  { numero: 46, nome: 'Mesclada', descricao: 'Mussarela, creme de leite, chocolate branco e chocolate ao leite.' },
  { numero: 47, nome: 'Prestígio', descricao: 'Mussarela, creme de leite, coco e chocolate ao leite.' },
  { numero: 48, nome: 'Sedução', descricao: 'Mussarela, creme de leite, chocolate branco, morango e leite condensado.' },
  { numero: 49, nome: 'Sensação', descricao: 'Mussarela, creme de leite, chocolate ao leite e morango.' },
]

export const pizzaSalgadaAcompanha =
  'Todas as pizzas salgadas acompanham: molho de tomate, azeitonas, orégano e mussarela.'

// ---------- ESFIHAS ----------

export const combosEsfihas: ComboEsfiha[] = [
  {
    nome: 'Combo Eu',
    subtitulo: '7 Esfihas + 1 Refrigerante Lata',
    preco: '$23,00 +Tax',
    composicao: ['2 de carne', '2 de calabresa com queijo', '2 de frango com catupiry', '1 de quatro queijos'],
  },
  {
    nome: 'Combo Eu e Você',
    subtitulo: '15 Esfihas + 2 Refrigerante Lata',
    preco: '$51,00 +Tax',
    composicao: [
      '3 de carne',
      '3 de calabresa com queijo',
      '3 de frango com catupiry',
      '3 de quatro queijos',
      '3 de bacon com queijo',
    ],
  },
  {
    nome: 'Combo Nós',
    subtitulo: '20 Esfihas + 1 Refrigerante 2L',
    preco: '$60,00 +Tax',
    composicao: ['5 de carne', '5 de calabresa com queijo', '5 de frango com catupiry', '5 de quatro queijos'],
  },
  {
    nome: 'Combo Galera',
    subtitulo: '30 Esfihas + 1 Refrigerante 2L',
    preco: '$99,00 +Tax',
    composicao: [
      '5 de carne',
      '5 de calabresa com queijo',
      '5 de frango com catupiry',
      '5 de bacon com queijo',
      '5 de quatro queijos',
      '5 a sua escolha',
    ],
  },
]

export const esfihasSalgadas: MenuItem[] = [
  { numero: 1, nome: 'Calabresa com queijo' },
  { numero: 2, nome: 'Carne, tomate e cebola' },
  { numero: 3, nome: 'Frango com catupiry' },
  { numero: 4, nome: 'Bacon com queijo' },
  { numero: 5, nome: 'Brócolis com catupiry' },
  { numero: 6, nome: 'Atum, cebola e milho' },
  { numero: 7, nome: 'Brócolis, bacon e catupiry' },
  { numero: 8, nome: 'Calabresa, queijo e catupiry' },
  { numero: 9, nome: 'Quatro queijos' },
  { numero: 10, nome: 'Presunto, ovo, cebola e queijo' },
  { numero: 11, nome: 'Palmito, bacon e parmesão' },
  { numero: 12, nome: 'Camarão, queijo e catupiry', precoOverride: '$4,00 +Tax' },
  { numero: 13, nome: 'Espinafre com queijo', precoOverride: '$4,00 +Tax' },
]

export const esfihasSalgadasPrecoBase = '$3,50 +Tax'

export const esfihasDoces: MenuItem[] = [
  { numero: 14, nome: 'Abacaxi com chocolate branco' },
  { numero: 15, nome: 'Abacaxi caramelizado com canela' },
  { numero: 16, nome: 'Banana com chocolate preto' },
  { numero: 17, nome: 'Banana com chocolate branco' },
  { numero: 18, nome: 'Banana caramelizada com canela' },
  { numero: 19, nome: 'Beijinho' },
  { numero: 20, nome: 'Chocolate branco' },
  { numero: 21, nome: 'Chocolate preto' },
  { numero: 22, nome: 'Confete' },
  { numero: 23, nome: 'Kinder chocolate preto ou branco coberto com leite ninho' },
  { numero: 24, nome: 'Krot' },
  { numero: 25, nome: 'Mesclada' },
  { numero: 26, nome: 'Prestígio' },
  { numero: 27, nome: 'Sedução' },
  { numero: 28, nome: 'Sensação' },
  { numero: 29, nome: 'Tentação' },
  { numero: 30, nome: 'Romeu e Julieta' },
]

export const esfihasDocesPreco = '$4,00 +Tax'

export const esfihasAvisoVendaMinima =
  'Venda mínima de 5 esfihas individuais, podendo ser uma de cada sabor.'

// ---------- PORÇÕES / MASSAS ----------

export const porcoes: PorcaoItem[] = [
  { nome: 'Batata Frita', nomeEn: 'French Fries', preco: '$12,00 +Tax' },
  {
    nome: 'Batata Frita com Cheddar e Bacon',
    nomeEn: 'French Fries with Cheddar and Bacon',
    preco: '$17,00 +Tax',
  },
  { nome: 'Anéis de Cebola à Milanesa', nomeEn: 'Breaded Onion Rings', preco: '$14,00 +Tax' },
  { nome: 'Frango à Passarinho', nomeEn: 'Chicken Wings', preco: '$20,00 +Tax' },
  { nome: 'Mandioca Frita', preco: '$12,00 +Tax' },
  { nome: 'Mandioca Frita com Queijo Mussarela', preco: '$15,00 +Tax' },
  {
    nome: 'Tábua Frita',
    nomeEn: 'Fried Platter',
    preco: '$35,00 +Tax',
    descricao: 'Batata frita, frango à passarinho, anéis de cebola à milanesa, batata frita com cheddar e bacon.',
    descricaoEn: 'French fries, chicken wings, breaded onion rings, French fries with cheddar and bacon.',
  },
  {
    nome: 'Entrevero',
    nomeEn: 'Mixed Platter',
    preco: '$60,00 +Tax',
    descricao:
      'Carne de boi, frango, calabresa, barriguinha de porco, cebola, pimentão, batata frita, mandioca frita, anéis de cebola à milanesa, batata frita com cheddar e bacon, vinagrete e farofa. (300g de cada ingrediente)',
    descricaoEn:
      'Beef, chicken, brazilian sausage, pork belly, onion, bell pepper, French fries, fried cassava, breaded onion rings, French fries with cheddar and bacon, vinaigrette, and toasted manioc flour.',
  },
]

export const massas: PorcaoItem[] = [
  {
    nome: 'Macarrão na Chapa (900g)',
    nomeEn: 'Grilled Pasta',
    preco: '$19,00 +Tax',
    descricao:
      'Filé mignon, frango, calabresa, bacon, presunto, milho, tomate, pimentão, cebola, alho, azeitona, palmito, mussarela, cheiro verde e ovo frito.',
    descricaoEn:
      'Filet mignon, chicken, calabrese sausage, bacon, ham, corn, tomato, bell pepper, onion, garlic, olives, heart of palm, mozzarella, parsley, fried egg.',
  },
]
