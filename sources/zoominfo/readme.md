<img src="https://blog.zoominfo.com/wp-content/uploads/2020/01/Zoominfo.Lockup.Tagline.Stacked.Black_.png" width="400px"/>
Integrate with ZoomInfo's <a href="https://documenter.getpostman.com/view/7012197/SVYwLGXM?version=latest#cf83bb37-31cf-45d3-a276-08625ca04c60">"Contact Enrich" API.</a>

Recommended implementation: Create this as a Custom Source. For existing sources with users that you'd like to enrich with ZoomInfo data, connect them to a Webhook which sends to the URL of your Custom Source. You can use Destination Filters in front of the webhook if you'd only like to enrich a subset of your data.
This source will check for applicable match keys (e.g., email, company, first/last name) and attempt to collect an enriched profile from the ZoomInfo Enterprise Contact Enrich API. Any new data will be tracked as an Identify call, which you can use as needed in Personas or any Segment Destination.

Recommended Config Settings (already included in handler.js): <img src ="https://ucdf02d1ea1a17742a6968237ddb.dl.dropboxusercontent.com/cd/0/inline/A3yG3IF_rg1L_zui0ME7GBYrDipoDh7jzmzhQaG4ZYEBexPX-yStwmH9cG7p7XCMr8ZngQ5rwUZ5e72YZV8JTAP_yi6jWCIy-q8JcwcKEEIQO2ZsQ1vVK1YCBMTXB-hkCgY/file#" width="70%"/>
