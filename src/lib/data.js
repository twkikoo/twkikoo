import atelier01 from "../assets/atelier-01.webp";
import atelier02 from "../assets/atelier-02.webp";
import atelier03 from "../assets/atelier-03.webp";

export const BRAND = {
  name: "twkikoo",
  cat: "Kiko",
  tagline: "Um projecto a 👩‍🎨👨‍🎨 em que o nosso 🐈‍⬛ é a ⭐️",
  shipping: "Entregas pmp em Lisboa ou Alverca do Ribatejo",
  email: "ola@twkikoo.pt",
  instagram: "@twkikoo",
};

export const CATEGORIES = [
  { id: "todos", label: "Tudo", note: "a colecção inteira" },
  { id: "brincos", label: "Brincos", note: "argolas, pendentes, gotas" },
  { id: "colares", label: "Colares", note: "correntes de prata e aço" },
  { id: "conjuntos", label: "Conjuntos", note: "peças que combinam" },
  { id: "acessorios", label: "Acessórios", note: "para a casa e o molho de chaves" },
];

/**
 * `art` drives the generated resin illustration (see <ResinPiece />).
 * `photo` is used where we have a real studio shot of the piece.
 */
export const PRODUCTS = [
  {
    slug: "argolas-donut-cereja",
    name: "Argolas Donut Cereja",
    category: "brincos",
    price: 1800,
    badge: "Mais vendido",
    art: { shape: "donut", from: "#F2573E", to: "#B4241A", accent: "#FFD3C6", hardware: "gold" },
    photo: atelier01,
    tagline: "Vermelho de cereja madura, em argola dourada.",
    story:
      "A primeira peça que fizemos duas vezes: a primeira saiu com uma bolha no meio, a segunda saiu perfeita. Ficámos com as duas. O vermelho é misturado à mão, pigmento a pigmento, até ficar com aquele tom de compota que fica bem em qualquer pele.",
    details: ["Resina epóxi pigmentada à mão", "Argola em aço inoxidável dourado 20 mm", "Ø 22 mm · 3 g por brinco"],
    made: "3 a 5 dias",
  },
  {
    slug: "donut-confetti",
    name: "Donut Confetti",
    category: "brincos",
    price: 1950,
    art: { shape: "donut", from: "#FFE9A8", to: "#F4C445", accent: "#E23B22", speckles: 18, hardware: "gold" },
    photo: atelier01,
    tagline: "Mel translúcido com pintas que não se repetem.",
    story:
      "Cada ponto vermelho é colocado com um palito, um a um, enquanto a resina ainda escorre. É por isso que não existem dois pares iguais — e é por isso que demoramos uma tarde inteira a fazer seis.",
    details: ["Resina translúcida com pontos opacos", "Argola em aço inoxidável dourado 20 mm", "Ø 22 mm · 3 g por brinco"],
    made: "3 a 5 dias",
  },
  {
    slug: "flor-de-mel",
    name: "Flor de Mel",
    category: "brincos",
    price: 1750,
    art: { shape: "flower", from: "#FFE08A", to: "#EFB211", accent: "#FFF3CE", hardware: "gold" },
    photo: atelier01,
    tagline: "Seis pétalas, um miolo vazado, luz a passar.",
    story:
      "Feita num molde que desenhámos à mão e refizemos quatro vezes até as pétalas ficarem simétricas o suficiente para parecerem naturais — e tortas o suficiente para parecerem feitas por pessoas.",
    details: ["Resina translúcida cor de mel", "Argola em aço inoxidável dourado 20 mm", "Ø 24 mm · 3 g por brinco"],
    made: "3 a 5 dias",
  },
  {
    slug: "estrela-ambar",
    name: "Estrela Âmbar",
    category: "brincos",
    price: 1650,
    art: { shape: "star", from: "#FFD979", to: "#E39412", accent: "#FFF0C8", speckles: 10, hardware: "gold" },
    photo: atelier01,
    tagline: "A estrela — porque cá em casa já há uma.",
    story:
      "O Kiko dormiu em cima do molde destas antes de secarem. Ficou uma marca de pata numa delas. Essa não está à venda.",
    details: ["Resina âmbar com brilho suspenso", "Argola em aço inoxidável dourado 20 mm", "Ø 21 mm · 2,5 g por brinco"],
    made: "3 a 5 dias",
  },
  {
    slug: "conjunto-gota-jade",
    name: "Conjunto Gota de Jade",
    category: "conjuntos",
    price: 3900,
    badge: "Conjunto",
    art: { shape: "drop", from: "#2AA394", to: "#0E6F63", accent: "#FFFFFF", flowers: 7, hardware: "silver" },
    photo: atelier02,
    tagline: "Colar e brincos com gipsófila verdadeira.",
    story:
      "As flores são apanhadas, prensadas durante duas semanas entre páginas de um dicionário de 1982 e só depois entram na resina. O verde é feito em camadas: primeiro o fundo, depois as flores, depois o véu por cima.",
    details: [
      "Gipsófila seca e prensada por nós",
      "Prata 925 · corrente veneziana 45 cm",
      "Pendente 26 × 18 mm · brincos 18 × 13 mm",
    ],
    made: "5 a 7 dias",
  },
  {
    slug: "colar-gota-jade",
    name: "Colar Gota de Jade",
    category: "colares",
    price: 2600,
    art: { shape: "drop", from: "#2AA394", to: "#0E6F63", accent: "#FFFFFF", flowers: 7, hardware: "silver" },
    photo: atelier02,
    tagline: "Um pequeno jardim suspenso ao pescoço.",
    story:
      "A peça que mais nos pedem para repetir. Cada ramo de gipsófila é escolhido pelo desenho que faz contra a luz — o que quer dizer que ficamos muito tempo à janela com flores na mão.",
    details: ["Gipsófila seca e prensada por nós", "Prata 925 · corrente veneziana 45 cm", "Pendente 26 × 18 mm"],
    made: "5 a 7 dias",
  },
  {
    slug: "brincos-gota-jade",
    name: "Brincos Gota de Jade",
    category: "brincos",
    price: 1900,
    art: { shape: "drop", from: "#2AA394", to: "#0E6F63", accent: "#FFFFFF", flowers: 5, hardware: "silver" },
    photo: atelier02,
    tagline: "Leves ao ponto de dar para esquecer que os temos.",
    story:
      "Pesam menos de dois gramas cada. Feitos para quem tira os brincos ao fim do dia e se lembra que ainda os tinha postos.",
    details: ["Gipsófila seca e prensada por nós", "Ganchos em prata 925", "18 × 13 mm · 1,8 g por brinco"],
    made: "5 a 7 dias",
  },
  {
    slug: "lua-cobalto",
    name: "Lua Cobalto",
    category: "brincos",
    price: 2100,
    badge: "Novo",
    art: { shape: "disc", from: "#3BB6F0", to: "#0F74C4", accent: "#3E1BA6", satellite: true, hardware: "gold" },
    photo: atelier03,
    tagline: "Um disco azul e um ponto violeta a acompanhar.",
    story:
      "Nasceu de um erro: sobrou resina violeta de outra peça e, em vez de a deitar fora, fizemos discos minúsculos. Ficaram a pendurar por baixo dos azuis e passaram a ser o modelo de que mais gostamos.",
    details: ["Resina translúcida em duas cores", "Ganchos em aço inoxidável dourado", "Ø 22 mm + Ø 11 mm · 3 g por brinco"],
    made: "3 a 5 dias",
  },
  {
    slug: "colar-prado",
    name: "Colar Prado",
    category: "colares",
    price: 2800,
    art: { shape: "disc", from: "#FFF6E3", to: "#EBD7AE", accent: "#8C9A5B", flowers: 9, hardware: "gold" },
    tagline: "Flores do campo suspensas em resina clara.",
    story:
      "Feito com o que apanhamos nas caminhadas — trevo, erva-de-são-roberto, uma folha de funcho quando há sorte. Cada colar é o resumo de um passeio.",
    details: ["Flores silvestres secas", "Aço inoxidável dourado · corrente 45 cm", "Pendente Ø 24 mm"],
    made: "5 a 7 dias",
  },
  {
    slug: "colar-petala",
    name: "Colar Pétala",
    category: "colares",
    price: 2400,
    art: { shape: "flower", from: "#FBD9D0", to: "#E8917F", accent: "#FFFFFF", hardware: "silver" },
    tagline: "Rosa velho, mate, para usar todos os dias.",
    story:
      "Lixado à mão até perder o brilho. Fica com um toque de porcelana — o género de peça que se põe de manhã sem pensar e que dá para usar com tudo.",
    details: ["Resina com acabamento mate", "Prata 925 · corrente 42 cm", "Pendente Ø 20 mm"],
    made: "3 a 5 dias",
  },
  {
    slug: "porta-chaves-kiko",
    name: "Porta-chaves Kiko",
    category: "acessorios",
    price: 1500,
    badge: "Edição do gato",
    art: { shape: "paw", from: "#F4A83C", to: "#D1462F", accent: "#FFE6C9", hardware: "gold" },
    tagline: "A pata dele, em tamanho de bolso.",
    story:
      "Tirámos o molde de uma pegada que o Kiko deixou numa folha de papel de cozinha com farinha. Sim, foi tão confuso como parece.",
    details: ["Resina maciça pigmentada", "Argola e mosquetão dourados", "42 × 38 mm · 14 g"],
    made: "2 a 4 dias",
  },
  {
    slug: "imanes-jardim",
    name: "Ímanes Jardim",
    category: "acessorios",
    price: 1600,
    art: { shape: "flower", from: "#EAF1D6", to: "#B9CB8A", accent: "#FFFFFF", flowers: 4, hardware: "none" },
    tagline: "Conjunto de quatro, para o frigorífico ficar bonito.",
    story:
      "Começaram como restos de resina que não davam para brincos. Agora são a peça que mais oferecemos — ninguém tem um frigorífico a menos.",
    details: ["Quatro ímanes sortidos", "Íman de neodímio ao centro", "Ø 32 mm cada"],
    made: "2 a 4 dias",
  },
];

