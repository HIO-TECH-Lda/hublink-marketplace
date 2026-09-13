# Guia de Alterações no Frontend: Autenticação Flexível (Email Opcional & Login Duplo)

Este documento descreve as alterações necessárias e recomendadas no frontend para suportar o novo fluxo de autenticação, no qual o **número de telefone é o identificador obrigatório principal**, o **email tornou-se opcional**, e o **login pode ser feito tanto por email quanto por telefone**.

---

## 1. Resumo Executivo das Alterações da API

| Funcionalidade | Comportamento Anterior | Novo Comportamento da API |
| :--- | :--- | :--- |
| **Registo - Email** | Obrigatório | **Opcional** (`email?: string`) |
| **Registo - Telefone** | Obrigatório | **Obrigatório** (`+258XXXXXXXXX`) |
| **Registo - Password** | Símbolos restritos (`@$!%*?&`) | **Qualquer símbolo especial não alfanumérico** (`#`, `_`, `-`, `.`, etc.) |
| **Login** | Apenas por `email` | **Email OU Telefone** (aceita `email`, `phone` ou `identifier`) |
| **Atualização de Perfil** | Email era descartado pelo backend | **Permite atualizar/adicionar email** |
| **Tokens JWT** | Continha apenas `email` | Contém `phone` e `email` (opcional) |

---

## 2. Alterações Detalhadas por Ecrã

### 2.1. Ecrã de Login (`/login` ou Modal de Login)

O formulário de login agora deve permitir que o utilizador digite o seu email ou o número de telefone moçambicano.

#### Alterações no Template / JSX:
1. **Tipo do Input**: Altere de `type="email"` para `type="text"`.
   * *Porquê:* O navegador bloqueia o envio se o utilizador digitar um número de telefone num input `type="email"`.
2. **Label e Placeholder**:
   * **Label**: `"Email ou Telefone"` (anteriormente `"Email"`).
   * **Placeholder**: `"ex: joao@exemplo.com, 847554622 ou +258847554622"`.

#### Suporte a Formatos de Telefone no Login:
O utilizador pode inserir o número de telefone em qualquer um dos seguintes formatos:
- **Formato local (9 dígitos)**: `847554622`
- **Formato internacional com `+`**: `+258847554622`
- **Formato internacional sem `+`**: `258847554622`
- **Com espaços ou hífens**: `84 755 4622` ou `+258 84 755 4622`

#### Payload de Envio:
O frontend pode continuar enviando o campo como `email`, ou usar `identifier` ou `phone`:
```json
// Opção A (Recomendada): usando identifier
{
  "identifier": "847554622",
  "password": "MinhaPassword123!"
}

// Opção B (Compatível com código legado):
{
  "email": "+258847554622",
  "password": "MinhaPassword123!"
}
```
*O backend normaliza e encontra a conta em qualquer formato.*

---

### 2.2. Ecrã de Registo (`/register` ou Modal de Registo)

#### Alterações no Template / JSX:
1. **Campo de Email**:
   * Remova o asterisco de campo obrigatório (`*`).
   * Adicione indicação de opcional: `"Email (Opcional)"`.
   * Remova o atributo HTML `required` da tag `<input>`.
2. **Campo de Telefone**:
   * Mantenha em destaque como obrigatório (`*`).
   * O backend aceita o número **com ou sem prefixo `+258`** (ex: `847554622` ou `+258847554622`), e normaliza automaticamente para `+258XXXXXXXXX` no banco de dados.

#### Validação no Frontend (Yup / Zod / Formulário):
Se o utilizador **não preencher** o email, o formulário deve permitir o envio com `""` ou `undefined`. Se preencher, valide o formato de email.

**Exemplo com Zod:**
```typescript
const registerSchema = z.object({
  firstName: z.string().min(2, "O primeiro nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "O apelido deve ter pelo menos 2 caracteres"),
  // Aceita com ou sem +258 (ex: 847554622 ou +258847554622)
  phone: z.string().regex(/^(\+258|258)?[0-9]{9}$/, "Insira um número moçambicano válido (ex: 847554622 ou +258847554622)"),
  // Email opcional, mas se fornecido deve ser válido
  email: z.string().email("Insira um email válido").optional().or(z.literal("")),
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, "A senha deve conter maiúscula, minúscula, número e símbolo"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
```

---

### 2.3. Cabeçalho / Navbar / Menus de Utilizador

Quando o utilizador faz login e os seus dados são guardados no estado global (Context/Redux/Zustand), o campo `user.email` pode estar ausente ou indefinido se ele se registou apenas com telefone.

#### Atualização de Código:
Procure por referências onde `user.email` é renderizado diretamente e adicione fallback para `user.phone`:

```tsx
// ❌ Antes:
<p className="user-email">{user.email}</p>

// ✅ Agora:
<p className="user-contact">{user.email || user.phone}</p>
```

---

### 2.4. Ecrã de Perfil / Definições da Conta (`/profile` ou `/account`)

Anteriormente, o backend descartava alterações no campo `email`. Agora:
1. O campo de email pode ser tornado editável no formulário de edição de perfil.
2. Utilizadores que se registaram apenas com telefone podem adicionar um email à sua conta posteriormente.
3. Se um utilizador inserir um email que já pertence a outra conta, o backend retornará status `400` com a mensagem `"Este email já está cadastrado"`.

---

## 3. Recuperação de Senha (Atenção Especial)

* A rota de recuperação atual (`POST /api/v1/auth/forgot-password`) envia um link com token para o email do utilizador.
* **Nota para o Frontend**: Caso um utilizador tente recuperar senha informando um telefone, o frontend deve avisar que a recuperação por email requer um email associado à conta, ou solicitar o email cadastrado.

---

## 4. Matriz de Testes para Validação do Frontend

| Cenário | Entrada do Utilizador | Resultado Esperado |
| :--- | :--- | :--- |
| **Registo com Telefone Local** | Nome, Sobrenome, Telefone `847554622`, Senha forte | ✅ Sucesso (gravado como `+258847554622`) |
| **Registo com Telefone +258** | Nome, Sobrenome, Telefone `+258847554622`, Senha forte | ✅ Sucesso (gravado como `+258847554622`) |
| **Registo sem Telefone** | Nome, Sobrenome, Email, Senha | ❌ Bloqueado no frontend e rejeitado pelo backend |
| **Login com Email** | `joao@exemplo.com` + Senha | ✅ Sucesso |
| **Login com Telefone (9 dígitos)** | `847554622` + Senha | ✅ Sucesso |
| **Login com Telefone (+258)** | `+258847554622` + Senha | ✅ Sucesso |
| **Login com Telefone com Espaços** | `84 755 4622` + Senha | ✅ Sucesso (espaços removidos automaticamente) |
| **Login sem Identificador**| Apenas Senha | ❌ Mensagem de validação: "Insira seu email ou telefone" |
| **Nova Senha com `#` ou `_`**| `HubLink#2026!` | ✅ Aceite sem erros de caractere inválido |
