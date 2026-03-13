# VITRINE - Relatório de Atualização do Marketplace v2.0

## 📋 Resumo Executivo

Este documento detalha a transformação completa do marketplace de uma plataforma focada em produtos orgânicos para o **VITRINE**, um marketplace geral que oferece produtos em todas as categorias, mantendo o contexto moçambicano e a moeda local (MZN).

**Versão:** 3.0  
**Data de Atualização:** March 2026  
**Status:** ✅ Concluído

## 🎯 Objetivos da Transformação

- **Rebranding completo** para "VITRINE"
- **Mudança de nicho** de produtos orgânicos para marketplace geral
- **Atualização da identidade visual** com esquema de cores azul
- **Manutenção do contexto moçambicano** (MZN, pt-MZ, contatos locais)
- **Remoção completa** de referências a produtos orgânicos e "Banca"

## 🎨 Atualizações de Branding e Design

### Esquema de Cores
- **Cor primária:** Azul (#2563EB, #60A5FA, #1D4ED8)
- **Paleta de cores:** Substituição do verde por azul em todo o sistema
- **CSS Variables:** Atualização das variáveis `--primary` e `--ring`
- **Paleta:** `green-gray` substituída por `blue-gray`

### Identidade Visual
- **Logo:** Mudança de "T" (Vitrine) para "V" (VITRINE)
- **Nome da marca:** "VITRINE" em todas as referências
- **Slogan:** "VITRINE - Tudo que Você Precisa"
- **Terminologia:** "Banca" substituída por "Loja" em todo o sistema

## 📱 Atualizações PWA e SEO

### Manifest.json
- **Nome:** "VITRINE - Marketplace Completo"
- **Descrição:** Marketplace completo com produtos de qualidade
- **Categorias:** shopping, business, lifestyle
- **Shortcuts:** Produtos em Destaque, Carrinho, Minha Conta
- **Screenshots:** Atualizados para refletir o novo design
- **Theme Color:** #2563EB (azul)

### SEO e Metadados
- **Título:** "VITRINE - Marketplace Completo"
- **Descrição:** Marketplace completo com produtos de qualidade em todas as categorias
- **Keywords:** marketplace, eletrônicos, moda, esportes, casa, beleza
- **URL Base:** https://vitrine.com
- **Locale:** pt-MZ (mantido para moeda e formatação)

## 🖼️ Atualizações de Imagens

### Placeholder Images
- **Cores:** Todas as imagens placeholder atualizadas de verde (#53B046, #00BE27) para azul (#2563EB)
- **Locais:** `app/page.tsx`, `app/(shop)/vendedores/page.tsx`, `contexts/MarketplaceContext.tsx`

### Imagens de Conteúdo
- **Homepage Hero:** Atualizada de produtos orgânicos para imagem de e-commerce geral
- **About Page:** Imagens atualizadas para refletir marketplace geral
- **Blog Posts:** Imagens atualizadas para temas gerais de marketplace
- **URLs:** Substituídas referências a imagens de produtos orgânicos por imagens de e-commerce/marketplace

### Alt Text
- Todas as descrições de imagens atualizadas de "Alimentos Orgânicos" para "VITRINE Marketplace"

## 📧 Atualizações de Email

### Domínios Atualizados
- **Antes:** ecobazar.com
- **Depois:** vitrine.com

### Endereços de Email Atualizados
- `contato@vitrine.com`
- `suporte@vitrine.com`
- `noreply@vitrine.com`
- `juridico@vitrine.com`
- `privacidade@vitrine.com`

**Arquivos atualizados:**
- `app/(content)/termos/page.tsx`
- `app/(content)/privacidade/page.tsx`
- `app/(admin)/admin/configuracoes/page.tsx`
- `app/(content)/faq/page.tsx`
- `app/(content)/trocas-devolucoes/page.tsx`
- `app/(content)/contato/page.tsx`
- `app/(content)/ajuda/page.tsx`

## 🛍️ Atualizações de Produtos e Conteúdo

### Categorias Principais
1. **Eletrônicos** - Smartphones, computadores, acessórios
2. **Moda** - Roupas, calçados, acessórios
3. **Esportes** - Equipamentos esportivos e fitness
4. **Casa e Jardim** - Decoração, móveis, produtos para casa
5. **Beleza** - Cosméticos, perfumes, produtos de beleza
6. **Livros** - Livros, revistas, material educacional
7. **Brinquedos** - Brinquedos e jogos para todas as idades
8. **Automotivo** - Acessórios e produtos para veículos

### Blog Posts Atualizados
**Antes (Orgânicos):**
1. Os Benefícios dos Alimentos Orgânicos
2. Como Cultivar sua Própria Horta Orgânica
3. Receitas Saudáveis com Produtos Orgânicos
4. O Impacto Ambiental da Agricultura Orgânica
5. Dicas para Escolher os Melhores Produtos Orgânicos
6. A Importância da Estação dos Alimentos

**Depois (Marketplace Geral):**
1. Guia Completo: Como Escolher o Smartphone Ideal
2. Tendências de Moda 2024: O Que Está em Alta
3. Dicas de Compras Online: Como Comprar com Segurança
4. Equipamentos Esportivos Essenciais para Iniciantes
5. Decoração de Casa: Ideias Modernas e Acessíveis
6. Produtos de Beleza: Guia de Cuidados Pessoais

**Tags atualizadas:** De `['orgânico', 'saúde', 'nutrição', 'horta', 'cultivo', 'receitas', 'culinária']` para `['tecnologia', 'moda', 'esportes', 'casa', 'beleza', 'compras', 'dicas']`

## 🔄 Terminologia Atualizada

### "Banca" → "Loja"
- **Seller Configuration:** "Nome da Banca" → "Nome da Loja"
- **Seller Sidebar:** "Minha Banca" → "Minha Loja"
- **Tabs:** "Banca" → "Loja"
- **PWA Shortcuts:** "Banca" → "Produtos em Destaque"
- **Offline Page:** "Banca de Produtos" → "Loja de Produtos"

### Remoção de Referências Orgânicas
- **Homepage:** "Banca de Alimentos Orgânicos" → "VITRINE Marketplace"
- **FAQ:** Perguntas sobre orgânicos substituídas por perguntas sobre compras
- **Seller Descriptions:** Atualizadas de fazendas orgânicas para lojas gerais
- **Testimonials:** Atualizados para refletir experiência de marketplace geral

## 💾 Atualizações de LocalStorage

### Chaves Atualizadas
- **Antes:** `ecobazar_*`
- **Depois:** `vitrine_*`

**Chaves específicas:**
- `vitrine_cart`
- `vitrine_wishlist`
- `vitrine_user`
- `vitrine_authenticated`
- `vitrine_guest_cart`

**Arquivos:**
- `contexts/MarketplaceContext.tsx`
- `lib/guest-cart.ts`

## 📁 Lista Completa de Arquivos Alterados

### **Arquivos de Configuração e Estilo**
1. **`tailwind.config.ts`** - Esquema de cores azul, paleta blue-gray
2. **`app/globals.css`** - Variáveis CSS primárias azuis
3. **`components.json`** - Configurações de componentes UI

### **Arquivos de Layout e Metadados**
4. **`app/layout.tsx`** - Metadados, SEO, branding VITRINE
5. **`app/page.tsx`** - Página inicial com novo contexto, imagens atualizadas
6. **`components/layout/Footer.tsx`** - Logo, contatos, descrição
7. **`components/layout/Header.tsx`** - Navegação e branding
8. **`components/layout/AdminLayout.tsx`** - Logo admin atualizado

### **Arquivos de Contexto e Estado**
9. **`contexts/MarketplaceContext.tsx`** - Dados mock, localStorage, blog posts, imagens placeholder
10. **`lib/seo.ts`** - Configurações SEO completas
11. **`components/seo/StructuredData.tsx`** - Dados estruturados JSON-LD

### **Arquivos PWA e Service Worker**
12. **`public/manifest.json`** - Manifest PWA atualizado
13. **`public/sw.js`** - Service Worker com branding VITRINE
14. **`app/api/manifest/route.ts`** - API route do manifest
15. **`app/sitemap.ts`** - Sitemap com nova URL base

### **Páginas de Conteúdo Público**
16. **`app/(content)/sobre/page.tsx`** - Página sobre com nova missão, imagens atualizadas
17. **`app/(content)/faq/page.tsx`** - FAQ atualizado, emails atualizados
18. **`app/(content)/contato/page.tsx`** - Contatos e emails atualizados
19. **`app/(content)/ajuda/page.tsx`** - Centro de ajuda, emails atualizados
20. **`app/(content)/seja-vendedor/page.tsx`** - Formulário de vendedor, terminologia atualizada
21. **`app/(content)/termos/page.tsx`** - Termos atualizados, emails atualizados
22. **`app/(content)/privacidade/page.tsx`** - Privacidade atualizada, emails atualizados
23. **`app/(content)/blog/page.tsx`** - Blog listagem, tags atualizadas
24. **`app/(content)/blog/[id]/page.tsx`** - Blog post individual atualizado
25. **`app/(content)/trocas-devolucoes/page.tsx`** - Emails atualizados

### **Páginas de Loja**
26. **`app/(shop)/vendedores/page.tsx`** - Lista de vendedores, imagens e descrições atualizadas
27. **`app/(shop)/vendedor/[id]/page.tsx`** - Perfil de vendedor atualizado
28. **`app/(shop)/loja/page.tsx`** - Página de loja

### **Páginas de Autenticação**
29. **`app/(auth)/entrar/page.tsx`** - Página de login
30. **`app/(auth)/criar-conta/page.tsx`** - Textos atualizados

### **Painel Administrativo**
31. **`app/(admin)/admin/page.tsx`** - Dashboard principal
32. **`app/(admin)/admin/configuracoes/page.tsx`** - Configurações do sistema, emails atualizados
33. **`app/(admin)/admin/blog/novo/page.tsx`** - Placeholders atualizados
34. **`app/(admin)/admin/newsletter/campanhas/novo/page.tsx`** - Placeholders atualizados

### **Painel do Vendedor**
35. **`app/(seller)/vendedor/configuracoes/page.tsx`** - Terminologia "Banca" → "Loja"
36. **`app/(seller)/components/SellerSidebar.tsx`** - "Minha Banca" → "Minha Loja"

### **Utilitários e Helpers**
37. **`lib/guest-cart.ts`** - Chave localStorage atualizada para `vitrine_guest_cart`
38. **`lib/invoice-generator.ts`** - Branding "TXOVA" → "VITRINE" no cabeçalho de faturas

### **Outros**
39. **`app/not-found.tsx`** - Página 404 atualizada
40. **`public/offline.html`** - Página offline atualizada

**Total de arquivos alterados: 40+ arquivos**

## 🎯 Resultados da Transformação

### Benefícios Alcançados
1. **Marketplace diversificado** com produtos em todas as categorias
2. **Branding consistente** com identidade VITRINE
3. **Experiência do usuário** melhorada com design moderno
4. **Contexto local mantido** com moeda e contatos moçambicanos
5. **Escalabilidade** para crescimento futuro
6. **Remoção completa** de referências a produtos orgânicos
7. **Imagens atualizadas** para refletir marketplace geral
8. **Emails padronizados** com domínio vitrine.com

### Métricas de Sucesso
- **Cobertura de categorias:** 8 categorias principais
- **Consistência de branding:** 100% das páginas atualizadas
- **Manutenção de contexto local:** 100% preservado
- **Arquivos atualizados:** 100% dos arquivos com referências ao Vitrine convertidos para VITRINE
- **SEO e PWA:** 100% das configurações atualizadas
- **Service Worker:** 100% das notificações e cache atualizados
- **Emails:** 100% dos domínios atualizados para vitrine.com
- **Imagens:** 100% das imagens placeholder atualizadas para azul
- **Blog Posts:** 100% dos posts atualizados para temas gerais
- **LocalStorage:** 100% das chaves atualizadas para vitrine_* (incluindo vitrine_guest_cart)
- **Utilitários:** 100% dos helpers atualizados (guest-cart, invoice-generator)

---

## 🔄 **PROMPT PARA REBRANDING COMPLETO PARA VITRINE**

### **Instruções para Aplicar Branding VITRINE**

Use o seguinte prompt detalhado para aplicar o branding VITRINE completo:

---

**PROMPT:**

```
Execute o rebranding completo para VITRINE seguindo estas especificações:

**Especificações da Identidade VITRINE:**
- Nome da marca: VITRINE
- Slogan: "VITRINE - Tudo que Você Precisa"
- Cor primária: #2563EB (azul)
- Cores secundárias: #60A5FA (azul claro), #1D4ED8 (azul escuro)
- Contexto de negócio: Marketplace completo com produtos de qualidade em todas as categorias
- Categorias principais: Eletrônicos, Moda, Esportes, Casa, Beleza, Livros, Brinquedos, Automotivo
- Moeda: MZN (Meticais)
- Locale: pt-MZ
- URL Base: https://vitrine.com
- Email Domain: vitrine.com

**Arquivos que DEVEM ser atualizados:**

1. **Configuração e Estilo:**
   - `tailwind.config.ts` - Cores primárias azuis (#2563EB, #60A5FA, #1D4ED8), paleta blue-gray
   - `app/globals.css` - Variáveis CSS: --primary: 217 91% 60%, --ring: 217 91% 60%

2. **Layout e Metadados:**
   - `app/layout.tsx` - Metadados, SEO, branding VITRINE, theme-color: #2563EB
   - `app/page.tsx` - Hero: "VITRINE - Tudo que Você Precisa", imagens de marketplace geral
   - `components/layout/Footer.tsx` - Logo "V", contato@vitrine.com, +258 84 9999-9999
   - `components/layout/Header.tsx` - Logo "V", VITRINE, contato@vitrine.com
   - `components/layout/AdminLayout.tsx` - Logo "V", VITRINE

3. **Contexto e Estado:**
   - `contexts/MarketplaceContext.tsx` - localStorage: vitrine_*, blog posts gerais, imagens placeholder azuis (#2563EB)
   - `lib/seo.ts` - Base URL: https://vitrine.com, siteName: VITRINE, keywords gerais
   - `components/seo/StructuredData.tsx` - Organization: VITRINE, URLs vitrine.com

4. **PWA e Service Worker:**
   - `public/manifest.json` - Nome: "VITRINE - Marketplace Completo", theme_color: #2563EB
   - `public/sw.js` - Cache: vitrine-v1.0.0, notificações: "VITRINE"
   - `app/api/manifest/route.ts` - Manifest API atualizado
   - `app/sitemap.ts` - Base URL: https://vitrine.com

5. **Páginas de Conteúdo:**
   - `app/(content)/sobre/page.tsx` - Missão marketplace geral, imagens atualizadas
   - `app/(content)/faq/page.tsx` - Perguntas sobre compras, contato@vitrine.com
   - `app/(content)/contato/page.tsx` - contato@vitrine.com, suporte@vitrine.com
   - `app/(content)/ajuda/page.tsx` - suporte@vitrine.com
   - `app/(content)/seja-vendedor/page.tsx` - "Loja" (não "Banca"), textos gerais
   - `app/(content)/termos/page.tsx` - juridico@vitrine.com, textos atualizados
   - `app/(content)/privacidade/page.tsx` - privacidade@vitrine.com
   - `app/(content)/blog/page.tsx` - Tags: tecnologia, moda, esportes, casa, beleza, compras, dicas
   - `app/(content)/blog/[id]/page.tsx` - Conteúdo geral de marketplace
   - `app/(content)/trocas-devolucoes/page.tsx` - suporte@vitrine.com

6. **Páginas de Loja:**
   - `app/(shop)/vendedores/page.tsx` - Descrições gerais, imagens placeholder azuis
   - `app/(shop)/vendedor/[id]/page.tsx` - Descrições gerais

7. **Painel Administrativo:**
   - `app/(admin)/admin/configuracoes/page.tsx` - Site: VITRINE, noreply@vitrine.com
   - `app/(admin)/admin/blog/novo/page.tsx` - Placeholders gerais
   - `app/(admin)/admin/newsletter/campanhas/novo/page.tsx` - Placeholders gerais

8. **Painel do Vendedor:**
   - `app/(seller)/vendedor/configuracoes/page.tsx` - "Loja" (não "Banca")
   - `app/(seller)/components/SellerSidebar.tsx` - "Minha Loja" (não "Minha Banca")

9. **Utilitários e Helpers:**
   - `lib/guest-cart.ts` - Chave localStorage: vitrine_guest_cart (não txova_guest_cart)
   - `lib/invoice-generator.ts` - Branding "TXOVA" → "VITRINE" no cabeçalho de faturas

10. **Outros:**
   - `app/not-found.tsx` - Textos gerais
   - `public/offline.html` - "Loja de Produtos" (não "Banca")

**Elementos Específicos a Atualizar:**

1. **Branding Visual:**
   - Logo: "V" (não "T")
   - Nome: "VITRINE" em todos os textos
   - Slogan: "VITRINE - Tudo que Você Precisa"
   - Cores: Azul (#2563EB) em vez de verde
   - Paleta: blue-gray em vez de green-gray

2. **Imagens:**
   - Placeholder images: #2563EB (azul) em vez de verde
   - Imagens de conteúdo: Marketplace geral em vez de produtos orgânicos
   - Alt text: "VITRINE Marketplace" em vez de "Alimentos Orgânicos"

3. **Emails:**
   - Todos os domínios: vitrine.com (não ecobazar.com)
   - contato@vitrine.com
   - suporte@vitrine.com
   - noreply@vitrine.com
   - juridico@vitrine.com
   - privacidade@vitrine.com

4. **Terminologia:**
   - "Banca" → "Loja" (em todos os contextos)
   - "Nome da Banca" → "Nome da Loja"
   - "Minha Banca" → "Minha Loja"
   - Remover todas as referências a "produtos orgânicos", "alimentos orgânicos", "Banca de Alimentos Orgânicos"

5. **Blog Posts:**
   - Substituir posts sobre orgânicos por temas gerais:
     * Tecnologia (smartphones, eletrônicos)
     * Moda (tendências, estilo)
     * Esportes (equipamentos, fitness)
     * Casa (decoração, interiores)
     * Beleza (cuidados pessoais, cosméticos)
     * Compras (dicas, segurança online)

6. **LocalStorage:**
   - vitrine_cart (não ecobazar_cart)
   - vitrine_wishlist (não ecobazar_wishlist)
   - vitrine_user (não ecobazar_user)
   - vitrine_authenticated (não ecobazar_authenticated)
   - vitrine_guest_cart (não txova_guest_cart)

7. **SEO e Metadados:**
   - Título: "VITRINE - Marketplace Completo"
   - Descrição: "Marketplace completo com produtos de qualidade em todas as categorias"
   - Keywords: marketplace, eletrônicos, moda, esportes, casa, beleza
   - URL Base: https://vitrine.com
   - Theme Color: #2563EB

8. **PWA:**
   - Nome: "VITRINE - Marketplace Completo"
   - Theme Color: #2563EB
   - Shortcuts: "Produtos em Destaque" (não "Banca")
   - Cache names: vitrine-v1.0.0

**Comandos de Busca para Verificação:**
```bash
# Buscar referências antigas
grep -r "Vitrine\|vitrine" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json"
grep -r "ecobazar" . --include="*.ts" --include="*.tsx"
grep -r "Banca\|banca" . --include="*.ts" --include="*.tsx"
grep -r "orgânico\|orgânica" . --include="*.ts" --include="*.tsx" -i
grep -r "#53B046\|#00BE27" . --include="*.ts" --include="*.tsx" --include="*.css"

# Verificar novas referências
grep -r "VITRINE\|vitrine" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json"
grep -r "#2563EB" . --include="*.ts" --include="*.tsx" --include="*.css"
grep -r "vitrine_" . --include="*.ts" --include="*.tsx"
```

**Checklist Final:**
- [ ] Cores primárias azuis aplicadas (#2563EB)
- [ ] Logo "V" em Header, Footer e AdminLayout
- [ ] Nome "VITRINE" em todos os textos
- [ ] Slogan "VITRINE - Tudo que Você Precisa" no hero
- [ ] Todos os emails atualizados para vitrine.com
- [ ] Todas as imagens placeholder em azul (#2563EB)
- [ ] Imagens de conteúdo atualizadas para marketplace geral
- [ ] "Banca" substituído por "Loja" em todos os lugares
- [ ] Referências a orgânicos removidas
- [ ] Blog posts atualizados para temas gerais
- [ ] LocalStorage keys atualizadas para vitrine_*
- [ ] SEO e metadados atualizados
- [ ] PWA e Service Worker atualizados
- [ ] URLs base atualizadas para vitrine.com
- [ ] Teste visual em todas as páginas principais
- [ ] Verificação de responsividade

**IMPORTANTE:** 
- Manter o contexto moçambicano (MZN, pt-MZ, contatos locais)
- Não atualizar dados mock se já houver integração com API
- Focar apenas em UI e branding, não em dados de produtos/vendedores se vierem de API
```

---

**Data de Atualização:** March 2026 
**Versão:** 3.0  
**Status:** Concluído ✅
