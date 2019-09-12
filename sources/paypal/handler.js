/**
* Paypal Supported Objects: order, plan, checkout-order
* Paypal Supported Events: Order Completed
*
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  let eventBody = request.json()

  if (eventBody.resource_type == 'order') {
    Segment.set({
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
    })
  }

  if (eventBody.resource_type == 'plan') {
    Segment.set({
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
    })
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

    Segment.set({
      collection: eventBody.resource_type,
      id: eventBody.resource.id,
      properties: props
    })

    Segment.track({
      event: 'Order Completed',
      userId: eventBody.resource.payer.payer_id,
      properties: props
    })
  }
}