// This is the simulated window object global for the custom code function. All
// exported functions, types, and constants will become available to the
// executed function. Make sure this is the intended goal before exporting new
// members to the window.
//
// @ts-nocheck
const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');
const { Request, Response, Headers } = fetch;
const _ = require("lodash");
const { merge } = _;

const _url = Symbol('url');
const _headers = Symbol('headers');
const _body = Symbol('body');

// For now, we are using Response object as the base type. We are doing
// the specifically so that we can utilize the Response object's body
// handling methods. This should be replaced with something a bit less
// hacky in the future. Generally, the web standard Request/Response
// objects are designed from the perspective of a client. As this handler
// code is running in a server context, the responsibilities of these
// respective types are reversed.
class ServerRequest {
  constructor(input, init) {
    if (init) {
      const { headers, url } = init;
      this[_headers] = headers instanceof Headers ? headers : new Headers(headers);
      this[_url] = url instanceof URL ? url : new URL(url);
    }
    switch (typeof input) {
    case 'object':
      this[_body] = { json: input };
      break;
    case 'string':
      this[_body] = { text: input };
      break;
    default:
      throw new TypeError("unsupported body type")
    }
  }

  get url() { return this[_url]; }
  get headers() { return this[_headers]; }

  json() {
    const body = this[_body];
    if (!body.json) {
      body.json = JSON.parse(body.text);
    }
    return body.json;
  }

  text() {
    const body = this[_body];
    if (!body.text) {
      body.text = JSON.stringify(body.json);
    }
    return body.text;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class EventNotSupported extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class InvalidEventPayload extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

const Segment = {
  events: [],
  objects: [],

  set(d) {
    // TODO: Stricter validation for collection, id, and properties - see spec
    assertExists(d, "collection")
    assertExists(d, "id")
    setObject = {
      collection: d.collection,
      id: d.id,
    }
    setAttribute(setObject, "properties", d.properties)
    this.objects.push(setObject)
    return setObject
  },

  // https://segment.com/docs/spec/identify/
  identify(d){
    partialObj = {
      type: "identify"
    }
    setAttribute(partialObj, "traits", d.traits)
    obj = merge(partialObj, common(d))
    this.events.push(obj)
    return obj
  },

  // https://segment.com/docs/spec/track/
  track(d) {
    assertExists(d, "event")

    partialObj = {
      type: "track",
      event: d.event,
    }
    setAttribute(partialObj, "properties", d.properties)
    obj = merge(partialObj, common(d))
    this.events.push(obj)
    return obj
  },

  // https://segment.com/docs/spec/page/
  page(d) {
    partialObj = {
      type: "page",
    }
    setAttribute(partialObj, "name", d.name)
    setAttribute(partialObj, "properties", d.properties)
    obj = merge(partialObj, common(d))
    this.events.push(obj)
    return obj
  },

  // https://segment.com/docs/spec/screen/
  screen(d) {
    partialObj = {
      type: "screen",
    }
    setAttribute(partialObj, "name", d.name)
    setAttribute(partialObj, "properties", d.properties)
    obj = merge(partialObj, common(d))
    this.events.push(obj)
    return obj
  },

  // https://segment.com/docs/spec/group/
  group(d) {
    assertExists(d, "groupId")
    partialObj = {
      type: "group",
      groupId: d.groupId
    }
    setAttribute(partialObj, "traits", d.traits)
    obj = merge(partialObj, common(d))
    this.events.push(obj)
    return obj
  },

  // https://segment.com/docs/spec/alias/
  alias(d) {
    assertExists(d, "previousId")
    partialObj = {
      type: "alias",
    }
    setAttribute(partialObj, "previousId", d.previousId)
    obj = merge(partialObj, common(d))
    this.events.push(obj)
    return obj
  },
}

// https://segment.com/docs/spec/common/
// Attributes that are defined in the spec, but will be set by Tracking API:
// [receivedAt, version]
function common(d) {
  assertOneOfExists(d, ["userId", "anonymousId"])
  let res = {}
  setAttribute(res, "userId", d.userId)
  setAttribute(res, "anonymousId", d.anonymousId)
  setAttribute(res, "context", d.context) // REVISIT: Set user-agent?
  setAttribute(res, "integrations", d.integrations)
  setAttribute(res, "messageId", d.messageId) // REVISIT: Should buildpack hash the obj to create this ID?
  setAttribute(res, "sentAt", d.sentAt)  // ISO-8601 date string, Timestamp of when a message is sent to Segment
  // REVISIT: maybe expect some kind of Time object and we perform the toString() transformation?
  setAttribute(res, "timestamp", d.timestamp) // ISO-8601 date string, Timestamp when the message itself took place

  return res
}

// Sets the attribute if value is not empty
function setAttribute(object, attribute, value) {
  if (value) {
    object[attribute] = value
  }
}

// Throws ValidationError if the attribute is empty or undefined
function assertExists(object, attribute) {
  if ((typeof object[attribute] === "undefined") || (object[attribute] === "")){
    throw new ValidationError(`${attribute} is required but not defined`)
  }
  return true
}

function assertOneOfExists(object, attributes) {
  if (typeof attributes === 'string') {
    attributes = [attributes]
  }

  for (let attribute of attributes) {
    if (object[attribute]){
      return true
    }
  }

  throw new ValidationError(`One of ${attributes} is required but not defined`)
}

// Create a 'dummy' window object. This makes the environment more
// browser-like, and it accomodates some feature detection strategies.
// Deno does this as well, so it sets us up for a possible migration
// down the road.
module.exports = {
  AWS: require('aws-sdk'),
  atob: require('atob'),
  btoa: require('btoa'),
  crypto: require('crypto'),
  FormData: require('form-data'),
  OAuth: require('oauth'),
  xml: require('xml'),
  _,
  console,
  Buffer,
  URL,
  URLSearchParams,
  fetch,
  Request,
  Response,
  ServerRequest,
  Headers,
  clearTimeout,
  clearInterval,
  setTimeout,
  setInterval,
  ValidationError,
  EventNotSupported,
  InvalidEventPayload,
  Segment,
};