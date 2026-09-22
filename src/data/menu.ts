export interface MenuItem {
  numero: number
  nome: string
  nomeEn?: string
  descricao?: string
  descricaoEn?: string
  precoOverride?: string
}

export interface ComboEsfiha {
  nome: string
  nomeEn: string
  subtitulo: string
  subtituloEn: string
  preco: string
  composicao: string[]
  composicaoEn: string[]
  /** Refrigerante incluso no combo (sem custo extra) — tamanho e quantas latas/garrafas a pessoa escolhe. */
  sodaType: 'lata' | '2l'
  sodaQty: number
}

export interface PorcaoItem {
  nome: string
  nomeEn?: string
  preco: string
  descricao?: string
  descricaoEn?: string
}

export function localizePrice(price: string, lang: 'pt' | 'en'): string {
  if (lang === 'pt') return price
  return price.replace(',', '.').replace('por fatia', 'per slice')
}

export function itemName(item: MenuItem, lang: 'pt' | 'en'): string {
  return lang === 'en' && item.nomeEn ? item.nomeEn : item.nome
}

export function itemDescription(item: MenuItem, lang: 'pt' | 'en'): string | undefined {
  return lang === 'en' ? item.descricaoEn ?? item.descricao : item.descricao
}

// ---------- PASTÉIS ----------

export const pasteisSalgadosTradicionais: MenuItem[] = [
  { numero: 1, nome: 'Carne, ovos e mussarela', nomeEn: 'Ground beef, boiled eggs and mozzarella' },
  { numero: 2, nome: 'Carne, cebola, tomate, gotas de limão e mussarela', nomeEn: 'Ground beef, onion, tomato, a splash of lime and mozzarella' },
  { numero: 3, nome: 'Carne, catupiry e mussarela', nomeEn: 'Ground beef, Catupiry cream cheese and mozzarella' },
  { numero: 4, nome: 'Carne, cheddar e mussarela', nomeEn: 'Ground beef, cheddar and mozzarella' },
  { numero: 5, nome: 'Carne, bacon, mussarela e cheddar', nomeEn: 'Ground beef, bacon, mozzarella and cheddar' },
  { numero: 6, nome: 'Frango, catupiry e mussarela', nomeEn: 'Shredded chicken, Catupiry cream cheese and mozzarella' },
  { numero: 7, nome: 'Frango, cheddar e mussarela', nomeEn: 'Shredded chicken, cheddar and mozzarella' },
  { numero: 8, nome: 'Frango, milho, bacon e mussarela', nomeEn: 'Shredded chicken, corn, bacon and mozzarella' },
  { numero: 9, nome: 'Frango, creme de leite, milho, tomate e mussarela', nomeEn: 'Shredded chicken, heavy cream, corn, tomato and mozzarella' },
  { numero: 10, nome: 'Frango, palmito, ervilha, presunto e mussarela', nomeEn: 'Shredded chicken, heart of palm, peas, ham and mozzarella' },
  { numero: 11, nome: 'Frango, milho, brócolis e mussarela', nomeEn: 'Shredded chicken, corn, broccoli and mozzarella' },
  { numero: 12, nome: 'Frango, brócolis, bacon, catupiry e mussarela', nomeEn: 'Shredded chicken, broccoli, bacon, Catupiry cream cheese and mozzarella' },
  { numero: 13, nome: 'Calabresa, cheddar e mussarela', nomeEn: 'Brazilian sausage, cheddar and mozzarella' },
  { numero: 14, nome: 'Calabresa, catupiry e mussarela', nomeEn: 'Brazilian sausage, Catupiry cream cheese and mozzarella' },
  { numero: 15, nome: 'Calabresa, bacon, ovo, cebola e mussarela', nomeEn: 'Brazilian sausage, bacon, egg, onion and mozzarella' },
  { numero: 16, nome: 'Calabresa, tomate, cebola, pimentão e mussarela', nomeEn: 'Brazilian sausage, tomato, onion, bell pepper and mozzarella' },
  { numero: 17, nome: 'Calabresa, milho, ervilha, pimentão e mussarela', nomeEn: 'Brazilian sausage, corn, peas, bell pepper and mozzarella' },
  { numero: 18, nome: 'Calabresa, catupiry, milho e mussarela', nomeEn: 'Brazilian sausage, Catupiry cream cheese, corn and mozzarella' },
  { numero: 19, nome: 'Calabresa, azeitonas e mussarela', nomeEn: 'Brazilian sausage, olives and mozzarella' },
  { numero: 20, nome: 'Presunto, ovo, cebola e mussarela', nomeEn: 'Ham, egg, onion and mozzarella' },
  { numero: 21, nome: 'Presunto, tomate, orégano, azeitonas e mussarela', nomeEn: 'Ham, tomato, oregano, olives and mozzarella' },
  { numero: 22, nome: 'Presunto, ervilha, requeijão, ovo e mussarela', nomeEn: 'Ham, peas, cream cheese, egg and mozzarella' },
  { numero: 23, nome: 'Presunto, bacon, requeijão e mussarela', nomeEn: 'Ham, bacon, cream cheese and mozzarella' },
  { numero: 24, nome: 'Mussarela, parmesão, provolone e requeijão', nomeEn: 'Mozzarella, parmesan, provolone and cream cheese' },
  { numero: 25, nome: 'Mussarela, parmesão, provolone, requeijão e cheddar', nomeEn: 'Mozzarella, parmesan, provolone, cream cheese and cheddar' },
  { numero: 26, nome: 'Mussarela e milho', nomeEn: 'Mozzarella and corn' },
  { numero: 27, nome: 'Palmito, mussarela e azeitonas', nomeEn: 'Heart of palm, mozzarella and olives' },
  { numero: 28, nome: 'Palmito, bacon, mussarela e parmesão', nomeEn: 'Heart of palm, bacon, mozzarella and parmesan' },
  { numero: 29, nome: 'Palmito, bacon, champignon e mussarela', nomeEn: 'Heart of palm, bacon, mushrooms and mozzarella' },
  { numero: 30, nome: 'Atum, azeitonas e mussarela', nomeEn: 'Tuna, olives and mozzarella' },
  { numero: 31, nome: 'Lombo canadense, creme de leite, milho, tomate e mussarela', nomeEn: 'Canadian bacon, heavy cream, corn, tomato and mozzarella' },
  { numero: 32, nome: 'Lombo canadense, parmesão, requeijão e mussarela', nomeEn: 'Canadian bacon, parmesan, cream cheese and mozzarella' },
  { numero: 33, nome: 'Peito de peru defumado, requeijão e mussarela', nomeEn: 'Smoked turkey breast, cream cheese and mozzarella' },
]

