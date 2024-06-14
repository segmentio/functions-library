// Learn more about source functions API at
// https://segment.com/docs/connections/sources/source-functions

/**
 * Handle incoming HTTP request
 *
 * @param  {FunctionRequest} request
 * @param  {FunctionSettings} settings
 */
async function onRequest(request, settings) {
  const body = request.json()
  console.log(body)
	
	if (body["environment"] == "PROD") {
    const type = body["notification_type"]
    switch(type) {
	    	case "CANCEL":
          var name = "Subscription Cancelled"
          var receipt = body["latest_receipt_info"]
				  break
			  case "DID_CHANGE_RENEWAL_PREF":
				  var name = "Subscription Change Scheduled"
          var receipt = body["latest_receipt_info"]
				  break
			  case "DID_CHANGE_RENEWAL_STATUS":
				  var name = "Subscription Renewal Status Changed"
          var receipt = body["latest_receipt_info"]
				  break
			  case "DID_FAIL_TO_RENEW":
				  var name = "Subscription Failed to Renew"
          receipt = body["latest_expired_receipt_info"]
				  break
			  case "DID_RECOVER":
				  var name = "Subscription Recovered in Billing Retry"
          var receipt = body["latest_receipt_info"]
				  break
			  case "INITIAL_BUY":
				  var name = "Subscription Purchased"
          var receipt = body["latest_receipt_info"]
				  break
			  case "INTERACTIVE_RENEWAL":
				  var name = "Subscription Renewed Interactively"
          var receipt = body["latest_receipt_info"]
				  break
			  case "PRICE_INCREASE_CONSENT":
				  var name = "Subscription Has Entered a Price Increase Flow"
          var receipt = body["latest_receipt_info"]
				  break
    }

	  // See https://segment.com/docs/connections/spec/track/
		Segment.track({
		    event: name,
		    userId: receipt["original_transaction_id"],
		    properties: {
		        ProductId: receipt["product_id"]
		    }
		})
  }
}