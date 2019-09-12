
// CONFIG - defaults are probably best, but feel free to update
// 
// nb.  all of these "config" inputs could be updated to be "parameterized"
// so that you could dynamically set them in the UI (like apiKey)
// via per-source via settings values in the future

// if you dont want one of these tags below, you can just comment them out
// EVENT_TYPE_TAG is probably riskiest — if you have a ton of event names / dynamic events
// you could go over the cardinality limits
const SOURCE_ID_TAG = 'source'
const MESSAGE_TYPE_TAG = 'type'
const EVENT_TYPE_TAG = 'event'

const METRIC_NAME = 'segment.messages'

async function onTrack(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function onIdentify(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function onGroup(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function onPage(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function onAlias(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function onScreen(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}
  
async function sendMetric(msg, apiKey) {
  const metric = {
    metric: METRIC_NAME,
    points: [[Math.round(Date.now() / 1000), 1]],
    type: 'count',
    tags: []
  }
  
  if (EVENT_TYPE_TAG && msg.type === 'track') 
    metric.tags.push(`${EVENT_TYPE_TAG}:${msg.event}`)
  if (MESSAGE_TYPE_TAG)
    metric.tags.push(`${MESSAGE_TYPE_TAG}:${msg.type}`)
  if (SOURCE_ID_TAG) 
    metric.tags.push(`${SOURCE_ID_TAG}:${msg.projectId}`)
  
  const res = await fetch(`https://api.datadoghq.com/api/v1/series?api_key=${apiKey}`, {
    body: JSON.stringify({ series: [ metric ] }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "post"
  })
  
  return await res.json()
}
