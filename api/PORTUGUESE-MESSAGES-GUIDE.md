# Guia de Mensagens em Português - API

## 📋 Visão Geral

Todas as mensagens de resposta da API foram centralizadas no arquivo `src/utils/messages.ts` em **português**. Este guia explica como usar o sistema de mensagens e como atualizar os controladores existentes.

---

## 🗂️ Estrutura de Mensagens

As mensagens estão organizadas por módulo/categoria:

```typescript
Messages = {
  AUTH: { ... },          // Autenticação
  USER: { ... },          // Usuários
  PRODUCT: { ... },       // Produtos
  CART: { ... },          // Carrinho
  ORDER: { ... },         // Pedidos
  REVIEW: { ... },        // Avaliações
  BLOG: { ... },          // Blog
  SELLER: { ... },        // Vendedores
  PAYMENT: { ... },       // Pagamentos
  REFUND: { ... },        // Reembolsos
  TICKET: { ... },        // Tickets
  CONTACT: { ... },       // Contato
  NEWSLETTER: { ... },    // Newsletter
  // ... e mais
}
```

---

## 🚀 Como Usar

### 1. Importar as Mensagens

```typescript
import Messages from '../utils/messages';
// ou
import { Messages, getMessage } from '../utils/messages';
```

### 2. Usar Mensagens Diretas

**Antes (Inglês):**
```typescript
res.json({
  success: true,
  message: 'User created successfully',
  data: user
});
```

**Depois (Português):**
```typescript
res.json({
  success: true,
  message: Messages.USER.CREATED,  // 'Usuário criado com sucesso'
  data: user
});
```

### 3. Usar Helper getMessage()

```typescript
import { getMessage } from '../utils/messages';

// Acesso com string
res.json({
  success: true,
  message: getMessage('USER.CREATED'),
  data: user
});

// Com fallback personalizado
res.json({
  success: true,
  message: getMessage('CUSTOM.MESSAGE', 'Mensagem padrão'),
  data: user
});
```

### 4. Mensagens com Variáveis

```typescript
import { formatMessage } from '../utils/messages';

const message = formatMessage(
  'Produto {name} adicionado ao carrinho',
  { name: product.name }
);
```

---

## 📝 Exemplos de Implementação

### Exemplo 1: Controller de Autenticação

```typescript
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import Messages from '../utils/messages';

export class AuthController {
  // Login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.json({
        success: true,
        message: Messages.AUTH.LOGIN_SUCCESS,  // 'Login realizado com sucesso'
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: Messages.AUTH.LOGIN_FAILED  // 'Email ou senha incorretos'
      });
    }
  }

  // Register
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: Messages.AUTH.REGISTER_SUCCESS,  // 'Cadastro realizado com sucesso'
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || Messages.AUTH.REGISTER_FAILED
      });
    }
  }
}
```

### Exemplo 2: Controller de Reviews

```typescript
import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';
import Messages from '../utils/messages';

export class ReviewController {
  // Create review
  static async createReview(req: Request, res: Response) {
    try {
      const review = await ReviewService.createReview({
        ...req.body,
        userId: req.user!.userId
      });

      res.status(201).json({
        success: true,
        message: Messages.REVIEW.CREATED,  // 'Avaliação enviada com sucesso'
        data: review
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  // Moderate review (admin)
  static async moderateReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const { status } = req.body;

      const review = await ReviewService.moderateReview(
        reviewId,
        status,
        req.user!.userId
      );

      const message = status === 'approved' 
        ? Messages.REVIEW.APPROVED   // 'Avaliação aprovada com sucesso'
        : Messages.REVIEW.REJECTED;  // 'Avaliação rejeitada com sucesso'

      res.json({
        success: true,
        message,
        data: review
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }
}
```

### Exemplo 3: Service com ApiError

```typescript
import { ApiError } from '../utils/ApiError';
import Messages from '../utils/messages';

export class ProductService {
  static async getProductById(productId: string) {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new ApiError(404, Messages.PRODUCT.NOT_FOUND);  // 'Produto não encontrado'
    }
    
    return product;
  }

  static async addToCart(productId: string, quantity: number) {
    const product = await this.getProductById(productId);
    
    if (product.stock < quantity) {
      throw new ApiError(400, Messages.PRODUCT.INSUFFICIENT_STOCK);  // 'Estoque insuficiente'
    }
    
    // ... adicionar ao carrinho
  }
}
```

