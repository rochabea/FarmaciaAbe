import { fetchUserOrders, type Order } from "./orders";
import { fetchUserManipulados, type Manipulado } from "./manipulados";
import { formatDate } from "./orders";

export type Notification = {
  id: string;
  type: "order" | "manipulado" | "info";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionParams?: Record<string, any>;
};

/**
 * Gera notificações baseadas nos pedidos e manipulados do usuário
 */
export async function generateNotifications(): Promise<Notification[]> {
  const notifications: Notification[] = [];

  try {
    // Busca pedidos do usuário
    const orders = await fetchUserOrders();
    
    // Gera notificações para pedidos recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      if (orderDate < thirtyDaysAgo) return; // Ignora pedidos muito antigos

      const orderId = order.id;
      const orderDateStr = formatDate(order.created_at);

      // Notificação de compra aprovada
      if (order.status === "aprovado" || order.status === "approved") {
        notifications.push({
          id: `order_approved_${orderId}`,
          type: "order",
          title: "Compra aprovada",
          message: `Seu pedido de ${orderDateStr} foi aprovado e está sendo preparado!`,
          createdAt: order.created_at,
          read: false,
          actionUrl: "/sacola",
          actionParams: { orderId },
        });
      }

      // Notificação de pedido em entrega
      if (order.status === "em_entrega" || order.status === "delivering") {
        notifications.push({
          id: `order_delivering_${orderId}`,
          type: "order",
          title: "Pedido em entrega",
          message: `Seu pedido de ${orderDateStr} saiu para entrega! Aguarde no local.`,
          createdAt: order.created_at,
          read: false,
          actionUrl: "/sacola",
          actionParams: { orderId },
        });
      }

      // Notificação de pedido entregue
      if (order.status === "entregue" || order.status === "delivered") {
        notifications.push({
          id: `order_delivered_${orderId}`,
          type: "order",
          title: "Pedido entregue",
          message: `Seu pedido de ${orderDateStr} foi entregue com sucesso!`,
          createdAt: order.created_at,
          read: false,
          actionUrl: "/sacola",
          actionParams: { orderId },
        });
      }

      // Notificação de item disponível para retirada
      if (order.status === "pronto_retirada" || order.status === "ready_pickup") {
        notifications.push({
          id: `order_ready_pickup_${orderId}`,
          type: "order",
          title: "Item disponível para retirada",
          message: `Seu pedido de ${orderDateStr} está pronto para retirada!`,
          createdAt: order.created_at,
          read: false,
          actionUrl: "/sacola",
          actionParams: { orderId },
        });
      }

      // Notificação de pedido cancelado
      if (order.status === "cancelado" || order.status === "cancelled") {
        notifications.push({
          id: `order_cancelled_${orderId}`,
          type: "order",
          title: "Pedido cancelado",
          message: `Seu pedido de ${orderDateStr} foi cancelado.`,
          createdAt: order.created_at,
          read: false,
          actionUrl: "/sacola",
          actionParams: { orderId },
        });
      }

      // Notificação de pagamento confirmado (para pedidos novos)
      const hoursSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60);
      if (hoursSinceOrder < 24 && (order.status === "aprovado" || order.status === "approved")) {
        notifications.push({
          id: `payment_confirmed_${orderId}`,
          type: "order",
          title: "Pagamento confirmado",
          message: `Pagamento do seu pedido de ${orderDateStr} foi confirmado! Obrigado por comprar conosco!`,
          createdAt: order.created_at,
          read: false,
          actionUrl: "/sacola",
          actionParams: { orderId },
        });
      }
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos para notificações:", error);
  }

  try {
    // Busca manipulados do usuário
    const manipulados = await fetchUserManipulados();

    // Gera notificações para manipulados recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    manipulados.forEach((manipulado) => {
      const manipuladoDate = new Date(manipulado.created_at);
      if (manipuladoDate < thirtyDaysAgo) return; // Ignora manipulados muito antigos

      const manipuladoId = manipulado.id;
      const manipuladoDateStr = formatDate(manipulado.created_at);

      // Notificação de manipulado enviado para análise
      if (manipulado.status === "Pendente") {
        notifications.push({
          id: `manipulado_pending_${manipuladoId}`,
          type: "manipulado",
          title: "Manipulado enviado para análise",
          message: `Seu pedido de manipulados (${manipulado.numero}) foi enviado para análise em ${manipuladoDateStr}.`,
          createdAt: manipulado.created_at,
          read: false,
          actionUrl: "/manipulados/status_manipulados",
          actionParams: { id: manipuladoId },
        });
      }

      // Notificação de manipulado aprovado
      if (manipulado.status === "Aprovado") {
        const approvalDate = manipulado.data_aprovacao 
          ? formatDate(manipulado.data_aprovacao)
          : manipuladoDateStr;
        
        notifications.push({
          id: `manipulado_approved_${manipuladoId}`,
          type: "manipulado",
          title: "Manipulado aprovado",
          message: `Seu pedido de manipulados (${manipulado.numero}) foi aprovado em ${approvalDate}!`,
          createdAt: manipulado.data_aprovacao || manipulado.created_at,
          read: false,
          actionUrl: "/manipulados/status_manipulados",
          actionParams: { id: manipuladoId },
        });
      }

      // Notificação de manipulado rejeitado
      if (manipulado.status === "Rejeitado") {
        const rejectionDate = manipulado.data_rejeicao 
          ? formatDate(manipulado.data_rejeicao)
          : manipuladoDateStr;
        
        notifications.push({
          id: `manipulado_rejected_${manipuladoId}`,
          type: "manipulado",
          title: "Manipulado rejeitado",
          message: `Seu pedido de manipulados (${manipulado.numero}) foi rejeitado em ${rejectionDate}.`,
          createdAt: manipulado.data_rejeicao || manipulado.created_at,
          read: false,
          actionUrl: "/manipulados/status_manipulados",
          actionParams: { id: manipuladoId },
        });
      }
    });
  } catch (error) {
    console.error("Erro ao buscar manipulados para notificações:", error);
  }

  // Ordena notificações por data (mais recentes primeiro)
  notifications.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return notifications;
}

