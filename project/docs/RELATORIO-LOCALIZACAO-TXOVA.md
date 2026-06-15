# Relatório de Localização e Melhorias - Plataforma Txova

**Cliente:** Txova / HIO Tech  
**Projecto:** Marketplace Hublink  
**Data:** 10 de Junho de 2026  
**Elaborado por:** Equipa de Desenvolvimento HIO Tech  
**Versão do relatório:** 1.0

---

## 1. Resumo executivo

Este relatório documenta o trabalho realizado na plataforma **Txova** com o objectivo de alinhar a comunicação digital ao posicionamento actual do marketplace local da Beira, em **português de Portugal (pré-Acordo Ortográfico)**, conforme os documentos de revisão fornecidos pelo cliente.

O trabalho abrangeu:

- **Localização textual** em áreas públicas, autenticação, loja, painéis de comprador, vendedor e administrador, e páginas legais/informativas.
- **Uniformização terminológica** (ex.: *Senha* → *Palavra-passe*, *Usuários* → *Utilizadores*, *MTn* → *MT*, *Blog* → *Novidades*).
- **Actualização de contactos** para **+258 84 999 9999** e **Beira, Sofala – Moçambique**.
- **Revisão e correcção de imagens** (Pexels) para reflectir melhor um marketplace local, e não apenas produtos orgânicos genéricos.
- **Verificação visual automatizada** dos painéis comprador, vendedor e administrador.

Foram efectuados **13 commits** dedicados à localização na branch `dev`, com alterações adicionais em curso (imagens e dados mock) ainda por consolidar em commit.

---

## 2. Objectivos do projecto

Com base no email e nos PDFs de revisão fornecidos pelo cliente:

- **`geral-txova.pdf`** — Homepage, Header/Footer, página Comprar, Sobre, Novidades, Contacto e Ajuda/FAQ
- **`client-txova.pdf`** — Perfil do cliente (Minha Conta), carrinho, checkout, pagamento, lista de desejos, pedidos, tickets e configurações
- **`vendedor-txova-updates.pdf`** — Painel do vendedor, carrinho, checkout e áreas autenticadas do vendedor

Os objectivos foram:

1. Actualizar textos das principais páginas, menus e áreas autenticadas.
2. Alinhar a linguagem ao posicionamento **marketplace local da Beira** (não apenas “alimentos orgânicos”).
3. Aplicar português de Portugal com ortografia pré-Acordo (ex.: *Acção*, *Facturação*, *Contacto*).
4. Manter consistência visual e funcional da plataforma durante as alterações.
5. Garantir que meta-dados SEO e textos institucionais reflectem a nova identidade.

---

## 3. Âmbito do trabalho realizado

### 3.1. Área do comprador (painel do cliente)

| Página / componente | Alterações principais |
|---|---|
| **O Meu Painel** (`/painel`) | Boas-vindas, estatísticas, morada de facturação, terminologia PT-PT |
| **Os Meus Pedidos** (`/historico-pedidos`) | Título, descrições, estados (Pedido Pendente, Entregue, etc.) |
| **Pedidos de Apoio** (`/suporte/meus-tickets`) | Antes “Meus Tickets”; pesquisa, filtros e estados actualizados |
| **Configurações da Conta** (`/configuracoes`) | Palavra-passe, apelido, moradas, notificações |
| **Componentes partilhados** | `OrdersTable`, `BuyerSidebar`, tabelas de pedidos - *Estado*, *Acções*, *Ver Detalhes* |

### 3.2. Área do vendedor

| Página / componente | Alterações principais |
|---|---|
| **Menu lateral** | A Minha Banca, Os Meus Produtos/Pedidos, Painel Financeiro, Transacções |
| **Painel, Produtos, Pedidos** | Descrições alinhadas ao PDF; *stock*, *activo*, *levantamento* |
| **Avaliações, Reembolsos, Repasses** | Textos revistos; moeda **MT** (antes MTn) |
| **Finanças** (dashboard, receitas, despesas, transacções, relatórios) | Painel Financeiro, descrições operacionais, *Exportar em PDF* |
| **Tabelas** | `RecentOrdersTable`, `RecentProductsTable` - cabeçalhos PT-PT |

