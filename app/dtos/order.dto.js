export function toOrderDTO(order) {
  if (!order) return null;
  return {
    id: order._id?.toString(),
    code: order.code,
    buyer: order.buyer?.first_name ? {
        first_name: order.buyer.first_name,
        last_name: order.buyer.last_name,
        email: order.buyer.email
    } : order.buyer, 
    items: order.items?.map(i => ({
      productId: i.productId?.toString ? i.productId.toString() : i.productId,
      title: i.title,
      qty: i.qty,
      unitPrice: i.unitPrice
    })) || [],
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}
