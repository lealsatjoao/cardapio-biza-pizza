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
      naturalJuice: 'Sucos naturais preparados com polpa de fruta.',
      sodaSizes: 'Disponível em Lata ou 2 Litros.',
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
      naturalJuice: 'Natural juices made from fruit pulp.',
      sodaSizes: 'Available in Can or 2L.',
    },
  },
} as const

export type Lang = 'pt' | 'en'
export type Translations = (typeof translations)['pt']