export const pasteisSalgadosEspeciais: MenuItem[] = [
  { numero: 34, nome: 'Salame italiano, calabresa, tomate, orégano e mussarela', nomeEn: 'Italian salami, Brazilian sausage, tomato, oregano and mozzarella' },
  { numero: 35, nome: 'Peperone, palmito, azeitonas e mussarela', nomeEn: 'Pepperoni, heart of palm, olives and mozzarella' },
  { numero: 36, nome: 'Camarão, mussarela e catupiry', nomeEn: 'Shrimp, mozzarella and Catupiry cream cheese' },
]

export const pasteisDoces: MenuItem[] = [
  { numero: 37, nome: 'Banana com chocolate preto', nomeEn: 'Banana with dark chocolate' },
  { numero: 38, nome: 'Banana com chocolate branco', nomeEn: 'Banana with white chocolate' },
  { numero: 39, nome: 'Banana com doce de leite', nomeEn: 'Banana with dulce de leche' },
  { numero: 40, nome: 'Banana caramelizada com canela', nomeEn: 'Caramelized banana with cinnamon' },
  { numero: 41, nome: 'Doce de leite com queijo', nomeEn: 'Dulce de leche with cheese' },
  { numero: 42, nome: 'Coco com chocolate preto', nomeEn: 'Coconut with dark chocolate' },
  { numero: 43, nome: 'Coco com chocolate branco', nomeEn: 'Coconut with white chocolate' },
  { numero: 44, nome: 'Chocolate preto com morangos', nomeEn: 'Dark chocolate with strawberries' },
  { numero: 45, nome: 'Chocolate branco com morangos', nomeEn: 'White chocolate with strawberries' },
  { numero: 46, nome: 'Chocolate oreo com morangos', nomeEn: 'Oreo chocolate with strawberries' },
]

