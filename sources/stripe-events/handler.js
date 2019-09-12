async function onRequest(request, settings) {
  let eventBody = request.json();

  if (eventBody.type == "charge.succeeded" && eventBody.data.object.customer) {
    Segment.track({
      event: "Charge Succeeded",
      userId: eventBody.data.object.customer,
      properties: {
        createTime: eventBody.data.object.created,
        amount: eventBody.data.object.amount,
        paid: eventBody.data.object.paid,
        status: eventBody.data.object.status
      },
      context: {
        source: "Stripe"
      }
    })
  }

  if (eventBody.type == "customer.created") {
    Segment.track({
      event: "Customer Created",
      userId: eventBody.data.object.id,
      properties: {
        createTime: eventBody.data.object.created,
        account_balance: eventBody.data.object.account_balance,
        currency: eventBody.data.object.currency
      },
      context: {
        source: "stripe"
      }  
    })

    Segment.identify({
      userId: eventBody.data.object.id,
      properties: {
        createTime: eventBody.data.object.created,
        account_balance: eventBody.data.object.account_balance,
        currency: eventBody.data.object.currency
      },
      context: {
        source: "Stripe"
      }
    })
  }

  if (eventBody.type == "customer.subscription.created") {
    Segment.track({
      event: "Subscription Created",
      userId: eventBody.data.object.customer,
      properties: {
        createTime: eventBody.data.object.created,
        plan_id: eventBody.data.object.plan.id,
        plan_name: eventBody.data.object.plan.name,
        plan_interval: eventBody.data.object.plan.interval,
        trial_start: eventBody.data.object.trial_start,
        trial_end: eventBody.data.object.trial_end
      },
      context: {
        source: "stripe"
      }
    })
  }

  if (eventBody.type == "customer.subscription.trial_will_end") {
    Segment.track({
      event: "Trial Ending Soon",
      userId: eventBody.data.object.customer,
      properties: {
        plan_id: eventBody.data.object.plan.id,
        plan_name: eventBody.data.object.plan.name,
        plan_interval: eventBody.data.object.plan.interval,
        trial_start: eventBody.data.object.trial_start,
        trial_end: eventBody.data.object.trial_end
      },
      context: {
        source: "stripe"
      }
    })
  }
}