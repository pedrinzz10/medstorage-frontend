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
  numeroPedido: string;
  customerId: string;
  customerNome: string;
  status: OrderStatus;
  valorTotal: number;
  descontoAplicado?: number;
  tipoDesconto?: string;
  notas?: string;
  dataConfirmado?: string;
  dataSeparado?: string;
  dataPronte?: string;
  dataFinalizado?: string;
  items: OrderItem[];
}

/** Status de estoque */
export type StockStatus = 'OK' | 'ATENCAO' | 'CRITICO';

/** Produto no estoque */
export interface InventoryItem {
  id: string;
  nome: string;
  sku: string;
  quantidadeAtual: number;
  disponivel: number;
  reservada: number;
  estoqueMinimo: number;
  statusEstoque: StockStatus;
}

/** Produto do catálogo */
export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  sku: string;
  precoUnitario: number;
  unidade: string;
  estoqueMinimo: number;
  ativo: boolean;
}

/** Cliente */
export interface Customer {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cnpj?: string;
  endereco?: string;
  contatoPrincipal?: string;
  totalPedidos?: number;
  valorTotalGasto?: number;
  ultimaCompra?: string;
}

/** Comissão de vendedor */
export type CommissionStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO';

export interface Commission {
  id: string;
  vendedorId: string;
  vendedorNome: string;
  periodoInicio: string;
  periodoFim: string;
  totalPedidos: number;
  valorVendido: number;
  quantidadeUnidades: number;
  taxaComissao: number;
  valorComissao: number;
  status: CommissionStatus;
}

/** Devolução */
export type ReturnStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export interface ReturnItem {
  productId: string;
  productName: string;
  quantidade: number;
  motivo?: string;
}

export interface Return {
  id: string;
  numeroRetorno: string;
  orderId: string;
  numeroPedido: string;
  processadoPor?: string;
  status: ReturnStatus;
  motivo: string;
  dataSolicitacao: string;
  dataProcessamento?: string;
  items: ReturnItem[];
}

/** Desempenho de vendedor */
export interface SellerPerformance {
  vendedorId: string;
  vendedorNome: string;
  vendedorEmail: string;
  totalPedidos: number;
  valorVendido: number;
  quantidadeUnidades: number;
}

/** Movimentação de estoque */
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface InventoryMovement {
  id: string;
  productId: string;
  productNome: string;
  tipo: MovementType;
  quantidade: number;
  motivo?: string;
  referenciaTipo?: string;
  criadoPorEmail?: string;
  createdAt: string;
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

/** Tema da aplicação */
export type Theme = 'light' | 'dark';