export function findProduct(slug) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export const JOURNAL = [
  {
    id: "p1",
    kind: "photo",
    src: atelier01,
    span: "tall",
    caption: "Domingo de manhã, a bancada toda em vermelho e amarelo.",
    likes: 214,
    tag: "bancada",
  },
  {
    id: "p2",
    kind: "quote",
    text: "Se cabe na resina e não se mexe, provavelmente já tentámos.",
    tag: "regras da casa",
  },
  {
    id: "p3",
    kind: "photo",
    src: atelier02,
    span: "tall",
    caption: "Gipsófila prensada há duas semanas. Valeu a espera.",
    likes: 389,
    tag: "flores",
  },
  {
    id: "p4",
    kind: "art",
    art: { shape: "star", from: "#FFD979", to: "#E39412", accent: "#FFF0C8", speckles: 8, hardware: "gold" },
    caption: "Estrela nº 4. As três primeiras ficaram com bolhas.",
    likes: 122,
    tag: "processo",
  },
  {
    id: "p5",
    kind: "cat",
    caption: "Controlo de qualidade a dormir em serviço.",
    likes: 941,
    tag: "kiko",
  },
  {
    id: "p6",
    kind: "swatch",
    colors: ["#D1462F", "#E7A11A", "#17877A", "#1580CE", "#3E1BA6"],
    caption: "A paleta deste Outono. Nada de castanhos, prometemos.",
    tag: "cor",
  },
  {
    id: "p7",
    kind: "photo",
    src: atelier03,
    span: "tall",
    caption: "Azul sobre azul, e um violeta que sobrou de outra peça.",
    likes: 276,
    tag: "cor",
  },
  {
    id: "p8",
    kind: "art",
    art: { shape: "drop", from: "#2AA394", to: "#0E6F63", accent: "#FFFFFF", flowers: 6, hardware: "silver" },
    caption: "Primeira camada de verde a curar. Faltam mais duas.",
    likes: 168,
    tag: "processo",
  },
  {
    id: "p9",
    kind: "note",
    title: "48 horas",
    text: "É o tempo que a resina leva a curar. Não há atalho, e já tentámos todos.",
    tag: "atelier",
  },
  {
    id: "p10",
    kind: "art",
    art: { shape: "paw", from: "#F4A83C", to: "#D1462F", accent: "#FFE6C9", hardware: "gold" },
    caption: "A pata oficial. Aprovada pelo próprio.",
    likes: 502,
    tag: "kiko",
  },
  {
    id: "p11",
    kind: "swatch",
    colors: ["#FBD9D0", "#E8917F", "#EAF1D6", "#B9CB8A"],
    caption: "A tentar acertar no rosa velho. Terceira tentativa.",
    tag: "cor",
  },
  {
    id: "p12",
    kind: "quote",
    text: "O Kiko não ajuda. O Kiko supervisiona.",
    tag: "kiko",
  },
];

