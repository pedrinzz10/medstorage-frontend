/** Perfis de acesso do sistema */
export type Role = 'admin' | 'gerente_estoque' | 'vendedor';

/** Usuário autenticado */
export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
  initials: string;
}

/** Status possíveis de um pedido */
export type OrderStatus =
  | 'CRIADO'
  | 'CONFIRMADO'
  | 'SEPARADO'
  | 'PRONTO'
  | 'FINALIZADO'
  | 'CANCELADO';

/** Item de pedido */
export interface OrderItem {
  productId: string;
  productName: string;
  quantidade: number;
  precoUnitario: number;
}

/** Pedido resumido para listagem */
export interface Order {
  id: string;
  numero: string;
  clienteNome: string;
  totalItens: number;
  valorTotal: number;
  dataCriacao: string;
  status: OrderStatus;
  items: OrderItem[];
}

/** Status de estoque */
export type StockStatus = 'OK' | 'ATENCAO' | 'CRITICO';

/** Produto no estoque */
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  precoUnitario: number;
  unidade: string;
  quantidadeAtual: number;
  disponivel: number;
  reservada: number;
  estoqueMinimo: number;
  statusEstoque: StockStatus;
}

/** Usuário para tela admin */
export interface SystemUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
  telefone?: string;
  ativo: boolean;
  initials: string;
}

/** Navegação lateral */
export interface NavItem {
  label: string;
  path: string;
  section?: string;
}

/** Tema da aplicação */
export type Theme = 'light' | 'dark';
