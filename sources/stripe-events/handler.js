exports.processEvents = async event => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;
  let returnValue = {
    objects: [],
    events: []
  };

  if (eventBody.type == "charge.succeeded") {
    const chargeSucceeded = {
      type: "track",
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
    };
    returnValue.events.push(chargeSucceeded);
  }

  if (eventBody.type == "customer.created") {
    const customerCreated = {
      type: "track",
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
    };

    const identify = {
      type: "identify",
      userId: eventBody.data.object.id,
      properties: {
        createTime: eventBody.data.object.created,
        account_balance: eventBody.data.object.account_balance,
        currency: eventBody.data.object.currency
      },
      context: {
        source: "Stripe"
      }
    };
    returnValue.events.push(customerCreated, identify);
  }

  if (eventBody.type == "customer.subscription.created") {
    const subscriptionCreated = {
      type: "track",
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
    };
    returnValue.events.push(subscriptionCreated);
  }

  if (eventBody.type == "customer.subscription.trial_will_end") {
    const subscriptionCreated = {
      type: "track",
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
    };
    returnValue.events.push(subscriptionCreated);
  }

  return returnValue;
};
