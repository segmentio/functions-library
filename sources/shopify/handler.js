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
    sp['order_number'] = order.number;
    sp['financial_status'] = order.financial_status;
    sp['fulfillment_status'] = order.fulfillment_status;
    sp['currency'] = order.currency;
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
            total_discount: line_items[i].total_discount,
            productSku: line_items[i].sku,
            productUpc: line_items[i].upc,
            productType: line_items[i].type,
            productExcludingTax: line_items[i].price_ex_tax,
            productIncludingTax: line_items[i].price_inc_tax
          });
      }
    return sp;
}