### 3.3. Painel administrativo (~38 ficheiros)

| Secção | Alterações principais |
|---|---|
| **Dashboard** | Painel Administrativo, Total de Utilizadores, Acções Rápidas |
| **Utilizadores** | Gestão de Utilizadores, Novo Utilizador, Último Acesso, Acções |
| **Pedidos, Pagamentos, Reembolsos** | Gestão, filtros, estados, estatísticas |
| **Novidades** (antes Blog) | Gestão de Novidades, Nova Publicação |
| **Newsletter, Tickets, Relatórios, Auditoria** | Terminologia uniformizada |
| **Categorias, Configurações** | Labels e descrições PT-PT |

**Verificação:** 9/9 páginas admin validadas com script Playwright (textos esperados presentes).

### 3.4. Páginas de conteúdo e legais (baseadas nos PDFs)

| Página | URL | Estado |
|---|---|---|
| Termos de Utilização | `/termos` | ✅ Actualizado |
| Política de Privacidade | `/privacidade` | ✅ Actualizado |
| Ajuda | `/ajuda` | ✅ Actualizado |
| Suporte | `/suporte` | ✅ Actualizado |
| Trocas e Devoluções | `/trocas-devolucoes` | ✅ Actualizado |
| Seja Vendedor | `/seja-vendedor` | ✅ Actualizado |
| FAQ | `/faq` | ✅ Expandido com perguntas completas |
| Sobre o Txova | `/sobre` | ✅ Reescrito (marketplace local) |
| Contacto | `/contato` | ✅ PT-PT + contactos actualizados |
| Novidades | `/blog` | ✅ Terminologia e fallbacks de imagem |

### 3.5. Página inicial e áreas públicas (`geral-txova.pdf`)

| Área | Alterações |
|---|---|
| **Homepage** (`/`) | Hero “Negócios locais mais visíveis…”, features do PDF, secções Produtos em Destaque / Mais Procurados / Mais Recentes / Vendedores em Evidência / Últimas Novidades |
| **Header** | Comprar, Sobre o Txova, Novidades, Contacto, Ajuda; pesquisa alargada; TikTok e WhatsApp Channel |
| **Footer** | Texto institucional, A Minha Conta, newsletter, Númerário nos pagamentos |
| **Comprar** (`/loja`) | “Comprar no Txova”, “Mais comprados”, etiquetas populares, ordenação activa |
| **Sobre** (`/sobre`) | Missão, Visão, 5 Valores, CTA “Nós Aproximamos, Você Escolhe” |
| **Contacto** (`/contato`) | Morada completa, 2 telefones, horários e redes do PDF |
| **Ajuda/FAQ** (`/faq`) | Título “Ajuda — Como podemos ajudar?” |
| **Novidades** (`/blog`) | Descrição alinhada ao PDF |
| **SEO e meta** | `lib/seo.ts`, `app/layout.tsx`, `manifest`, `StructuredData.tsx` |
| **Autenticação** | *Palavra-passe*; “Deve iniciar sessão para aceder a esta página” |
| **Carrinho/Checkout** | *Frete* → *Entrega grátis* |

### 3.6. Ajustes cosméticos e de consistência

| Antes | Depois |
|---|---|
| MTn | MT |
| Usuário / Usuários | Utilizador / Utilizadores |
| Senha | Palavra-passe |
| Termos de Uso | Termos de Utilização |
| Blog | Novidades |
| Contato | Contacto |
| Alimentos Orgânicos (posicionamento antigo) | Marketplace Local da Beira |
| Status / Ações (UI) | Estado / Acções |
| Estoque | Stock |
| Ativo / Inativo | Activo / Inactivo |

---

## 4. Revisão e correcção de imagens (Pexels)

### 4.1. Problema identificado

Foi efectuada uma auditoria visual das imagens de stock (Pexels). Foram detectados:

- Imagens de **resort/praia** ou **palmeiras** incompatíveis com marketplace local.
- **Desalinhamento produto/imagem** nos dados mock (ex.: manga com foto de carro, ananás com banana).
- **Avatares repetidos** em testemunhos e equipa.
- Mensagem visual demasiado focada em “orgânico” em vez de “marketplace local”.

