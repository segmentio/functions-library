const BASE_API_URL = 'https://api.company-target.com/api/v2';
const IP_ENDPOINT= 'ip.json';

const BASE_API_V3_URL = 'https://autocomplete.demandbase.com/api/v3';
const DOMAIN_ENDPOINT = 'email.json';

const SEGMENT_API_ENDPOINT = 'https://api.segment.io/v1';
const IDENTIFY_ENDPOINT = 'identify';


//Takes a track call, extracts IP, pulls in info from demandbase and then passes it back into Segment
async function onTrack(msg, { demandbaseKey, segmentWriteKey }) {
  let ip_addr = extractIP(msg);
  if(ip_addr === null)
    throw new InvalidEventPayload('IP Address is required');

   let demandBaseData = await queryByIPAddress(ip_addr, demandbaseKey);
   let body = constructSegmentIdentifyObject(msg, demandBaseData);
   let segmentResponse = await sendSegmentIdentifyRequest(body, segmentWriteKey);
   return segmentResponse;
}

//Takes an identify call, queries demandbase with the email domain, and then passes it back into Segment
async function onIdentify(msg, { demandbaseKey, segmentWriteKey }) {
  let domain = extractEmailDomain(msg);
  if(domain === null)
    throw new InvalidEventPayload('Email Address is required');

  let demandBaseData = await queryByEmailDomain(domain, demandbaseKey);
  let body = constructSegmentIdentifyObject(msg, demandBaseData);
  let segmentResponse = await sendSegmentIdentifyRequest(body, segmentWriteKey);
  return segmentResponse;
}

//Demandbase Helpers
function extractIP (msg) {
  let ip = null;
  if(!!msg && !!msg.context && !!msg.context.ip)
    ip = msg.context.ip;

  return ip;
}

function extractEmailDomain(msg) {
    let domain = null;
    if(!!msg && !!msg.traits && !!msg.traits.email)
        domain = msg.traits.email.split('@')[1];

    return domain;
}

async function queryByIPAddress(ip_addr, apiKey) {
    let url = `${BASE_API_URL}/${IP_ENDPOINT}?key=${apiKey}&query=${ip_addr}`
    let response = await makeDemandBaseRequest(url);
    return response;
}

async function queryByEmailDomain (domain, apiKey) {
    let url = `${BASE_API_V3_URL}/${DOMAIN_ENDPOINT}?key=${apiKey}&domain=${domain}`
    let response = await makeDemandBaseRequest(url);
    return response;
}

async function makeDemandBaseRequest (url) {
    let response = await fetch(url, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Accept": "application/json"
        }),
        method: "GET"
      });

      return handleResponse(response);
}

function handleResponse(fetchResponse) {
    console.log(fetchResponse);
    if(!fetchResponse.ok)
        throw new ValidationError('Demandbase API did not return a valid response');

    return fetchResponse.json();
}

//Segment Helpers
function constructSegmentIdentifyObject (msg, traits) {
    let body = { traits };

    if(!!msg.anonymousId)
        body['anonymousId'] = msg.anonymousId;

    if(!!msg.userId)
        body['userId'] = msg.userId;

    return body;
}

async function sendSegmentIdentifyRequest (body, writeKey) {
    let res = await fetch(`${SEGMENT_API_ENDPOINT}/${IDENTIFY_ENDPOINT}`, {
        body: JSON.stringify(body),
        headers: new Headers({
          Authorization: "Basic " + btoa(writeKey),
          "Content-Type": "application/json",
        }),
        method: "POST"
      });

    return res.json();
}