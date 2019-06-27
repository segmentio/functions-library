const axios = require('axios')

//---------------------------------------------------------------------
//                        ENV
//---------------------------------------------------------------------

// Config object to store Client and Token needed for GET requests.
const config = {
    'headers': {
        'x-auth-client': '',
        'x-auth-token': ''
    }
}
// storeId needed for GET requests
const storeId = ""

//---------------------------------------------------------------------
//
//---------------------------------------------------------------------

// primary function -- process events and produce track call
exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  let orderId = eventBody.data.id

  const customer_id = await getBigCommerceCustomerId(orderId)
  const sp = await payload(orderId)
  const eventName = await setEventName(orderId)


  let returnValue = {
    events: [
    {
        type: 'track',
        event: eventName,
        userId: customer_id,
        properties: sp

    }]
  }

  return(returnValue)
}

//---------------------------------------------------------------------
//                        HELPERS
//---------------------------------------------------------------------

// network request to retrieve order data
const getOrder = async orderId => {
    let orderNo = orderId
    const response = await axios.get(`https://api.bigcommerce.com/stores/${storeId}/v2/orders/${orderNo}`, config);
    const order = response.data;
    return order
}

// network request to retrieve product data by orderId
const getProducts = async orderId => {
    let orderNo = orderId
    const response = await axios.get(`https://api.bigcommerce.com/stores/${storeId}/v2/orders/${orderNo}/products`, config);
    const products = response.data;
    return products
}

// get order and set Track Event Name based on order status. All statuses that are not 'refunded', 'completed', or 'cancelled' will be 'updated'
const setEventName = async orderId => {
  const order = await getOrder(orderId);
  const status_id = order.status_id;
  const eventName = function() {
    return status_id === 10 ? "Order Completed"
          : status_id === 5 ? "Order Cancelled"
          : status_id === 4 || status_id === 14 ? "Order Refunded"
          : "Order Updated"
      }
  return eventName();
  }

// network request to retrive customer data by orderId
const getCustomer = async orderId => {
  const order = await getOrder(orderId);
  const customerId = String(order.customer_id)
  const response = await axios.get(`https://api.bigcommerce.com/stores/${storeId}/v2/customers/${customerId}`, config);
  let customer = response.data;
  // check if there are form fields (custom fields) on the customer table
  if (customer.form_fields){
    // here you can map form fields on the customer to the top level customer fields, instead of being stored in an array of objects
    customer.example = findFormFields("example",customer.form_fields);
  }

  return customer
}

const findFormFields = function search(nameKey, myArray){
          for (var i=0; i < myArray.length; i++) {
              if (myArray[i].name === nameKey) {
                  return myArray[i].value;
              }
          }
      }

