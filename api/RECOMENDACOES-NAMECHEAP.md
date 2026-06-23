# Recomendações de Alojamento Namecheap — Hublink Marketplace

**Assunto:** Recomendações de alojamento Namecheap — Hublink Marketplace

Olá [Nome do Cliente],

Segue o nosso parecer sobre a infraestrutura necessária para colocar o **Hublink Marketplace** em produção, com foco na **Namecheap**, conforme solicitado.

---

## Resumo do projeto

A plataforma é composta por:

- **API (backend)** — Node.js / Express (utilizadores, produtos, encomendas, pagamentos, avaliações, etc.)
- **Frontend** — aplicação web Next.js (loja e painel de administração)

Vários serviços críticos **não precisam de correr no servidor** — são serviços cloud geridos:

| Serviço | Fornecedor | No servidor? |
|---------|------------|--------------|
| Base de dados (MongoDB) | MongoDB Atlas | Não |
| Imagens / ficheiros | Cloudinary | Não |
| Pagamentos | Stripe, M-Pesa, iMali, etc. | Não |
| E-mail transacional | SendGrid | Não |

O servidor serve sobretudo para executar a API e o frontend, com o **Nginx** como ponto de entrada público.

---

## O que comprar na Namecheap

| Produto Namecheap | Adequado? |
|-------------------|-----------|
| **Domínio** (.com, .co.mz, etc.) | Sim |
| **VPS Hosting** | Sim — **é o que precisamos** |
| **Shared / Stellar hosting** | **Não** — pensado para WordPress/PHP, não para Node.js + Next.js |
| **cPanel (add-on)** | Opcional — **não é necessário** para a nossa configuração |
| **Private Email** | Opcional — apenas se quiserem e-mail `@seudominio` |

Para este projeto é necessário um **VPS com acesso root**, para instalar Node.js 20, PM2 e Nginx — conforme o plano de deploy já definido.

---

## Plano VPS recomendado

