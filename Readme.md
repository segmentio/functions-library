# Segment Functions Library

This repository contains a set of community-generated functions, to serve
as examples to base your own functions upon. If you're building out a new
integration, or a custom piece of code that you want Segment to run, use
this repo as the set of examples.

![](https://github.com/segmentio/functions-library/workflows/CI/badge.svg)

## Sources

- [Adyen](./sources/adyen) - Subscribes to Adyen webhooks
- [Audit Forwarding](./sources/audit-forwarding) - Enhances Segment Audit Forwarding
- [Close.io](./sources/close-io) - Subscribes to Close.io webhooks
- [Formstack](./sources/formstack) - Subscribes to Formstack webhooks
- [Github](./sources/github) - Subscribes to Github webhooks
- [Google Sheets](./sources/google-sheets) - Subscribes to Google Sheets webhooks
- [Influitive](./sources/influitive) - Subscribes to Influitive webhooks
- [LeanPlum](./sources/leanplum) - Subscribes to Leanplum webhooks
- [Paypal](./sources/paypal) - Subscribes to Paypal webhooks
- [Pipedrive](./sources/pipedrive) - Subscribes to Pipedrive webhooks
- [Shippo](./sources/shippo) - Subscribes to Shippo webhooks
- [Shopify](./sources/shopify) - Subscribes to Shopify webhooks
- [Stripe Events](./sources/stripe-events) - Subscribes to Stripe webhooks
- [SurveyMonkey](./sources/survey-monkey) - Subscribes to SurveyMonkey webhooks
- [Talkable](./sources/talkable) - Subscribes to Talkable webhooks
- [Typeform](./sources/typeform) - Subscribes to Typeform webhooks


## Destinations

- [Airtable](./destinations/airtable) - Capture user feedback and send through to your Airtable
- [Follow Along](./destinations/follow-along) - Generates Fullstory links and sends to Slack
- [Requestbin](./destinations/requestbin) - Sends events to RequestBin for introspection
- [Slack](./destinations/slack) - Adds a Gravatar icon to events with an email and sends messages to Slack
- [Zendesk](./destinations/zendesk) - Create new Zendesk tickets triggered by events that you send
- [Datadog](./destinations/datadog) - Sends a metric to datadog with high level message/event type as tags
- [Optimizely](./destinations/optimizely) - Sends conversion metrix to optimizely.
- [Radar](./destinations/radar) - Send events to Radar for enrichment with location context

## Development

Run tests with:

```
yarn && yarn test
```
