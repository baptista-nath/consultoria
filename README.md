# Landing Page — Inturion (Black Friday)

Arquivos gerados: página estática de alta conversão para promoção Black Friday (40% OFF) com foco em agendamentos de consultoria para a marca Inturion.

Arquivos principais

- `index.html` — Estrutura da landing.
- `assets/styles.css` — Estilos (mobile-first, tema escuro premium).
- `assets/script.js` — Contador regressivo, submissão mock do formulário, modal de vídeo e microinterações.
- `assets/logo.svg` — Logo gerada para Inturion.

Como abrir

1. Abra o arquivo `index.html` no navegador (duplo clique ou via servidor local).
2. Para testar um servidor local simples (recomendado para evitar restrições CORS em extensões):

```bash
python3 -m http.server 8000
# então abra http://localhost:8000
```

Personalização rápida

- Troque a data do contador em `assets/script.js`.
- Substitua placeholders de clientes, testemunhos e o `VIDEO_ID` do thumbnail por conteúdo real.
- Integre o formulário com seu backend trocando o bloco de envio por um fetch para sua API.

Próximos passos recomendados

- Substituir o logo/avatars por imagens profissionais e otimizar com `srcset` e `webp`.
- Integrar o formulário com Calendly, HubSpot, Pipedrive ou um endpoint próprio.
- A/B test de títulos e CTAs; medir conversões (eventos de formulário e cliques nos CTAs).

Adicionar/alterar a imagem de fundo da hero

- A página agora usa uma imagem de fundo na seção hero com uma sobreposição preta semitransparente, mantendo o tom Black Friday mas adicionando profundidade visual.
- Para trocar a imagem, edite a regra `.hero-decor` em `assets/styles.css` e substitua a URL em `background-image` pela sua imagem (recomendo usar imagem otimizada, `w=1800` ou `webp`).
- Exemplo de substituição (CSS):

```css
.hero-decor { background-image: url('https://meudominio.com/minha-imagem.webp'); }
```

Observação: a sobreposição preta está configurada com `background: rgba(0,0,0,0.56)` no pseudo-elemento `::after` — ajuste o alfa para clarear/escurecer.
# Landing Page — Christian Ferreira (Black Friday)

# Landing Page — Inturion (Black Friday)

Arquivos gerados: página estática de alta conversão para promoção Black Friday (40% OFF) com foco em agendamentos de consultoria para a marca Inturion.

 Arquivos principais
 `index.html` — Estrutura da landing.
 `assets/styles.css` — Estilos (mobile-first, tema escuro premium).
 `assets/script.js` — Contador regressivo, submissão mock do formulário e microinterações.

Como abrir
1. Abra o arquivo `index.html` no navegador (duplo clique ou via servidor local).
2. Para testar um servidor local simples (recomendado para evitar restrições CORS em extensões):

```bash
python3 -m http.server 8000
# então abra http://localhost:8000
```

Personalização rápida
- Troque a data do contador em `assets/script.js`.
- Substitua placeholders de clientes e testemunhos por conteúdo real.
- Integre o formulário com seu backend trocando o bloco de envio por um fetch para sua API.

- Substitua placeholders de clientes, testemunhos e o `VIDEO_ID` do thumbnail por conteúdo real.
- Adicionar imagens profissionais do Christian e logos reais dos clientes.
- Integrar com Calendly/HubSpot/LeadConnector para agendamento automático.
- Otimizar imagens e usar lazy-loading.
- A/B test de CTAs, cores de destaque (dourado vs vermelho) e texto do título.
