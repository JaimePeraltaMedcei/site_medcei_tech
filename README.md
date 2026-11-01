# Medcei Tech

Site da Medcei Tech, a tecnologia do grupo Medcei: SafeMove, SmartDose, WoundCare e Super App,
com páginas para organizações de saúde, preços, ajuda e contactos.

Endereço de produção: https://tech.medcei.pt

## Correr em local

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` gera o site final em `dist/`; `npm run preview` serve essa versão.

## Páginas

| Endereço                 | Ficheiro                          |
| ------------------------ | --------------------------------- |
| `/`                      | `index.html`                      |
| `/produtos/`             | `produtos/index.html`             |
| `/produtos/safemove/`    | `produtos/safemove/index.html`    |
| `/produtos/smartdose/`   | `produtos/smartdose/index.html`   |
| `/produtos/woundcare/`   | `produtos/woundcare/index.html`   |
| `/produtos/super-app/`   | `produtos/super-app/index.html`   |
| `/organizacoes/`         | `organizacoes/index.html`         |
| `/precos/`               | `precos/index.html`               |
| `/sobre/`                | `sobre/index.html`                |
| `/ajuda/`                | `ajuda/index.html`                |
| `/contactos/`            | `contactos/index.html`            |
| página não encontrada    | `404.html`                        |

Cada `index.html` novo numa pasta passa a ser uma página: o `vite.config.js` encontra-as sozinho.

## Estrutura

```
partials/          blocos partilhados, incluídos com <!-- include:nome -->
  head.html        meta, favicon e script
  header.html      loader, cortina de transição, navegação e menu de produtos
  footer.html      rodapé com morada, redes e links legais
  cta.html         faixa final "Vamos falar?"
  audience.html    famílias e organizações (páginas de produto)
  day.html         cena "Um dia em casa"
  report.html      relatório WoundCare
public/            imagens, favicon e _headers (Cloudflare)
src/main.js        ponto de entrada comum a todas as páginas
src/styles/        tokens, base, componentes, layout, secções e páginas
src/modules/       um módulo por comportamento; cada um só atua se a sua secção existir
src/data/day.js    eventos do "Um dia em casa"
```

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
- O formulário abre o email do visitante com a mensagem pronta para geral@medcei.com; não há servidor.
  Links para `/contactos/?para=organizacao&interesse=SmartDose` preenchem o formulário.
- Conteúdos a confirmar: preço de 24,90 €/mês e condições, o dia da D. Amélia e o relatório WoundCare
  (exemplos), os passos "Como funciona" de cada produto e a lista de tipos de organização.