// helper function to list of properties needed for track call based on order and products data
const payload = async orderId => {
    const order = await getOrder(orderId);
    const products = await getProducts(orderId);
    const customer = await getCustomer(orderId);

    const sp = {};
    sp['order_id'] = order.id;
    sp['customer_id'] = order.customer_id;
    sp['date_created'] = order.date_created;
    sp['date_modified'] = order.date_modified;
    sp['date_shipped'] = order.date_shipped;
    sp['status_id'] = order.status_id;
    sp['status'] = order.status;
    sp['subtotal_ex_tax'] = order.subtotal_ex_tax;
    sp['subtotal_inc_tax'] = order.subtotal_inc_tax;
    sp['base_shipping_cost'] = order.base_shipping_cost;
    sp['shipping_cost_ex_tax'] = order.shipping_cost_ex_tax;
    sp['shipping_cost_inc_tax'] = order.shipping_cost_inc_tax;
    sp['shipping_cost_tax'] = order.shipping_cost_tax;
    sp['shipping_cost_tax_class_id'] = order.shipping_cost_tax_class_id;
    sp['base_handling_cost'] = order.base_handling_cost;
    sp['handling_cost_inc_tax'] = order.handling_cost_inc_tax;
    sp['handling_cost_inc_tax'] = order.handling_cost_inc_tax;
    sp['handling_cost_tax'] = order.handling_cost_tax;
    sp['handling_cost_tax_class_id'] = order.handling_cost_tax_class_id;
    sp['base_wrapping_cost'] = order.base_wrapping_cost;
    sp['wrapping_cost_ex_tax'] = order.wrapping_cost_ex_tax;
    sp['wrapping_cost_inc_tax'] = order.wrapping_cost_inc_tax;
    sp['wrapping_cost_tax'] = order.wrapping_cost_tax;
    sp['wrapping_cost_tax_class_id'] = order.wrapping_cost_tax_class_id;
    sp['total_ex_tax'] = order.total_ex_tax;
    sp['total_inc_tax'] = order.total_inc_tax;
    sp['total_tax'] = order.total_tax;
    sp['items_total'] = order.items_total;
    sp['items_shipped'] = order.items_shipped;
    sp['payment_method'] = order.payment_method;
    sp['payment_provider_id'] = order.payment_provider_id;
    sp['payment_status'] = order.payment_status;
    sp['refunded_amount'] = order.refunded_amount;
    sp['order_is_digital'] = order.order_is_digital;
    sp['store_credit_amount'] = order.store_credit_amount;
    sp['gift_certificate_amount'] = order.gift_certificate_amount;
    sp['ip_address'] = order.ip_address;
    sp['geoip_country'] = order.geoip_country;
    sp['geoip_country_iso2'] = order.geoip_country_iso2;
    sp['currency_id'] = order.currency_id;
    sp['currency_code'] = order.currency_code;
    sp['currency_exchange_rate'] = order.currency_exchange_rate;
    sp['default_currency_id'] = order.default_currency_id;
    sp['orderDefaultCurrencyCode'] = order.orderDefaultCurrencyCode;
    sp['staff_notes'] = order.staff_notes;
    sp['customer_message'] = order.customer_message;
    sp['discount_amount'] = order.discount_amount;
    sp['coupon_discount'] = order.coupon_discount;
    sp['shipping_address_count'] = order.shipping_address_count
    sp['is_deleted'] = order.is_deleted;
    sp['ebay_order_id'] = order.ebay_order_id;
    sp['cart_id'] = order.cart_id;
    sp['is_email_opt_in'] = order.is_email_opt_in;
    sp['credit_card_type'] = order.credit_card_type;
    sp['order_source'] = order.order_source;
    sp['channel_id'] = order.channel_id;
    sp['external_source'] = order.external_source;
    sp['external_id'] = order.external_id;
    sp['external_merchant_id'] = order.external_merchant_id;
    sp['tax_provider_id'] = order.tax_provider_id;
    sp['custom_status'] = order.custom_status;
    sp['products'] = [];
      const len = products.length;
      for (var i = 0; i < len; i++) {
          sp['products'].push({
            productId: products[i].id,
            order_id: products[i].order_id,
            product_id: products[i].product_id,
            variant_id: products[i].variant_id,
            order_address_id: products[i].order_address_id,
            name: products[i].name,
            sku: products[i].sku,
            upc: products[i].upc,
            type: products[i].type,
            price_ex_tax: products[i].price_ex_tax,
            price_inc_tax: products[i].price_inc_tax,
            price_tax: products[i].price_tax,
            base_total: products[i].base_total,
            total_ex_tax: products[i].total_ex_tax,
            total_inc_tax: products[i].total_inc_tax,
            total_tax: products[i].total_tax,
            weight: products[i].weight,
            height: products[i].height,
            depth: products[i].depth,
            quantity: products[i].quantity,
            base_cost_price: products[i].base_cost_price,
            cost_price_inc_tax: products[i].cost_price_inc_tax,
            cost_price_ex_tax: products[i].cost_price_ex_tax,
            cost_price_tax: products[i].cost_price_tax,
            is_refunded: products[i].is_refunded,
            quantity_refunded: products[i].quantity_refunded,
            refund_amount: products[i].refund_amount,
            return_id: products[i].return_id,
            wrapping_name: products[i].wrapping_name,
            base_wrapping_cost: products[i].base_wrapping_cost,
            wrapping_cost_ex_tax: products[i].wrapping_cost_ex_tax,
            wrapping_cost_inc_tax: products[i].wrapping_cost_inc_tax,
            wrapping_cost_tax: products[i].wrapping_cost_tax,
            wrapping_message: products[i].wrapping_message,
            quantity_shipped: products[i].quantity_shipped,
            event_name: products[i].event_name,
            event_date: products[i].event_date,
            fixed_shipping_cost: products[i].fixed_shipping_cost,
            ebay_item_id: products[i].ebay_item_id,
            ebay_transaction_id: products[i].ebay_transaction_id,
            option_set_id: products[i].option_set_id,
            parent_order_product_id: products[i].parent_order_product_id,
            is_bundled_product: products[i].is_bundled_product,
            bin_picking_number: products[i].bin_picking_number,
            external_id: products[i].external_id,
            fulfillment_source: products[i].fulfillment_source
          });
      }
    return sp;
}