export const pasteisPrecos = {
  tradicionais: '$8,00 +Tax',
  especiais: '$10,00 +Tax',
  doces: '$8,00 +Tax',
}

// ---------- PIZZAS ----------

export const pizzaSizePrices = {
  broto: '$27,00 +Tax',
  grande: '$32,00 +Tax',
  gigante: '$40,00 +Tax',
}

// Fatias e limite de sabores por tamanho — usado pra dividir o pedaço/sabor e
// calcular o adicional (ex: $1,00 por fatia) só na fração do sabor escolhido.
export const pizzaSizeConfig = {
  broto: { fatias: 6, maxSabores: 2 },
  grande: { fatias: 8, maxSabores: 2 },
  gigante: { fatias: 12, maxSabores: 3 },
}

// Bordas recheadas inclusas (sem custo extra) em todas as pizzas, qualquer tamanho.
export const bordaOpcoes: { nome: string; nomeEn: string }[] = [
  { nome: 'Catupiry', nomeEn: 'Catupiry' },
  { nome: 'Cheddar', nomeEn: 'Cheddar' },
  { nome: 'Mussarela', nomeEn: 'Mozzarella' },
  { nome: 'Chocolate', nomeEn: 'Chocolate' },
  { nome: 'Doce de Leite', nomeEn: 'Dulce de Leche' },
]

export interface PizzaAdicional {
  nome: string
  nomeEn: string
  // 'inteira': $1 fixo pra pizza inteira, não importa o tamanho.
  // 'pedaco': $1 por fatia — na pizza de 1 sabor só, cai automaticamente na pizza inteira;
  // em pizza de 2/3 sabores, a pessoa escolhe se é na pizza inteira ou só num dos sabores.
  tipo: 'inteira' | 'pedaco'
}

export const pizzaAdicionais: PizzaAdicional[] = [
  { nome: 'Ervilha', nomeEn: 'Peas', tipo: 'inteira' },
  { nome: 'Milho', nomeEn: 'Corn', tipo: 'inteira' },
  { nome: 'Tomate', nomeEn: 'Tomato', tipo: 'inteira' },
  { nome: 'Brócolis', nomeEn: 'Broccoli', tipo: 'inteira' },
  { nome: 'Ovo', nomeEn: 'Egg', tipo: 'inteira' },
  { nome: 'Pimentão', nomeEn: 'Bell Pepper', tipo: 'inteira' },
  { nome: 'Cebola', nomeEn: 'Onion', tipo: 'inteira' },
  { nome: 'Mussarela', nomeEn: 'Mozzarella', tipo: 'pedaco' },
  { nome: 'Presunto', nomeEn: 'Ham', tipo: 'pedaco' },
  { nome: 'Bacon', nomeEn: 'Bacon', tipo: 'pedaco' },
  { nome: 'Calabresa', nomeEn: 'Sausage', tipo: 'pedaco' },
  { nome: 'Carne', nomeEn: 'Beef', tipo: 'pedaco' },
  { nome: 'Frango', nomeEn: 'Chicken', tipo: 'pedaco' },
  { nome: 'Palmito', nomeEn: 'Heart of Palm', tipo: 'pedaco' },
]

