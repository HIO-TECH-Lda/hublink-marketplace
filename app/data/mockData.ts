export const mockProducts = [
  {
    id: '1',
    name: 'Repolho Chinês Orgânico',
    price: 12.90,
    originalPrice: 16.90,
    image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Verduras',
    rating: 4.5,
    inStock: true,
    brand: 'Fazenda Verde',
    sku: 'ORG001',
    description: 'Repolho chinês orgânico, cultivado sem agrotóxicos. Rico em vitaminas e minerais.',
    tags: ['orgânico', 'verdura', 'saudável']
  },
  {
    id: '2',
    name: 'Tomates Orgânicos',
    price: 8.50,
    originalPrice: 11.50,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Verduras',
    rating: 4.8,
    inStock: true,
    brand: 'Bio Horta',
    sku: 'ORG002',
    description: 'Tomates orgânicos frescos, ideais para saladas e pratos diversos.',
    tags: ['orgânico', 'tomate', 'fresco']
  },
  {
    id: '3',
    name: 'Cenouras Orgânicas',
    price: 6.90,
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Verduras',
    rating: 4.6,
    inStock: true,
    brand: 'Fazenda Verde',
    sku: 'ORG003',
    description: 'Cenouras orgânicas doces e crocantes, ricas em betacaroteno.',
    tags: ['orgânico', 'cenoura', 'vitamina A']
  },
  {
    id: '4',
    name: 'Brócolis Orgânico',
    price: 9.90,
    originalPrice: 13.90,
    image: 'https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Verduras',
    rating: 4.7,
    inStock: true,
    brand: 'Bio Horta',
    sku: 'ORG004',
    description: 'Brócolis orgânico fresco, fonte de vitaminas C e K.',
    tags: ['orgânico', 'brócolis', 'vitaminas']
  },
  {
    id: '5',
    name: 'Alface Americana Orgânica',
    price: 4.50,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Verduras',
    rating: 4.3,
    inStock: true,
    brand: 'Fazenda Verde',
    sku: 'ORG005',
    description: 'Alface americana orgânica, crocante e saborosa.',
    tags: ['orgânico', 'alface', 'salada']
  },
  {
    id: '6',
    name: 'Maçãs Orgânicas',
    price: 14.90,
    originalPrice: 18.90,
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Frutas',
    rating: 4.9,
    inStock: true,
    brand: 'Pomar Natural',
    sku: 'ORG006',
    description: 'Maçãs orgânicas doces e suculentas, ricas em fibras.',
    tags: ['orgânico', 'maçã', 'fruta']
  },
  {
    id: '7',
    name: 'Bananas Orgânicas',
    price: 7.90,
    image: 'https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Frutas',
    rating: 4.4,
    inStock: false,
    brand: 'Pomar Natural',
    sku: 'ORG007',
    description: 'Bananas orgânicas maduras, fonte de potássio e energia.',
    tags: ['orgânico', 'banana', 'potássio']
  },
  {
    id: '8',
    name: 'Leite Orgânico Integral',
    price: 8.90,
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Laticínios',
    rating: 4.6,
    inStock: true,
    brand: 'Fazenda Limpa',
    sku: 'ORG008',
    description: 'Leite orgânico integral, livre de hormônios e antibióticos.',
    tags: ['orgânico', 'leite', 'integral']
  }
];

export const mockCategories = [
  { id: '1', name: 'Frutas & Verduras', count: 45 },
  { id: '2', name: 'Carnes Orgânicas', count: 23 },
  { id: '3', name: 'Laticínios', count: 18 },
  { id: '4', name: 'Grãos & Cereais', count: 32 },
  { id: '5', name: 'Bebidas', count: 15 },
  { id: '6', name: 'Pães & Biscoitos', count: 27 },
];

export const mockBlogPosts = [
  {
    id: '1',
    title: 'Os Benefícios dos Alimentos Orgânicos',
    excerpt: 'Descubra por que escolher alimentos orgânicos pode transformar sua saúde e bem-estar.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '2024-01-15',
    category: 'Saúde'
  },
  {
    id: '2',
    title: 'Receitas Deliciosas com Vegetais Orgânicos',
    excerpt: 'Aprenda a preparar pratos incríveis usando nossos vegetais orgânicos frescos.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '2024-01-12',
    category: 'Receitas'
  },
  {
    id: '3',
    title: 'Agricultura Sustentável: Nosso Compromisso',
    excerpt: 'Conheça nossas práticas sustentáveis e como contribuímos para um planeta mais verde.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '2024-01-10',
    category: 'Sustentabilidade'
  }
];

export const mockTestimonials = [
  {
    id: '1',
    name: 'Maria Silva',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Produtos de excelente qualidade! Realmente orgânicos e frescos. Recomendo!'
  },
  {
    id: '2',
    name: 'João Santos',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Melhor loja de orgânicos que já comprei. Entrega rápida e produtos sempre frescos.'
  },
  {
    id: '3',
    name: 'Ana Costa',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Amo fazer compras aqui! Produtos orgânicos de verdade com preços justos.'
  }
];

export const mockTeam = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    position: 'Fundador & CEO',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    name: 'Laura Mendes',
    position: 'Gerente de Qualidade',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '3',
    name: 'Pedro Lima',
    position: 'Coordenador de Logística',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '4',
    name: 'Fernanda Rocha',
    position: 'Especialista em Sustentabilidade',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
  }
];