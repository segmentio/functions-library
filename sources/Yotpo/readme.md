<img src="https://www.yotpo.com/wp-content/uploads/2018/03/share-cover-photo.png" width="400px"/>

This is a source function template that subscribes to new product reviews via <a href="https://apidocs.yotpo.com/reference#introduction-to-webhooks">Yotpo Webhooks.</a>

The payload from Yotpo webhooks does not include the product id or the user email, so this source function retreives this info from the Yotpo API using the review id that's provided in the webhook. To use this, you'll need to create two Settings within the Source Function named 'appKey' and 'secretKey' containting the keys available in the API Credentials section within Settings of your Yotpo account. 