### Exemplo 4: Middleware de Autenticação

```typescript
import { Request, Response, NextFunction } from 'express';
import Messages from '../utils/messages';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: Messages.AUTH.TOKEN_MISSING  // 'Token não fornecido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: Messages.AUTH.TOKEN_INVALID  // 'Token inválido'
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: Messages.AUTH.ACCESS_DENIED  // 'Acesso negado'
      });
    }
    next();
  };
};
```

---

## 🔄 Migração de Código Existente

### Passo 1: Identificar Mensagens

Procure por padrões como:
```typescript
// Padrão de mensagem
message: 'Some english message'
'Some error message'
throw new Error('Some error')
throw new ApiError(400, 'Some error')
```

### Passo 2: Substituir pela Mensagem em Português

```typescript
// Antes
message: 'Product created successfully'

// Depois
message: Messages.PRODUCT.CREATED
```

### Passo 3: Atualizar ApiError

```typescript
// Antes
throw new ApiError(404, 'Product not found');

// Depois
throw new ApiError(404, Messages.PRODUCT.NOT_FOUND);
```

---

## 📦 Mensagens Disponíveis

### Autenticação (AUTH)
- `LOGIN_SUCCESS` - Login realizado com sucesso
- `LOGIN_FAILED` - Email ou senha incorretos
- `LOGOUT_SUCCESS` - Logout realizado com sucesso
- `REGISTER_SUCCESS` - Cadastro realizado com sucesso
- `TOKEN_INVALID` - Token inválido
- `TOKEN_EXPIRED` - Token expirado
- `UNAUTHORIZED` - Não autorizado
- `ACCESS_DENIED` - Acesso negado
- `ADMIN_ONLY` - Acesso restrito a administradores

### Usuários (USER)
- `CREATED` - Usuário criado com sucesso
- `UPDATED` - Usuário atualizado com sucesso
- `DELETED` - Usuário excluído com sucesso
- `NOT_FOUND` - Usuário não encontrado
- `PROFILE_UPDATED` - Perfil atualizado com sucesso

### Produtos (PRODUCT)
- `CREATED` - Produto criado com sucesso
- `UPDATED` - Produto atualizado com sucesso
- `DELETED` - Produto excluído com sucesso
- `NOT_FOUND` - Produto não encontrado
- `OUT_OF_STOCK` - Produto fora de estoque
- `INSUFFICIENT_STOCK` - Estoque insuficiente

### Carrinho (CART)
- `ITEM_ADDED` - Item adicionado ao carrinho
- `ITEM_UPDATED` - Carrinho atualizado
- `ITEM_REMOVED` - Item removido do carrinho
- `CLEARED` - Carrinho esvaziado

### Pedidos (ORDER)
- `CREATED` - Pedido realizado com sucesso
- `UPDATED` - Pedido atualizado com sucesso
- `CANCELLED` - Pedido cancelado com sucesso
- `CONFIRMED` - Pedido confirmado com sucesso
- `SHIPPED` - Pedido enviado
- `DELIVERED` - Pedido entregue

### Avaliações (REVIEW)
- `CREATED` - Avaliação enviada com sucesso
- `UPDATED` - Avaliação atualizada com sucesso
- `DELETED` - Avaliação excluída com sucesso
- `APPROVED` - Avaliação aprovada com sucesso
- `REJECTED` - Avaliação rejeitada com sucesso
- `ALREADY_REVIEWED` - Você já avaliou este produto

### Blog (BLOG)
- `POST_CREATED` - Post criado com sucesso
- `POST_UPDATED` - Post atualizado com sucesso
- `POST_DELETED` - Post excluído com sucesso
- `POST_NOT_FOUND` - Post não encontrado
- `FEATURED_MARKED` - Post marcado como destaque
- `STATUS_UPDATED` - Status do post atualizado com sucesso

### Vendedores (SELLER)
- `CREATED` - Vendedor cadastrado com sucesso
- `UPDATED` - Vendedor atualizado com sucesso
- `NOT_FOUND` - Vendedor não encontrado
- `VERIFIED` - Vendedor verificado com sucesso
- `FEATURED_MARKED` - Vendedor marcado como destaque

### Pagamentos (PAYMENT)
- `SUCCESS` - Pagamento realizado com sucesso
- `FAILED` - Falha no pagamento
- `PENDING` - Pagamento pendente
- `REFUNDED` - Pagamento reembolsado

