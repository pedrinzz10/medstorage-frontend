/** Perfis de acesso do sistema */
export type Role = 'admin' | 'gerente_estoque' | 'vendedor';

/** Usuário autenticado (initials é calculado client-side a partir de nome) */
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

/** Lote consumido por um item de pedido — espelha OrderItemBatchResponse */
export interface OrderItemBatch {
  lote: string;
  validade: string;
  quantidadeConsumida: number;
}

/** Item de pedido — espelha OrderItemResponse */
export interface OrderItem {
  id: string;
  productId: string;
  productNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  lotes: OrderItemBatch[];
}

/** Pedido resumido para listagem — espelha OrderResponse */
export interface Order {
  id: string;
  numeroPedido: string;
  customerId: string;
  customerNome: string;
  criadoPor?: string;
  status: OrderStatus;
  valorTotal: number;
  descontoAplicado?: number;
  tipoDesconto?: string;
  notas?: string;
  createdAt?: string;
  dataConfirmado?: string;
  dataSeparado?: string;
  dataPronte?: string;
  dataFinalizado?: string;
  finalizadoPor?: string;
  items: OrderItem[];
}

/** Status de estoque */
export type StockStatus = 'OK' | 'ATENCAO' | 'CRITICO';

/** Produto no estoque — espelha InventoryStatusResponse */
export interface InventoryItem {
  id: string;
  nome: string;
  sku: string;
  quantidadeAtual: number;
  disponivel: number;
  reservada: number;
  estoqueMinimo: number;
  statusEstoque: StockStatus;
  precoBase: number;
  unidade: string;
}

/** Produto do catálogo — espelha ProductResponse */
export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  sku: string;
  precoBase: number;
  unidade: string;
  estoqueMinimo: number;
  ativo: boolean;
}

/** Cliente — espelha CustomerResponse / CustomerDetailResponse */
export interface Customer {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cnpj?: string;
  endereco?: string;
  contatoPrincipal?: string;
  dadosAdicionais?: Record<string, unknown>;
  totalPedidos?: number;
  valorTotalGasto?: number;
  ultimaCompra?: string;
}

/** Comissão de vendedor — espelha CommissionResponse */
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

/** Devolução — espelha ReturnResponse */
export type ReturnStatus = 'PENDENTE' | 'PROCESSADO' | 'REJEITADO';

export interface ReturnItem {
  id: string;
  productId: string;
  productNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
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

/** Desempenho de vendedor — espelha SellerPerformanceResponse */
export interface SellerPerformance {
  vendedorId: string;
  vendedorNome: string;
  vendedorEmail: string;
  totalPedidos: number;
  valorVendido: number;
  quantidadeUnidades: number;
}

/** Classificação ABC de produto — espelha ProductAbcResponse */
export type AbcClasse = 'A' | 'B' | 'C';

export interface ProductAbc {
  productId: string;
  nome: string;
  sku: string;
  valorVendido: number;
  quantidadeVendida: number;
  percentualAcumulado: number;
  classe: AbcClasse;
}

/** Lote de produto — espelha BatchResponse */
export interface Batch {
  id: string;
  productId: string;
  lote: string;
  validade: string;
  quantidade: number;
  diasParaVencer: number;
}

/** Pedido que consumiu um lote — espelha BatchOrderTraceResponse */
export interface BatchOrderTrace {
  numeroPedido: string;
  customerNome: string;
  status: OrderStatus;
  quantidadeConsumida: number;
  dataConsumo: string;
}

/** Material consignado — espelha ConsignmentResponse/ConsignmentItemResponse */
export type ConsignmentStatus = 'ATIVO' | 'ENCERRADO';

export interface ConsignmentItem {
  id: string;
  productId: string;
  productNome: string;
  lote?: string;
  validade?: string;
  quantidadeEnviada: number;
  quantidadeUsada: number;
  quantidadeDevolvida: number;
  saldoDisponivel: number;
  precoUnitario: number;
}

export interface Consignment {
  id: string;
  customerId: string;
  customerNome: string;
  status: ConsignmentStatus;
  observacoes?: string;
  createdAt: string;
  items: ConsignmentItem[];
}

/** Movimentação de estoque — espelha InventoryMovementResponse */
export type MovementType = 'IN' | 'OUT';

export interface InventoryMovement {
  id: string;
  productId: string;
  productNome: string;
  tipo: MovementType;
  quantidade: number;
  motivo: string;
  referenciaId?: string;
  referenciaTipo?: string;
  criadoPorEmail?: string;
  createdAt: string;
}

/** Usuário para tela admin — espelha UserResponse */
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
