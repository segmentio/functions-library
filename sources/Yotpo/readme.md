<img src="https://www.yotpo.com/wp-content/uploads/2018/03/share-cover-photo.png" width="400px"/>

This is a source function template that subscribes to new product reviews via <a href="https://apidocs.yotpo.com/reference#introduction-to-webhooks">Yotpo Webhooks.</a>

To use this, you'll need both the App Key and Secret Key from the API Credentials section within Settings of your Yotpo account. 

The payload from Yotpo webhooks does not include the product id or the user email, so this source function retreives this info from the Yotpo API using the review id that's provided in the webhook. 
