
async function track(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function identify(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function group(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function page(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function alias(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}

async function screen(msg, { apiKey }) {
  return sendMetric(msg, apiKey)
}
  
async function sendMetric(msg, apiKey) {
  const series = [{
    metric: 'segment.messages',
    points: [[Math.round(Date.now() / 1000), 1]],
    type: 'count',
    tags: [`source:${msg.projectId}`,`type:${msg.type}`]
  }]
  
  if (msg.type === 'track') series[0].tags.push(`event:${msg.event}`)
  
  const req = {
    body: JSON.stringify({ series }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "post"
  }

  const res = await fetch(`https://api.datadoghq.com/api/v1/series?api_key=${apiKey}`, req)
  return await res.json()
}
