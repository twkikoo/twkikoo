# twkikoo

Loja online de peças artesanais em resina — **mockup interativo**, sem backend.

> Um projecto a 👩‍🎨👨‍🎨 em que o nosso 🐈‍⬛ é a ⭐️

Feito em React 19 + Tailwind CSS 4 + Framer Motion, com Vite. Não há servidor, base
de dados nem pagamentos: todo o estado (cesto, sessão, encomendas) vive em memória e
desaparece com um refresh. O objectivo é ver e navegar a interface.

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produção → dist/
```

## Navegar o protótipo

Como não há dados reais, existe um painel para saltar directamente para qualquer
vista ou estado: **⌘K / Ctrl+K**, ou o botão *Estados* no canto inferior esquerdo.
Dá acesso às sete vistas, aos modais, ao cesto cheio e ao ecrã de loading.

| Rota | Vista |
| --- | --- |
| `/` | Home — hero com parallax, história, destaques, secção do gato, processo |
| `/loja` | Catálogo com filtros por categoria e por cor, ordenação e skeletons |
| `/loja/:slug` | Página de produto — galeria, quantidade, adicionar ao cesto |
| `/diario` | Galeria em masonry (fotos, peças, cores, citações) com lightbox |
| `/checkout` | Checkout em três passos com resumo da encomenda |
| `/encomenda/:code` | Seguimento da encomenda com timeline (dá para simular passos) |
| `/apoio` | FAQ, chat de apoio e formulário de contacto |

Autenticação e cesto são *overlays*, disponíveis em qualquer rota.

## Publicar

O build usa caminhos relativos (`base: "./"` no Vite) e o router descobre sozinho
em que sub-caminho o `index.html` está, por isso `dist/` funciona tanto na raiz de
um domínio como numa sub-pasta — por exemplo em GitHub Pages:

```bash
npm run build     # → dist/, pronto a servir de qualquer sub-caminho
npm run preview   # serve o dist/ localmente para confirmar
```

Ligações directas (`/loja/estrela-ambar` escrito na barra do browser) exigem que o
servidor devolva o `index.html` para qualquer rota; num host estático sem essa
configuração entra-se pela raiz e navega-se dentro da aplicação.

## Decisões

**O loading é uma pata a amassar pão.** `PawLoader` não é um ciclo de keyframes: cada
batida alterna o estado das duas patas e é uma mola real que as leva lá, por isso o
esmagamento passa do ponto e assenta como uma pata assentaria. Aparece em três
tamanhos — `PawCurtain` (transições de página), `PawLoader` (inline) e `PawSpinner`
(dentro de botões e da timeline). Com `prefers-reduced-motion` a pata fica quieta.

**Molas, não durações.** `src/lib/motion.js` tem o vocabulário todo: `springSnap` para
carregar em coisas, `spring` para cartões e chips, `springSoft` para gavetas e modais,
`springBouncy` para o que deve ter peso. Durações só onde nada se move no espaço
(opacidade, cor, blur) — aí uma mola seria imperceptível.

**As peças são desenhadas, não fotografadas.** `ResinPiece` gera cada peça em SVG:
contornos paramétricos (r(θ) para flores, polígono com cantos arredondados para as
estrelas), inclusões — pintas e gipsófila prensada — colocadas por um RNG com semente
para a peça ser idêntica em todos os renders, e ferragem ancorada ao topo medido da
forma, para uma argola atravessar mesmo o buraco e o colar tocar mesmo no pendente. O
`viewBox` sai dessas medidas, que é o que mantém doze silhuetas diferentes com o mesmo
tamanho óptico dentro de um cartão. As três fotografias reais em `public/media` entram
no hero, no diário e nas galerias.

**Router próprio (~60 linhas).** As transições de página são metade do site, e ter a
navegação nossa significa controlar o instante exacto em que a cortina desce, em que a
página anterior sai e em que o scroll volta ao topo.

## Estrutura

```
src/
  App.jsx              shell, transições de página, cortina de loading
  lib/
    motion.js          molas e variantes partilhadas
    router.jsx         router + <Link>
    store.jsx          cesto, sessão, toasts, encomendas
    data.js            catálogo, diário, FAQ, passos de entrega
  components/
    PawLoader.jsx      a pata (cortina, inline, spinner)
    ResinPiece.jsx     gerador de peças em SVG
    ui.jsx             Button, Badge, Field, Accordion, Reveal, Marquee
    Navbar · Footer · CartDrawer · AuthModal · Toaster · ProductCard · StatePanel
  pages/               Home · Shop · Product · Journal · Checkout · Tracking · Support
```

## Entregas

Entregas pmp em Lisboa ou Alverca do Ribatejo — combinadas por mensagem, sem custos.
Para o resto do país, correio registado a 3,50 €, grátis acima de 40 €.