export const pizzasSalgadasTradicionais: MenuItem[] = [
  { numero: 1, nome: 'A Moda do Pizzaiolo', descricao: 'Milho, ervilha, pimentão e calabresa.', descricaoEn: 'Corn, peas, bell pepper and Brazilian sausage.' },
  { numero: 2, nome: 'Atum', descricao: 'Atum e cebola.', descricaoEn: 'Tuna and onion.' },
  { numero: 3, nome: 'Bacon', descricao: 'Bacon.', descricaoEn: 'Bacon.' },
  { numero: 4, nome: 'Bolonhesa', descricao: 'Carne moída ao molho bolonhesa, creme de leite e mussarela.', descricaoEn: 'Ground beef in bolognese sauce, heavy cream and mozzarella.' },
  { numero: 5, nome: 'Brócolis', descricao: 'Brócolis e requeijão.', descricaoEn: 'Broccoli and cream cheese.' },
  { numero: 6, nome: 'Caipira', descricao: 'Frango desfiado, bacon e milho.', descricaoEn: 'Shredded chicken, bacon and corn.' },
  { numero: 7, nome: 'Calabresa', descricao: 'Calabresa e cebola.', descricaoEn: 'Brazilian sausage and onion.' },
  { numero: 8, nome: 'Catuperu', descricao: 'Peito de peru defumado e catupiry.', descricaoEn: 'Smoked turkey breast and Catupiry cream cheese.' },
  { numero: 9, nome: 'Cinco Queijos', descricao: 'Mussarela, parmesão, requeijão, provolone e cheddar.', descricaoEn: 'Mozzarella, parmesan, cream cheese, provolone and cheddar.' },
  { numero: 10, nome: 'Da Casa', descricao: 'Calabresa, pimentão picado, tomate e cebola.', descricaoEn: 'Brazilian sausage, diced bell pepper, tomato and onion.' },
  { numero: 11, nome: 'Estação', descricao: 'Lombo defumado, creme de leite, tomate e abacaxi.', descricaoEn: 'Smoked pork loin, heavy cream, tomato and pineapple.' },
  { numero: 12, nome: 'Francesa', descricao: 'Calabresa, ovo, bacon e cebola.', descricaoEn: 'Brazilian sausage, egg, bacon and onion.' },
  { numero: 13, nome: 'Frango com Catupiry', descricao: 'Frango desfiado coberto com catupiry.', descricaoEn: 'Shredded chicken topped with Catupiry cream cheese.' },
  { numero: 14, nome: 'Frango Supremo', descricao: 'Frango desfiado, tomate, creme de leite e milho verde.', descricaoEn: 'Shredded chicken, tomato, heavy cream and sweet corn.' },
  { numero: 15, nome: 'Humita', descricao: 'Parmesão e milho verde.', descricaoEn: 'Parmesan and sweet corn.' },
  { numero: 16, nome: 'Lombinho Supremo', descricao: 'Lombo defumado, parmesão, creme de leite, milho e tomate.', descricaoEn: 'Smoked pork loin, parmesan, heavy cream, corn and tomato.' },
  { numero: 17, nome: 'Madre', descricao: 'Palmito, bacon e parmesão.', descricaoEn: 'Heart of palm, bacon and parmesan.' },
  { numero: 18, nome: 'Maracatu', descricao: 'Linguiça calabresa coberta com requeijão.', descricaoEn: 'Brazilian sausage topped with cream cheese.' },
  { numero: 19, nome: 'Mista', descricao: 'Presunto, frango, palmito e ervilha.', descricaoEn: 'Ham, chicken, heart of palm and peas.' },
  { numero: 20, nome: 'Mussarela', descricao: 'Mussarela e tomate.', descricaoEn: 'Mozzarella and tomato.' },
  { numero: 21, nome: 'Napolitana', descricao: 'Presunto, tomate e mussarela.', descricaoEn: 'Ham, tomato and mozzarella.' },
  { numero: 22, nome: 'Pasqualina', descricao: 'Bacon, parmesão e requeijão.', descricaoEn: 'Bacon, parmesan and cream cheese.' },
  { numero: 23, nome: 'Portuguesa', descricao: 'Presunto, ovo e cebola.', descricaoEn: 'Ham, egg and onion.' },
  { numero: 24, nome: 'Quatro Queijos', descricao: 'Mussarela, parmesão, requeijão e provolone.', descricaoEn: 'Mozzarella, parmesan, cream cheese and provolone.' },
  { numero: 25, nome: 'Romana', descricao: 'Presunto picado, bacon e requeijão.', descricaoEn: 'Diced ham, bacon and cream cheese.' },
  { numero: 26, nome: 'Romanesca', descricao: 'Presunto, ervilha, requeijão e ovo.', descricaoEn: 'Ham, peas, cream cheese and egg.' },
  { numero: 27, nome: 'Vegetariana', descricao: 'Palmito, brócolis, tomate, champignon, parmesão e tomate seco.', descricaoEn: 'Heart of palm, broccoli, tomato, mushrooms, parmesan and sun-dried tomato.' },
  { numero: 28, nome: 'Toscana', descricao: 'Palmito, bacon e champignon.', descricaoEn: 'Heart of palm, bacon and mushrooms.' },
]

