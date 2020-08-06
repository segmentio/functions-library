Demandbase is an ABM platform. One of the features that customers seem to use is enrichment functionality. This function is to show how that can be leveraged. Please note you can run the same logic client-side as well via some middleware function since many client websites will already be pulling Demandbase enrichment info into some sort of javascript variable.

There are two examples:
1) onTrack: Takes the IP field from the context object and returns an identify call back into Segment with the enrichment info obtained from Demandbase ip.json endpoint
2) onIdentify: Takes the email field from the traits object and returns an identify call back into Segment with the enrichment info from Demandbase email.json endpoint

Settings:
1) Demandbase Key: If you go to the customer webiste with Demandbase integrated, search for ip.json or email.json in Dev Tools -> Network to find it. It will be the 'key' query parameter.
2) Segment Write Key: This is where you want the identify call with the enrichment info to go to



