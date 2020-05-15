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
  const data = body["message"]["data"]
  const decoded_data = atob(data)
  devNot = JSON.parse(decoded_data)

  if (devNot["oneTimeProductNotification"]){
    if (devNot["oneTimeProductNotification"]["notificationType"] == 1){
      var name = "One Time Product Purchased"
    }
    if (devNot["oneTimeProductNotification"]["notificationType"] == 2){
      var name = "One Time Product Cancelled"
    }
    
    Segment.track({
    		    event: name,
    		    userId: devNot["oneTimeProductNotification"]["purchaseToken"],
    		    properties: {
              sku: devNot["oneTimeProductNotification"]["sku"]
    		    }
    		})
  }
  
  if (devNot["subscriptionNotification"]){
    const type = devNot["subscriptionNotification"]["notificationType"]
    switch(type) {
    	    	case 1:
              var name = "Subscription Recovered"
    				  break
    			  case 2:
    				  var name = "Subscription Renewed"
    				  break
    			  case 3:
    				  var name = "Subscription Cancelled"
    				  break
    			  case 4:
    				  var name = "Subscription Purchased"
    				  break
    			  case 5:
    				  var name = "Subscription On Hold"
    				  break
    			  case 6:
    				  var name = "Subscription In Grace Period"
    				  break
    			  case 7:
    				  var name = "Subscription Restarted"
    				  break
    			  case 8:
    				  var name = "Subscription Price Change Confirmed"
    				  break
    			  case 9:
    				  var name = "Subscription Deferred"
    				  break
    			  case 10:
    				  var name = "Subscription Paused"
    				  break
    			  case 11:
    				  var name = "Subscription Pause Schedule Changed"
    				  break
    			  case 12:
    				  var name = "Subscription Revoked"
    				  break
    			  case 13:
    				  var name = "Subscription Expired"
    				  break
        }
        Segment.track({
        		    event: name,
        		    userId: devNot["subscriptionNotification"]["purchaseToken"],
        		    properties: {
                  subscriptionId: devNot["subscriptionNotification"]["subscriptionId"]
        		    }
        		})
  }
}