export const pizzasSalgadasEspeciais: MenuItem[] = [
  { numero: 29, nome: 'Camarão', descricao: 'Camarão ao molho coberto com catupiry.', descricaoEn: 'Shrimp in sauce topped with Catupiry cheese.', precoOverride: '+$1,00 por fatia' },
  { numero: 30, nome: 'Carioca', descricao: 'Filé mignon, tomate, cebola e alho.', descricaoEn: 'Filet mignon, tomato, onion and garlic.' },
  { numero: 31, nome: 'Filé com Cheddar', descricao: 'Filé mignon coberto com cheddar.', descricaoEn: 'Filet mignon topped with cheddar.' },
  { numero: 32, nome: 'Filé Quatro Queijos', descricao: 'Filé mignon, parmesão, provolone, requeijão e mussarela.', descricaoEn: 'Filet mignon, parmesan, provolone, cream cheese and mozzarella.' },
  { numero: 33, nome: 'Mignon', descricao: 'Filé mignon e parmesão.', descricaoEn: 'Filet mignon and parmesan.' },
  { numero: 34, nome: 'Strogonoff de Carne', descricao: 'Estrogonofe de filé mignon, champignon e batata palha.', descricaoEn: 'Beef stroganoff with filet mignon, mushrooms and crispy potato sticks.' },
]

export const pizzasDoces: MenuItem[] = [
  { numero: 35, nome: 'Abacaxi com Chocolate Branco', descricao: 'Abacaxi, mussarela, creme de leite e chocolate branco.', descricaoEn: 'Pineapple, mozzarella, heavy cream and white chocolate.' },
  { numero: 36, nome: 'Abacaxi Caramelizado com Canela', descricao: 'Abacaxi, mussarela, creme de leite com caramelo e canela.', descricaoEn: 'Pineapple, mozzarella, heavy cream with caramel and cinnamon.' },
  { numero: 37, nome: 'Banana com Chocolate Preto', descricao: 'Banana, mussarela, creme de leite e chocolate preto.', descricaoEn: 'Banana, mozzarella, heavy cream and dark chocolate.' },
  { numero: 38, nome: 'Banana com Chocolate Branco', descricao: 'Banana, mussarela, creme de leite e chocolate branco.', descricaoEn: 'Banana, mozzarella, heavy cream and white chocolate.' },
  { numero: 39, nome: 'Banana Caramelizada com Canela', descricao: 'Banana, mussarela, creme de leite com caramelo e canela.', descricaoEn: 'Banana, mozzarella, heavy cream with caramel and cinnamon.' },
  { numero: 40, nome: 'Beijinho', descricao: 'Mussarela, creme de leite, coco, chocolate branco e leite condensado.', descricaoEn: 'Mozzarella, heavy cream, coconut, white chocolate and condensed milk.' },
  { numero: 41, nome: 'Chocolate Branco', descricao: 'Mussarela, creme de leite e chocolate branco.', descricaoEn: 'Mozzarella, heavy cream and white chocolate.' },
  { numero: 42, nome: 'Chocolate Preto', descricao: 'Mussarela, creme de leite e chocolate ao leite.', descricaoEn: 'Mozzarella, heavy cream and milk chocolate.' },
  { numero: 43, nome: 'Confete', descricao: 'Mussarela, creme de leite, chocolate ao leite e confetes.', descricaoEn: 'Mozzarella, heavy cream, milk chocolate and chocolate sprinkles.' },
  { numero: 44, nome: 'Kinder', descricao: 'Chocolate preto ou branco coberto com leite ninho.', descricaoEn: 'Dark or white chocolate topped with milk powder.' },
  { numero: 45, nome: 'Krot', descricao: 'Mussarela, chocolate ao leite coberto com amendoim.', descricaoEn: 'Mozzarella, milk chocolate topped with peanuts.' },
  { numero: 46, nome: 'Mesclada', descricao: 'Mussarela, creme de leite, chocolate branco e chocolate ao leite.', descricaoEn: 'Mozzarella, heavy cream, white chocolate and milk chocolate.' },
  { numero: 47, nome: 'Prestígio', descricao: 'Mussarela, creme de leite, coco e chocolate ao leite.', descricaoEn: 'Mozzarella, heavy cream, coconut and milk chocolate.' },
  { numero: 48, nome: 'Sedução', descricao: 'Mussarela, creme de leite, chocolate branco, morango e leite condensado.', descricaoEn: 'Mozzarella, heavy cream, white chocolate, strawberry and condensed milk.' },
  { numero: 49, nome: 'Sensação', descricao: 'Mussarela, creme de leite, chocolate ao leite e morango.', descricaoEn: 'Mozzarella, heavy cream, milk chocolate and strawberry.' },
]

