export interface OrderProductOption {
  [k: string]: any
}
export interface OrderProductItem {
  [k: string]: any
}

export interface OrderShipmentProductItem {
  [k: string]: any
}

export interface OrderShipmentItem {
  [k: string]: any
}

export interface OrderShippedItem extends OrderShipmentItem {
  itemsInfo: OrderProductItem[],
  [k: string]: any
}

export interface OrderShippingAddressItem {
  [k: string]: any
}

export interface OrderHistoryItem{
  [k: string]: any
}

export interface B2BOrderData {
  [k: string]: any
}

// export interface OrderActionProps {
//   [k: string]: any
// }

const getOrderShipping = (data: B2BOrderData) => {
  const {
    shipments,
    shippingAddress = [],
    products = [],
  } = data

  const shipmentsInfo = shipments || []
  const shippedItems = shipmentsInfo.map((shipment: OrderShipmentItem) => {
    const {
      items,
    } = shipment

    const itemsInfo: OrderProductItem[] = []
    items.forEach((item: OrderShipmentProductItem) => {
      const product = products.find((product: OrderProductItem) => product.product_id === item.product_id)
      if (product) {
        itemsInfo.push({
          ...product,
          current_quantity_shipped: item.quantity,
        })
      }
    })

    return {
      ...shipment,
      itemsInfo,
    }
  })

  const shippings = shippingAddress.map((address: OrderShippingAddressItem) => {
    const notShipItem: OrderShippedItem = {
      isNotShip: true,
      itemsInfo: products.filter((product: OrderProductItem) => product.quantity > product.quantity_shipped),
    }

    return {
      ...address,
      shipmentItems: [
        ...(shippedItems.filter((shippedItem: OrderShippedItem) => shippedItem.order_address_id === address.id)),
        notShipItem,
      ],
    }
  })

  return shippings
}

const getOrderSummary = (data: B2BOrderData) => {
  const {
    dateCreated,
    firstName,
    lastName,
    totalTax,
    subtotalExTax,
    subtotalIncTax,
    totalExTax,
    totalIncTax,
    handlingCostExTax,
    handlingCostIncTax,
    shippingCostExTax,
    shippingCostIncTax,
  } = data

  const orderSummary = {
    createAt: dateCreated,
    name: `${firstName} ${lastName}`,
    priceData: {
      SubTotal: subtotalExTax || subtotalIncTax,
      Shipping: shippingCostExTax || shippingCostIncTax,
      HandingFee: handlingCostExTax || handlingCostIncTax,
      Tax: totalTax,
      GrandTotal: totalExTax || totalIncTax,
    },
  }

  return orderSummary
}

const getPaymentData = (data: B2BOrderData) => {
  const {
    updatedAt,
    billingAddress,
    paymentMethod,
  } = data

  return {
    updatedAt,
    billingAddress,
    paymentMethod,
  }
}

export const convertB2BOrderDetails = (data: B2BOrderData) => ({
  shippings: getOrderShipping(data),
  history: data.orderHistoryEvent || [],
  poNumber: data.poNumber || '',
  status: data.status,
  statusCode: data.statusId,
  currencyCode: data.currencyCode,
  money: data.money,
  orderSummary: getOrderSummary(data),
  payment: getPaymentData(data),
  orderComments: data.customerMessage,
  products: data.products,
})
