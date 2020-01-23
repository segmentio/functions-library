# Sift Custom Destination Function
This example shows how to set up a custom destination function with [Sift](https://sift.com/), a solution that helps you prevent all types of online fraud and abuse. The destination not only sends events to Sift, but also takes the results from Sift and attaches the metric to a user's profile using the `identify` call.

## Setup
- [ ]  Create a [HTTP Source](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#http%20tracking%20api)
- [ ]  Generate a REST API Key from Sift

## How to use

Copy the `handler.js` code in this directory to your destination function

Replace the first line with your Segment write key that you generated from creating an HTTP Source

## Maintainers
[@shyaankhan](https://github.com/shyaankhan) Segment
[@ssaouma](https://github.com/ssaouma) Sift
[@juhaelee](https://github.com/juhaelee) Segment