# Sistema de API Padronizado - Sensorama

Este documento explica como usar o sistema de API padronizado implementado no frontend do Sensorama, que se comunica com o backend Spring Boot usando o padrão `ResponseDTO`.

## Estrutura do Sistema

### 1. Tipos TypeScript (`types/api.ts`)

Contém todas as interfaces e tipos relacionados à API:

```typescript
// Tipo genérico para todas as respostas do backend
export interface ResponseDTO<T> {
  data: T;
  time: string;
}

// Tipos específicos para autenticação
export interface AuthRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
}
```

### 2. Serviço de API Base (`services/apiService.ts`)

Classe principal que gerencia todas as comunicações com o backend:

- **Configuração automática**: Headers, timeout, base URL
- **Interceptors**: Adiciona token automaticamente, trata erros
- **Extração de dados**: Remove automaticamente o wrapper `ResponseDTO`
- **Métodos HTTP**: GET, POST, PUT, DELETE, PATCH

#### Exemplo de uso:

```typescript
// O serviço automaticamente extrai os dados do ResponseDTO
const userData = await apiService.get<User>('/users/profile');
// userData já contém apenas os dados, sem o wrapper ResponseDTO
```

### 3. Serviço de Autenticação (`services/authService.ts`)

Serviço específico para operações de autenticação:

```typescript
// Login
const loginResult = await authService.login(username, password);

// Registro
const registerResult = await authService.register(userInfo);

// Logout
authService.logout();
```

## Como Usar

### Login (Implementado)

O componente de login já está integrado com o novo sistema:

```typescript
const handleLogin = async () => {
  try {
    await authService.login(user, password);
    // Login bem-sucedido - token é automaticamente armazenado
    router.push('/homePage/home');
  } catch (error) {
    const apiError = error as ApiError;
    Alert.alert('Erro', apiError.message);
  }
};
```

### Registro (Implementado)

O componente de registro também usa o novo sistema:

```typescript
const handleRegister = async () => {
  try {
    const registrationData: UserRegistrationRequest = {
      username: user,
      email,
      password,
    };
    
    await authService.register(registrationData);
    // Registro bem-sucedido
  } catch (error) {
    const apiError = error as ApiError;
    Alert.alert('Erro', apiError.message);
  }
};
```

### Adicionando Novos Endpoints

Para adicionar novos endpoints, você pode:

1. **Usar o apiService diretamente**:
```typescript
import apiService from '../services/apiService';

// GET
const products = await apiService.get<Product[]>('/products');

// POST
const newProduct = await apiService.post<Product>('/products', productData);
```

2. **Criar um serviço específico** (recomendado):
```typescript
// services/productService.ts
import apiService from './apiService';

export class ProductService {
  async getProducts(): Promise<Product[]> {
    return apiService.get<Product[]>('/products');
  }
  
  async createProduct(product: CreateProductRequest): Promise<Product> {
    return apiService.post<Product>('/products', product);
  }
}

export const productService = new ProductService();
```

## Configuração

### URL da API

Ajuste a URL base no arquivo `services/apiService.ts`:

```typescript
constructor() {
  this.baseURL = 'http://localhost:8080/sensorama/api'; // Altere aqui
}
```

### Gerenciamento de Token

O sistema inclui métodos para armazenar/recuperar tokens. Implemente conforme necessário:

```typescript
// Em apiService.ts
private getStoredToken(): string | null {
  // Implementar com AsyncStorage, SecureStore, etc.
  return null;
}

private storeToken(token: string): void {
  // Implementar armazenamento seguro do token
}
```

## Tratamento de Erros

O sistema padroniza o tratamento de erros:

```typescript
try {
  const result = await apiService.get('/some-endpoint');
} catch (error) {
  const apiError = error as ApiError;
  // apiError.message contém a mensagem de erro do backend
  // apiError.status contém o código HTTP
  // apiError.code contém o código específico do erro
}
```

## Benefícios

1. **Consistência**: Todas as chamadas de API seguem o mesmo padrão
2. **Manutenibilidade**: Mudanças na API podem ser feitas em um local central
3. **Type Safety**: TypeScript garante tipagem correta
4. **Reutilização**: Código pode ser facilmente reutilizado
5. **Tratamento de Erros**: Padronizado e centralizado

## Próximos Passos

1. Implementar armazenamento seguro de token (AsyncStorage/SecureStore)
2. Adicionar outros serviços conforme necessário
3. Implementar refresh token se necessário
4. Adicionar interceptors para logging/debugging
5. Configurar diferentes URLs para desenvolvimento/produção
