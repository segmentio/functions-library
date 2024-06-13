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
  //console.log(body)
	
  const type = body["transactionType"]
  switch(type) {
    	case "Sale":
        var name = "Purchase or Renewal Occured"
			  break
		  case "Cancellation":
			  var name = "User Cancelled"
			  break
		  case "Refund":
			  var name = "Refund Occured"
			  break
		  case "Credit":
			  var name = "Credit Issued"
			  break
		  case "Resubscribe":
			  var name = "User Resubscribed"
			  break
    }

	  // See https://segment.com/docs/connections/spec/track/
		Segment.track({
		    event: name,
		    userId: body["customerId"],
		    properties: {
          transactionId: body["transactionId"],
          channelId: body["channelId"],
          channelName: body["channelName"],
          productCode: body["productCode"],
          productName: body["productName"],
		    }
		})
}