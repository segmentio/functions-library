// Supported Objects: order, plan, checkout-order
// Supported Events: Order Completed

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;
  let returnValue = {
    objects: [],
    events: []
  }
  
  if (eventBody.resource_type == 'order') {
  	const orderObj = {
      collection: eventBody.resource_type,
      id: eventBody.resource.id,
      properties: {
        createTime: eventBody.resource.create_time,
        updateTime: eventBody.resource.update_time,
        orderStatus: eventBody.event_type, // converts event_type as the status of the order
        revenue: eventBody.resource.amount.total,
        currency: eventBody.resource.amount.currency,
        transactionFeeValue: eventBody.resource.transaction_fee.value,
        transactionFeeCurrency: eventBody.resource.transaction_fee.currency,
        parentPayment: eventBody.resource.parent_payment,
        isFinalCapture: eventBody.resource.is_final_capture,
        state: eventBody.resource.state,
        webhookId: eventBody.id, // id of the incoming webhook
        source: 'Paypal'
      }
    }

  	returnValue.objects.push(orderObj)
  }

  if (eventBody.resource_type == 'plan') {
    const planObj = {
      collection: eventBody.resource_type,
      id: eventBody.resource.id,
      properties: {
        createTime: eventBody.resource.create_time,
        updateTime: eventBody.resource.update_time,
        status: eventBody.resource.status,
        tenureType: eventBody.resource.tenure_type,
        sequence: eventBody.resource.sequence,
        tier_mode: eventBody.resource.volume,
        webhookId: eventBody.id, // id of the incoming webhook
        source: 'Paypal'
      }
    }

  	returnValue.objects.push(planObj)
  }

  if (eventBody.resource_type == 'checkout-order') {
    const props = {
      createTime: eventBody.resource.create_time,
      updateTime: eventBody.resource.update_time,
      revenue: eventBody.resource.gross_amount.value,
      currency: eventBody.resource.gross_amount.currency_code,
      status: eventBody.resource.status,
      webhookId: eventBody.id, // id of the incoming webhook
      source: 'Paypal'
    }

    const checkoutObj = {
      collection: eventBody.resource_type,
      id: eventBody.resource.id,
      properties: props
    }

    const orderCompleted = {
      type: 'track',
      event: 'Order Completed',
      userId: eventBody.resource.payer.payer_id,
      properties: props
    }

  	returnValue.objects.push(checkoutObj)
    returnValue.events.push(orderCompleted)
  }

  return(returnValue)
}