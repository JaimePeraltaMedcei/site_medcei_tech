# Medcei Tech

Site comercial (B2B) da Medcei Tech, a tecnologia do grupo Medcei. Vende três produtos para
empresas de cuidados, por subscrição mensal: o CRM, a plataforma de recrutamento e a app para
famílias.

Endereço de produção: https://tech.medcei.pt

## Correr em local

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` gera o site final em `dist/`; `npm run preview` serve essa versão.

## Páginas

| Endereço                   | Ficheiro                            |
| -------------------------- | ----------------------------------- |
| `/`                        | `index.html`                        |
| `/produtos/`               | `produtos/index.html`               |
| `/produtos/crm/`           | `produtos/crm/index.html`           |
| `/produtos/recrutamento/`  | `produtos/recrutamento/index.html`  |
| `/produtos/app-familias/`  | `produtos/app-familias/index.html`  |
| `/precos/`                 | `precos/index.html`                 |
| `/sobre/`                  | `sobre/index.html`                  |
| `/ajuda/`                  | `ajuda/index.html`                  |
| `/contactos/`              | `contactos/index.html`              |
| página não encontrada      | `404.html`                          |

Cada `index.html` novo numa pasta passa a ser uma página: o `vite.config.js` encontra-as sozinho.

## Estrutura

```
partials/            blocos partilhados, incluídos com <!-- include:nome -->
  head.html          meta, favicon e script
  header.html        loader, cortina de transição, navegação e menu de produtos
  footer.html        rodapé com morada, redes e links legais
  cta.html           faixa final "Veja a funcionar"
  more-products.html os três produtos, no fim das páginas de produto
  day.html           cena "Um dia na app"
  ui/                ecrãs dos produtos recriados em HTML (crm-*, rh-*, app-*)
public/              imagens, favicon e _headers (Cloudflare)
src/main.js          ponto de entrada comum a todas as páginas
src/styles/          tokens, base, componentes, layout, secções, páginas, ui (ecrãs) e b2b
src/modules/         um módulo por comportamento; cada um só atua se a sua secção existir
src/data/day.js      eventos do "Um dia na app"
```

### Ecrãs dos produtos

As imagens dos produtos são recriações em HTML e CSS dos ecrãs reais do CRM
(`CRM Figma/Dev`), da Plataforma RH (`Plataforma RH`) e da app para famílias
(`CRM Figma/Dev/mobile`), com **dados fictícios**. Não se usaram capturas das plataformas
porque mostrariam dados reais de clientes e de saúde. Para mudar um ecrã, edite o ficheiro em
`partials/ui/`; o estilo está em `src/styles/ui.css`.

## Publicação (Cloudflare)

O site é servido pelo Cloudflare Workers como ficheiros estáticos (`wrangler.jsonc`), no domínio
`tech.medcei.pt`. Para publicar uma nova versão:

```bash
npm run build
npx wrangler deploy
```

A página 404 e as barras finais dos endereços são tratadas pelo Cloudflare (`not_found_handling` e
`html_handling`); `public/_headers` define a cache dos ficheiros em `/assets/`.

## Notas

- Quem tem "reduzir movimento" ativo vê o site completo sem animações nem scroll suave.
- O formulário de demonstração abre o email do visitante com o pedido pronto para
  geral@medcei.com; não há servidor. `/contactos/?interesse=CRM` pré-seleciona o produto.
- A confirmar antes de divulgar: o modelo de preço (por utilizadores, clientes ativos e vagas), o que
  está incluído na subscrição (implementação, migração, formação, suporte), se a app para famílias
  já está nas lojas, e a afirmação de que os produtos são usados na operação da Medcei.