### Reembolsos (REFUND)
- `REQUESTED` - Reembolso solicitado com sucesso
- `APPROVED` - Reembolso aprovado
- `REJECTED` - Reembolso rejeitado
- `PROCESSED` - Reembolso processado

### Tickets (TICKET)
- `CREATED` - Ticket criado com sucesso
- `UPDATED` - Ticket atualizado com sucesso
- `CLOSED` - Ticket fechado com sucesso
- `MESSAGE_ADDED` - Mensagem adicionada ao ticket

### Contato (CONTACT)
- `MESSAGE_SENT` - Sua mensagem foi enviada com sucesso!
- `MESSAGE_FAILED` - Falha ao enviar mensagem

### Newsletter (NEWSLETTER)
- `SUBSCRIBED` - Inscrito na newsletter com sucesso
- `UNSUBSCRIBED` - Desinscrito da newsletter
- `ALREADY_SUBSCRIBED` - Este email já está inscrito

### Validação (VALIDATION)
- `REQUIRED_FIELD` - Este campo é obrigatório
- `INVALID_EMAIL` - Email inválido
- `INVALID_PHONE` - Número de telefone inválido
- `PASSWORDS_DONT_MATCH` - As senhas não coincidem

---

## ✅ Checklist de Migração

### Controllers
- [ ] authController.ts
- [ ] userController.ts
- [ ] productController.ts
- [ ] cartController.ts
- [ ] orderController.ts
- [ ] reviewController.ts
- [ ] adminBlogController.ts
- [ ] sellerController.ts
- [ ] paymentController.ts
- [ ] refundController.ts
- [ ] ticketController.ts
- [ ] newsletterController.ts
- [ ] contactController.ts

### Services
- [ ] authService.ts
- [ ] productService.ts
- [ ] orderService.ts
- [ ] reviewService.ts
- [ ] blogService.ts
- [ ] sellerService.ts
- [ ] paymentService.ts

### Middleware
- [ ] auth.ts (authenticateToken, authorizeRoles)
- [ ] errorHandler.ts

---

## 🎯 Prioridades

### Alta Prioridade (APIs públicas)
1. ✅ **contactService.ts** - Já em português
2. **authController.ts** - Login, registro
3. **productController.ts** - Listagem, detalhes
4. **orderController.ts** - Criar pedido
5. **cartController.ts** - Adicionar/remover itens

### Média Prioridade
6. **reviewController.ts** - Criar/editar avaliações
7. **userController.ts** - Perfil do usuário
8. **sellerController.ts** - Perfil de vendedor
9. **newsletterController.ts** - Inscrição

### Baixa Prioridade (APIs admin)
10. **adminBlogController.ts** - Gerenciar blog
11. **adminUserController.ts** - Gerenciar usuários
12. **adminOrderController.ts** - Gerenciar pedidos

---

## 🔧 Utilitários

### Adicionar Nova Mensagem

1. Abra `src/utils/messages.ts`
2. Adicione a nova mensagem no módulo apropriado:

```typescript
export const Messages = {
  // ... outras categorias
  
  MY_MODULE: {
    NEW_MESSAGE: 'Minha nova mensagem em português',
    ANOTHER_MESSAGE: 'Outra mensagem'
  }
};
```

3. Use nos controllers:

```typescript
import Messages from '../utils/messages';

res.json({
  success: true,
  message: Messages.MY_MODULE.NEW_MESSAGE
});
```

---

## 📞 Suporte

Se precisar adicionar novas mensagens ou tiver dúvidas sobre a implementação, consulte:
- `src/utils/messages.ts` - Todas as mensagens disponíveis
- Este guia para exemplos de uso
- Equipe de backend para suporte

---

## 🌍 Internacionalização Futura

Este sistema pode ser expandido para suportar múltiplos idiomas:

```typescript
// Estrutura futura
const Messages = {
  pt: { /* mensagens em português */ },
  en: { /* messages in english */ },
  es: { /* mensajes en español */ }
};

// Helper com idioma
getMessage('USER.CREATED', 'pt');  // Português
getMessage('USER.CREATED', 'en');  // Inglês
```

---

**Última Atualização:** 29 de Janeiro de 2026  
**Status:** Sistema implementado e pronto para uso  
**Próximos Passos:** Migrar controllers existentes gradualmente