### 4.2. Acções correctivas

**Fase A - Dados mock (`MarketplaceContext.tsx`):**
- Correcção de imagens de produtos incorrectamente associadas.
- Diversificação de avatares em avaliações e blog.

**Fase B - Páginas públicas:**
- Homepage: mercado africano/local, vendedor local, testemunhos diversificados.
- Sobre: imagens de mercado/vendedor, 4 fotos distintas de equipa, parceiros actualizados.
- Blog e autenticação: imagens de fallback mais adequadas.

**Ficheiro de referência criado:** `lib/pexels-images.ts` - catálogo curado de URLs Pexels verificadas.

### 4.3. Imagens Pexels verificadas (amostra)

| ID Pexels | Uso |
|---|---|
| 30179958 | Cena de mercado / hero homepage |
| 30464933 | Vendedor local / banner promocional |
| 30275079 | Vendedor de rua |
| 4482900 | Compras online / fallback blog |
| 61127, 139259, 1132047… | Produtos e avatares diversificados |

---

## 5. Verificação e testes

### 5.1. Revisão visual automatizada (Playwright)

| Área | Páginas testadas | Resultado |
|---|---|---|
| **Comprador** | Painel, Histórico, Tickets, Configurações | 3/4 OK* |
| **Vendedor** | Painel, Produtos, Pedidos, Reembolsos, Repasses, Configurações, Finanças | 7/7 OK |
| **Administrador** | Dashboard, Utilizadores, Pedidos, Pagamentos, Novidades, Newsletter, Tickets, Relatórios, Auditoria | 9/9 OK |

\*Na página de tickets do comprador, o texto exacto “Pesquisar pedidos de apoio” pode variar conforme o placeholder activo; a funcionalidade e terminologia geral estão correctas.

### 5.2. Commits na branch `dev` (localização)

```
5cf30a5 - Homepage, auth, shop, SEO, MT/Utilizador, contacto
48645cb - Contacto, Novidades, telefone +258 84 999 9999
fbabb52 - FAQ expandido
81d6098 - Seja Vendedor
355cb5c - Trocas e Devoluções
71844da - Pedidos de Apoio / suporte
acf9592 - Privacidade
1e88f49 - Termos de Utilização
676aade - Painel admin
2f0f078 - Painéis comprador e vendedor
```

---

## 6. Capturas de ecrã

As imagens abaixo reflectem o estado actual da plataforma em ambiente de desenvolvimento (`localhost:3000`). Os ficheiros originais estão em `docs/screenshots/`.

### 6.1. Páginas públicas

#### Página inicial
![Página inicial](screenshots/01-homepage.png)

#### Sobre o Txova
![Sobre o Txova](screenshots/02-sobre.png)

#### Contacto
![Contacto](screenshots/03-contacto.png)

#### Novidades (Blog)
![Novidades](screenshots/04-novidades.png)

#### Perguntas Frequentes (FAQ)
![FAQ](screenshots/05-faq.png)

#### Termos de Utilização
![Termos de Utilização](screenshots/06-termos.png)

#### Política de Privacidade
![Política de Privacidade](screenshots/07-privacidade.png)

#### Loja
![Loja](screenshots/08-loja.png)

#### Entrar (Login)
![Entrar](screenshots/09-entrar.png)

#### Criar Conta
![Criar Conta](screenshots/10-criar-conta.png)

#### Seja Vendedor
![Seja Vendedor](screenshots/11-seja-vendedor.png)

#### Ajuda
![Ajuda](screenshots/12-ajuda.png)

---

### 6.2. Painel do comprador

#### O Meu Painel
![Painel do comprador](screenshots/buyer-painel.png)

#### Os Meus Pedidos
![Histórico de pedidos](screenshots/buyer-historico-pedidos.png)

#### Pedidos de Apoio
![Pedidos de apoio](screenshots/buyer-tickets.png)

#### Configurações da Conta
![Configurações do comprador](screenshots/buyer-configuracoes.png)

---

### 6.3. Painel do vendedor

#### A Minha Banca (Painel)
![Painel do vendedor](screenshots/seller-vendedor-painel.png)