// ---------- ESFIHAS ----------

export const combosEsfihas: ComboEsfiha[] = [
  {
    nome: 'Combo Eu',
    nomeEn: 'Solo Combo',
    subtitulo: '7 Esfihas + 1 Refrigerante Lata',
    subtituloEn: '7 Esfihas + 1 Canned Soda',
    preco: '$23,00 +Tax',
    composicao: ['2 de carne', '2 de calabresa com queijo', '2 de frango com catupiry', '1 de quatro queijos'],
    composicaoEn: ['2 beef', '2 sausage with cheese', '2 chicken with Catupiry', '1 four cheese'],
    sodaType: 'lata',
    sodaQty: 1,
  },
  {
    nome: 'Combo Eu e Você',
    nomeEn: 'Me & You Combo',
    subtitulo: '15 Esfihas + 2 Refrigerante Lata',
    subtituloEn: '15 Esfihas + 2 Canned Sodas',
    preco: '$51,00 +Tax',
    composicao: [
      '3 de carne',
      '3 de calabresa com queijo',
      '3 de frango com catupiry',
      '3 de quatro queijos',
      '3 de bacon com queijo',
    ],
    composicaoEn: [
      '3 beef',
      '3 sausage with cheese',
      '3 chicken with Catupiry',
      '3 four cheese',
      '3 bacon with cheese',
    ],
    sodaType: 'lata',
    sodaQty: 2,
  },
  {
    nome: 'Combo Nós',
    nomeEn: 'Us Combo',
    subtitulo: '20 Esfihas + 1 Refrigerante 2L',
    subtituloEn: '20 Esfihas + 1 2L Soda',
    preco: '$60,00 +Tax',
    composicao: ['5 de carne', '5 de calabresa com queijo', '5 de frango com catupiry', '5 de quatro queijos'],
    composicaoEn: ['5 beef', '5 sausage with cheese', '5 chicken with Catupiry', '5 four cheese'],
    sodaType: '2l',
    sodaQty: 1,
  },
  {
    nome: 'Combo Galera',
    nomeEn: 'Squad Combo',
    subtitulo: '30 Esfihas + 1 Refrigerante 2L',
    subtituloEn: '30 Esfihas + 1 2L Soda',
    preco: '$99,00 +Tax',
    composicao: [
      '5 de carne',
      '5 de calabresa com queijo',
      '5 de frango com catupiry',
      '5 de bacon com queijo',
      '5 de quatro queijos',
      '5 a sua escolha',
    ],
    composicaoEn: [
      '5 beef',
      '5 sausage with cheese',
      '5 chicken with Catupiry',
      '5 bacon with cheese',
      '5 four cheese',
      '5 of your choice',
    ],
    sodaType: '2l',
    sodaQty: 1,
  },
]

