export const translations = {
  pt: {
    salonMenu: 'Cardápio do Salão',
    tabs: { pasteis: 'Pastéis', pizzas: 'Pizzas', esfihas: 'Esfihas', porcoes: 'Porções / Massas', bebidas: 'Bebidas' },
    subtabs: {
      salgados: 'Salgados',
      doces: 'Doces',
      tradicionais: 'Tradicionais',
      especiais: 'Especiais',
      combos: 'Combos',
      massas: 'Massas',
      porcoes: 'Porções',
      refrigerantes: 'Refrigerantes',
      sucos: 'Sucos',
      agua: 'Água',
    },
    flavors: 'Sabores',
    anyFlavor: 'Qualquer sabor',
    sizes: {
      title: 'Tamanhos',
      broto: 'Broto 6 fatias (até 2 sabores tradicionais)',
      grande: 'Grande 8 fatias (até 2 sabores tradicionais)',
      gigante: 'Gigante 12 fatias (até 3 sabores tradicionais + Refrigerante de brinde)',
      crustNotice:
        'Todas as pizzas acompanham borda recheada inclusa (Cheddar, Catupiry, Chocolate ou Doce de Leite).',
    },
    notices: {
      esfihaMin: 'Venda mínima de 5 esfihas individuais, podendo ser uma de cada sabor.',
      pastelFresh:
        'Todos os pastéis são montados e fritos na hora. Você pode solicitar a retirada ou inclusão de ingredientes!',
      pizzaToppings: 'Todas as pizzas salgadas acompanham: molho de tomate, azeitonas, orégano e mussarela.',
    },
    bebidas: {
      soda2L: 'Refrigerante 2 Litros',
      soda600: 'Refrigerante 600 ml',
      sodaCan: 'Refrigerante Lata (350ml)',
      zeroSugar: 'Zero Açúcar',
      juiceNatural: 'Suco de Polpa Natural',
      juiceNaturalNotice: 'Preparado com polpa natural de fruta.',
      juiceCarton: 'Suco de Caixa 1L',
      water: 'Água Mineral 500ml',
    },
  },
  en: {
    salonMenu: 'Dine-in Menu',
    tabs: { pasteis: 'Pastries', pizzas: 'Pizzas', esfihas: 'Esfihas', porcoes: 'Appetizers & Pasta', bebidas: 'Beverages' },
    subtabs: {
      salgados: 'Savory',
      doces: 'Sweet',
      tradicionais: 'Traditional',
      especiais: 'Specials',
      combos: 'Combos',
      massas: 'Pasta',
      porcoes: 'Appetizers',
      refrigerantes: 'Sodas',
      sucos: 'Juices',
      agua: 'Water',
    },
    flavors: 'Flavors',
    anyFlavor: 'Any flavor',
    sizes: {
      title: 'Sizes',
      broto: 'Personal 6 slices (up to 2 traditional flavors)',
      grande: 'Large 8 slices (up to 2 traditional flavors)',
      gigante: 'Giant 12 slices (up to 3 traditional flavors + Free Soda)',
      crustNotice: 'All pizzas include free stuffed crust (Cheddar, Catupiry, Chocolate or Dulce de Leche).',
    },
    notices: {
      esfihaMin: 'Minimum order of 5 individual esfihas, can be one of each flavor.',
      pastelFresh: 'Freshly made and fried to order. Ingredients can be removed or customized upon request!',
      pizzaToppings: 'All savory pizzas come with: tomato sauce, olives, oregano and mozzarella.',
    },
    bebidas: {
      soda2L: '2-Liter Soda',
      soda600: '600ml Soda',
      sodaCan: 'Can Soda (350ml)',
      zeroSugar: 'Zero Sugar',
      juiceNatural: 'Natural Fruit Pulp Juice',
      juiceNaturalNotice: 'Made from natural fruit pulp.',
      juiceCarton: '1-Liter Carton Juice',
      water: 'Bottled Spring Water 500ml',
    },
  },
} as const

export type Lang = 'pt' | 'en'
export type Translations = (typeof translations)['pt']