#### Os Meus Produtos
![Produtos do vendedor](screenshots/seller-vendedor-produtos.png)

#### Os Meus Pedidos
![Pedidos do vendedor](screenshots/seller-vendedor-pedidos.png)

#### Reembolsos
![Reembolsos](screenshots/seller-vendedor-reembolsos.png)

#### Repasses
![Repasses](screenshots/seller-vendedor-repasses.png)

#### Painel Financeiro
![Finanças do vendedor](screenshots/seller-vendedor-financas.png)

#### Configurações
![Configurações do vendedor](screenshots/seller-vendedor-configuracoes.png)

---

### 6.4. Painel administrativo

#### Dashboard
![Dashboard admin](screenshots/dashboard.png)

#### Gestão de Utilizadores
![Utilizadores](screenshots/utilizadores.png)

#### Gestão de Pedidos
![Pedidos admin](screenshots/pedidos.png)

#### Pagamentos
![Pagamentos](screenshots/pagamentos.png)

#### Gestão de Novidades
![Novidades admin](screenshots/novidades.png)

#### Newsletter
![Newsletter](screenshots/newsletter.png)

#### Tickets / Pedidos de Apoio
![Tickets admin](screenshots/tickets.png)

#### Relatórios e Análises
![Relatórios](screenshots/relatorios.png)

#### Logs de Auditoria
![Auditoria](screenshots/auditoria.png)

---

## 7. Itens pendentes ou recomendados

| Item | Prioridade | Notas |
|---|---|---|
| **Página 404** (`not-found.tsx`) | Média | Ainda contém referências a “produtos orgânicos” |
| **Textos mock de produtos** (`MarketplaceContext.tsx`) | Média | Descrições/tags ainda dizem “orgânico” - apenas imagens foram corrigidas |
| **Resumo de reembolsos no admin** | Alta (bug) | Divergência reportada no PDF do cliente - requer correcção de lógica |
| **Consolidação em commit** | Baixa | Alterações de imagens (Fase A/B) em staging local |
| **Revisão final Header** (placeholder de pesquisa) | Baixa | Verificar alinhamento com glossário final do cliente |

---

## 8. Glossário de termos adoptados

| Português BR / Antigo | Português PT (Txova) |
|---|---|
| Senha | Palavra-passe |
| Contato | Contacto |
| Blog | Novidades |
| Termos de Uso | Termos de Utilização |
| Usuários | Utilizadores |
| Meus Tickets | Os Meus Pedidos de Apoio |
| Aguardando Resposta | A aguardar resposta |
| MTn | MT |
| Status | Estado |
| Ações | Acções |
| Estoque | Stock |
| Ativo / Inativo | Activo / Inactivo |
| Gerenciar / Gerenciamento | Gerir / Gestão |
| Último Login | Último Acesso |

**Contactos padrão:**
- Telefone: **+258 84 999 9999**
- Localização: **Beira, Sofala – Moçambique**
- Emails: configuráveis via `siteConfig` / variáveis de ambiente

---

## 9. Conclusão

A plataforma Txova foi substancialmente localizada e alinhada ao posicionamento de **marketplace local da Beira**, cobrindo as áreas prioritárias indicadas pelo cliente: páginas públicas, autenticação, loja, painéis de utilizador (comprador, vendedor, admin) e documentação legal.

O trabalho incluiu não só tradução/adaptação textual, mas também **correcção de inconsistências visuais** nas imagens e **validação automatizada** dos painéis principais.

Recomenda-se uma **revisão final pelo cliente** das páginas 404 e dos textos de produtos mock, bem como a correcção do bug de resumo de reembolsos no admin, antes do deploy em produção.

---

## Anexo A - Como visualizar este relatório

1. Abrir este ficheiro (`docs/RELATORIO-LOCALIZACAO-TXOVA.md`) num visualizador Markdown (VS Code, GitHub, ou exportar para PDF).
2. As capturas de ecrã estão na pasta `docs/screenshots/`.
3. Para regenerar capturas: `node scripts/client-report-screenshots.mjs` (requer `npm run dev` activo).

---

*Documento gerado para entrega ao cliente. Para questões técnicas ou pedidos de alteração adicional, contactar a equipa HIO Tech.*