export const esfihasSalgadas: MenuItem[] = [
  { numero: 1, nome: 'Calabresa com queijo', nomeEn: 'Sausage with cheese' },
  { numero: 2, nome: 'Carne, tomate e cebola', nomeEn: 'Beef, tomato and onion' },
  { numero: 3, nome: 'Frango com catupiry', nomeEn: 'Chicken with Catupiry' },
  { numero: 4, nome: 'Bacon com queijo', nomeEn: 'Bacon with cheese' },
  { numero: 5, nome: 'Brócolis com catupiry', nomeEn: 'Broccoli with Catupiry' },
  { numero: 6, nome: 'Atum, cebola e milho', nomeEn: 'Tuna, onion and corn' },
  { numero: 7, nome: 'Brócolis, bacon e catupiry', nomeEn: 'Broccoli, bacon and Catupiry' },
  { numero: 8, nome: 'Calabresa, queijo e catupiry', nomeEn: 'Sausage, cheese and Catupiry' },
  { numero: 9, nome: 'Quatro queijos', nomeEn: 'Four cheese' },
  { numero: 10, nome: 'Presunto, ovo, cebola e queijo', nomeEn: 'Ham, egg, onion and cheese' },
  { numero: 11, nome: 'Palmito, bacon e parmesão', nomeEn: 'Heart of palm, bacon and parmesan' },
  { numero: 12, nome: 'Camarão, queijo e catupiry', nomeEn: 'Shrimp, cheese and Catupiry', precoOverride: '$4,00 +Tax' },
  { numero: 13, nome: 'Espinafre com queijo', nomeEn: 'Spinach with cheese', precoOverride: '$4,00 +Tax' },
]

export const esfihasSalgadasPrecoBase = '$3,50 +Tax'

export const esfihasDoces: MenuItem[] = [
  { numero: 14, nome: 'Abacaxi com chocolate branco', nomeEn: 'Pineapple with white chocolate' },
  { numero: 15, nome: 'Abacaxi caramelizado com canela', nomeEn: 'Caramelized pineapple with cinnamon' },
  { numero: 16, nome: 'Banana com chocolate preto', nomeEn: 'Banana with dark chocolate' },
  { numero: 17, nome: 'Banana com chocolate branco', nomeEn: 'Banana with white chocolate' },
  { numero: 18, nome: 'Banana caramelizada com canela', nomeEn: 'Caramelized banana with cinnamon' },
  { numero: 19, nome: 'Beijinho' },
  { numero: 20, nome: 'Chocolate branco', nomeEn: 'White chocolate' },
  { numero: 21, nome: 'Chocolate preto', nomeEn: 'Dark chocolate' },
  { numero: 22, nome: 'Confete' },
  { numero: 23, nome: 'Kinder chocolate preto ou branco coberto com leite ninho', nomeEn: 'Kinder dark or white chocolate topped with milk powder' },
  { numero: 24, nome: 'Krot' },
  { numero: 25, nome: 'Mesclada' },
  { numero: 26, nome: 'Prestígio' },
  { numero: 27, nome: 'Sedução' },
  { numero: 28, nome: 'Sensação' },
  { numero: 29, nome: 'Tentação' },
  { numero: 30, nome: 'Romeu e Julieta' },
]

export const esfihasDocesPreco = '$4,00 +Tax'

// ---------- PORÇÕES / MASSAS ----------

export const porcoes: PorcaoItem[] = [
  { nome: 'Batata Frita', nomeEn: 'French Fries', preco: '$12,00 +Tax' },
  {
    nome: 'Batata Frita com Cheddar e Bacon',
    nomeEn: 'French Fries with Melted Cheddar and Bacon',
    preco: '$17,00 +Tax',
  },
  { nome: 'Anéis de Cebola à Milanesa', nomeEn: 'Breaded Onion Rings', preco: '$14,00 +Tax' },
  { nome: 'Frango à Passarinho', nomeEn: 'Crispy Garlic Fried Chicken Wings', preco: '$20,00 +Tax' },
  { nome: 'Mandioca Frita', nomeEn: 'Fried Cassava', preco: '$12,00 +Tax' },
  { nome: 'Mandioca Frita com Queijo Mussarela', nomeEn: 'Fried Cassava with Mozzarella Cheese', preco: '$15,00 +Tax' },
  {
    nome: 'Tábua Frita',
    nomeEn: 'Fried Platter',
    preco: '$35,00 +Tax',
    descricao: 'Batata frita, frango à passarinho, anéis de cebola à milanesa, batata frita com cheddar e bacon.',
    descricaoEn: 'French fries, crispy fried chicken wings, breaded onion rings, French fries with melted cheddar and bacon.',
  },
  {
    // Nome tradicional mantido intacto (PT e EN)
    nome: 'Entrevero',
    preco: '$60,00 +Tax',
    descricao:
      'Carne de boi, frango, calabresa, barriguinha de porco, cebola, pimentão, batata frita, mandioca frita, anéis de cebola à milanesa, batata frita com cheddar e bacon, vinagrete e farofa. (300g de cada ingrediente)',
    descricaoEn:
      'Beef, chicken, Brazilian sausage, pork belly, onion, bell pepper, French fries, fried cassava, breaded onion rings, French fries with melted cheddar and bacon, vinaigrette, and toasted cassava flour. (300g of each ingredient)',
  },
]

