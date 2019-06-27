exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  const sp = await payload(eventBody)
  const eventName = await setEventName(eventBody)
  const order = eventBody

  let returnValue = {
    events: [
    {
        type: 'track',
        event: eventName,
        userId: String(order.customer.id),
        properties: sp
    }]
  }

  return(returnValue)
}

//---------------------------------------------------------------------
//                        HELPERS
//---------------------------------------------------------------------
const setEventName = async order => {
  const financial_status = order.financial_status;
  const fulfillment_status = order.fulfillment_status;

  const eventName = function() {
    return  financial_status === "refunded" ? "Order Refunded"
          : financial_status === "voided" ? "Order Cancelled"
          : financial_status === "paid" & fulfillment_status === "fulfilled" ? "Order Completed"
          : "Order Updated"
    }
  return eventName();
}


// helper function to build track call properties based on order and products data
const payload = async order => {
const line_items = order.line_items;

    const sp = {};
    sp['order_id'] = order.id;
    sp['order_number'] = order.order_number;
    sp['number'] = order.number;
    sp['financial_status'] = order.financial_status;
    sp['fulfillment_status'] = order.fulfillment_status;
    sp['currency'] = order.currency;
    sp['total_price'] = order.total_price;
    sp['subtotal_price'] = order.subtotal_price;
    sp['total_tax'] = order.total_tax;
    sp['total_discounts'] = order.total_discounts;
    sp['total_line_items_price'] = order.total_line_items_price;
    sp['order_name'] = order.name;
    sp['customer_first_name'] = order.customer.first_name;
    sp['customer_last_name'] = order.customer.last_name;
    sp['customer_email'] = order.email;
    sp['products'] = [];
      const len = line_items.length;
      for (var i = 0; i < len; i++) {
          sp['products'].push({
            productId: line_items[i].product_id,
            title: line_items[i].title,
            sku: line_items[i].sku,
            quantity: line_items[i].quantity,
            price: line_items[i].price,
            variant_id: line_items[i].variant_id,
            variant_title: line_items[i].variant_title,
            vendor: line_items[i].variant,
            requires_shipping: line_items[i].requires_shipping,
            taxable: line_items[i].taxable,
            name: line_items[i].name

          });
      }
    return sp;
}