Planos atuais na [Namecheap VPS](https://www.namecheap.com/hosting/vps/) (valores com faturação anual):

| Plano | Recursos | Preço aprox. | Avaliação |
|-------|----------|--------------|-----------|
| Spark | 1 vCPU · 1 GB RAM · 20 GB SSD | ~$3,88/mês | Insuficiente |
| Pulsar | 2 vCPU · 2 GB RAM · 40 GB SSD | ~$6,88/mês | Apenas testes / staging |
| **Quasar** | **4 vCPU · 6 GB RAM · 120 GB SSD** | **~$12,88/mês** | **Recomendado para produção** |
| Magnetar | 8 vCPU · 12 GB RAM · 240 GB SSD | ~$24,88/mês | Margem extra, se o orçamento permitir |
| Hypernova | 12 vCPU · 24 GB RAM · 500 GB SSD | ~$46,88/mês | Desnecessário para o lançamento |

### Recomendação: **VPS Quasar**

É o melhor equilíbrio entre custo e desempenho para o lançamento. A RAM é de 6 GB (em vez dos 8 GB ideais), mas é suficiente para produção; se necessário, podemos configurar memória swap no servidor.

**Nota:** Os preços promocionais renovam mais alto (o Quasar passa a ~$15,88/mês na renovação anual). Convém prever isso no orçamento.

---

## Configuração na altura da compra

| Opção | Recomendação |
|-------|--------------|
| **Sistema operativo** | **Ubuntu 22.04** (instalação em branco, sem LAMP) |
| **Gestão do servidor** | **User-responsible** (gratuito) — se a nossa equipa fizer a configuração via SSH |
| **Gestão do servidor** | **Basic** (+$10/mês) — se preferirem que a Namecheap monitorize falhas do servidor |
| **cPanel / Webuzo** | **Não contratar** — poupa ~$18–20/mês; o deploy usa linha de comandos |
| **Faturação** | Anual (mais barato) ou mensal (mais flexível para testes) |

---

## Arquitetura de deploy

```
Internet → Nginx (HTTPS) → Website (Next.js, porta 3000)
                        → API (/api/v1, porta 3002)
```

A base de dados (MongoDB Atlas) e o armazenamento de imagens (Cloudinary) ficam fora do VPS.

---

## Domínio na Namecheap

Podem concentrar tudo numa conta:

1. Registar o domínio na Namecheap (ou transferir um existente).
2. Comprar o **VPS** em separado (não usar shared hosting).
3. Apontar o DNS para o IP do VPS:
   - Registo **A** `@` → IP do VPS
   - Registo **A** `www` → IP do VPS (ou CNAME para o domínio raiz)
4. Configurar SSL gratuito (Let's Encrypt) no servidor após a propagação do DNS.

---

## Base de dados (MongoDB Atlas)

**Não recomendamos** alojar o MongoDB no próprio VPS. O **MongoDB Atlas** é a opção adequada:

| Fase | Plano Atlas |
|------|-------------|
| Desenvolvimento / staging | M0 (gratuito) ou M2 |
| Produção (lançamento) | **M10** |
| Crescimento | M20–M30 |

**Custo estimado:** M0 gratuito para desenvolvimento; M10 em produção ~$57/mês (varia conforme região).

---

## Serviços que não são necessários no lançamento

- **Redis** — referenciado na configuração, mas ainda não implementado na aplicação
- **Servidor de base de dados dedicado** — desnecessário com MongoDB Atlas
- **Servidor frontend separado** — desnecessário com a abordagem de um único VPS

---

## Ponto de atenção: localização do servidor

Os **VPS da Namecheap ficam apenas nos EUA** (Phoenix, Arizona). Não há opção de VPS na Europa ou em África.

Para utilizadores em **Moçambique**, a latência será superior à de um servidor na Europa ou África do Sul. Para um lançamento inicial, é normalmente aceitável, sobretudo com:

- CDN da Cloudinary para imagens
- Cache no browser para ficheiros estáticos
- MongoDB Atlas numa região mais próxima (ex.: **Frankfurt**)

Se a latência em Moçambique for prioridade absoluta, podemos avaliar outro fornecedor VPS com datacenter na UE — mas a Namecheap continua a ser uma boa opção em termos de custo e simplicidade.

---

## Custos mensais estimados

| Item | Custo aproximado |
|------|------------------|
| Namecheap VPS Quasar | ~$13/mês (promo) → ~$16/mês na renovação |
| Domínio (.com) | ~$10–15/ano |
| MongoDB Atlas M10 | ~$57/mês |
| Cloudinary | Plano gratuito para começar |
| SSL (Let's Encrypt) | Gratuito |
| **Total (sem domínio)** | **~$70–75/mês** |

---

## Recomendação final

| Componente | Escolha |
|------------|---------|
| Alojamento | **Namecheap VPS Quasar** (4 vCPU, 6 GB RAM, 120 GB SSD) |
| Sistema operativo | **Ubuntu 22.04** |
| Painel de controlo | **Nenhum** (sem cPanel) |
| Base de dados | **MongoDB Atlas M10** |
| Imagens | **Cloudinary** |
| Proxy / SSL | **Nginx + Let's Encrypt** |
| Gestão de processos | **PM2** |
| Domínio | **Namecheap** |

---

## Próximos passos

Para avançar, precisamos de:

1. Confirmação do plano **VPS Quasar** na Namecheap
2. Domínio de produção definido
3. Conta MongoDB Atlas (ou acesso para configurar o cluster)
4. Chaves de produção (Stripe, SendGrid, Cloudinary, gateways de pagamento)
5. Decisão entre gestão **User-responsible** (nós configuramos) ou **Basic** (monitorização Namecheap)

---

## Checklist de compra

- [ ] Registar domínio na Namecheap (se necessário)
- [ ] Comprar **VPS Quasar** — Ubuntu 22.04, User-responsible, sem cPanel
- [ ] Anotar o IP do VPS no e-mail de boas-vindas
- [ ] Apontar registo A do domínio para esse IP
- [ ] Autorizar o IP do VPS no MongoDB Atlas
- [ ] Fazer deploy da API e do frontend conforme o guia de deploy do projeto

---

Ficamos disponíveis para esclarecer qualquer ponto ou acompanhar a compra e configuração.

Com os melhores cumprimentos,  
[O seu nome]  
[Empresa]  
[Telefone] | [E-mail]