export const massas: PorcaoItem[] = [
  {
    // Nome tradicional mantido intacto (PT e EN)
    nome: 'Macarrão na Chapa (900g)',
    preco: '$19,00 +Tax',
    descricao:
      'Filé mignon, frango, calabresa, bacon, presunto, milho, tomate, pimentão, cebola, alho, azeitona, palmito, mussarela, cheiro verde e ovo frito.',
    descricaoEn:
      'Filet mignon, chicken, Brazilian sausage, bacon, ham, corn, tomato, bell pepper, onion, garlic, olives, heart of palm, mozzarella, parsley, fried egg.',
  },
]

// ---------- BEBIDAS ----------

export interface Bebida {
  nome: string
  nomeEn?: string
  preco?: string
}

export interface Sabor {
  nome: string
  preco?: string // presente só quando o sabor foge do preço base do tamanho
}

export interface RefrigeranteTamanho {
  key: string
  preco: string
  sabores: Sabor[]
  saboresZero?: Sabor[]
}

export const refrigerantes: RefrigeranteTamanho[] = [
  {
    key: '2l',
    preco: '$6,00 +Tax',
    sabores: [
      { nome: 'Pepsi' },
      { nome: 'Fanta' },
      { nome: 'Sprite' },
      { nome: 'Guaraná Antarctica', preco: '$7,00 +Tax' },
      { nome: 'Coca-Cola', preco: '$7,00 +Tax' },
    ],
    saboresZero: [
      { nome: 'Pepsi Zero' },
      { nome: 'Guaraná Antarctica Zero', preco: '$7,00 +Tax' },
      { nome: 'Coca-Cola Zero', preco: '$7,00 +Tax' },
    ],
  },
  {
    key: '500ml',
    preco: '$4,00 +Tax',
    sabores: [{ nome: 'Coca-Cola' }, { nome: 'Coca-Cola Zero' }, { nome: 'Fanta' }, { nome: 'Sprite' }],
  },
  {
    key: 'lata',
    preco: '$3,00 +Tax',
    sabores: [
      { nome: 'Pepsi' },
      { nome: 'Coca-Cola' },
      { nome: 'Coca-Cola Zero' },
      { nome: 'Fanta' },
      { nome: 'Sprite' },
      { nome: 'Pepsi Zero' },
      { nome: 'Guaraná Antarctica' },
      { nome: 'Guaraná Antarctica Zero' },
    ],
  },
]

export const sucoNaturalPreco = '$6,00 +Tax'

export const sucosNaturais: Bebida[] = [
  { nome: 'Maracujá', nomeEn: 'Passion Fruit' },
  { nome: 'Abacaxi', nomeEn: 'Pineapple' },
  { nome: 'Morango', nomeEn: 'Strawberry' },
  { nome: 'Manga', nomeEn: 'Mango' },
  { nome: 'Goiaba', nomeEn: 'Guava' },
]

export const sucosCaixa: Bebida[] = [
  { nome: 'Manga', nomeEn: 'Mango' },
  { nome: 'Pêssego', nomeEn: 'Peach' },
  { nome: 'Maçã', nomeEn: 'Apple' },
]

export const aguaMineral: Bebida = {
  nome: 'Água Mineral Garrafa (500 ml)',
  nomeEn: 'Bottled Spring Water (500ml)',
  preco: '$2,00 +Tax',
}

export const aguaComGas: Bebida = {
  nome: 'Água com Gás (500 ml)',
  nomeEn: 'Sparkling Water (500ml)',
  preco: '$3,00 +Tax',
}