export const FAQ = [
  {
    q: "Quanto tempo demora a minha encomenda?",
    a: "Cada peça é feita depois de encomendada. Contamos 3 a 7 dias de atelier, mais o tempo de entrega. A ficha de cada peça diz o tempo de produção dela.",
  },
  {
    q: "Como funcionam as entregas?",
    a: "Entregas pmp em Lisboa ou Alverca do Ribatejo — combinamos ponto e hora por mensagem, sem custos. Para o resto do país enviamos por correio registado (3,50 €), grátis acima de 40 €.",
  },
  {
    q: "A resina estraga-se?",
    a: "Não, mas não gosta de sol directo durante horas nem de água quente. Guarde as peças na bolsinha de algodão que vai na encomenda e duram anos sem amarelecer.",
  },
  {
    q: "Posso pedir uma cor ou uma flor específica?",
    a: "Sim, e é o que mais gostamos de fazer. Escreva-nos pelo formulário de apoio ou por Instagram com a ideia — respondemos em 24 h com um esboço e um preço.",
  },
  {
    q: "As peças são hipoalergénicas?",
    a: "Os ganchos e argolas são em aço inoxidável cirúrgico ou prata 925. Se tiver pele sensível diga-nos: trocamos os ferrages sem custo.",
  },
  {
    q: "E se não servir ou não gostar?",
    a: "Tem 14 dias para trocar ou devolver, desde que a peça volte como foi. Peças personalizadas não têm devolução — mas falamos sempre antes de as fazer.",
  },
];

export const TRACKING_STEPS = [
  { id: "recebida", label: "Encomenda recebida", note: "Pagámos um café a celebrar." },
  { id: "atelier", label: "Em produção no atelier", note: "A resina está a curar. 48 h, sem atalhos." },
  { id: "curada", label: "Curada e polida", note: "Lixada à mão, do grão 400 ao 3000." },
  { id: "caminho", label: "A caminho de si", note: "Embrulhada em algodão e papel kraft." },
  { id: "entregue", label: "Entregue", note: "Mande-nos uma foto. Adoramos ver as peças na rua." },
];
