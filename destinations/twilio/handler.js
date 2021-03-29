async function onIdentify(event, settings) {
  try {
    const auth = `${settings.accountSid}:${settings.authToken}`;

    // check for phone number
    if (!event.traits.phone) throw new Error('No phone number');

    // do a lookup to validate phone number
    const rawNumber = encodeURI(event.traits.phone);
    const lookup = await fetch(
      `https://lookups.twilio.com/v1/PhoneNumbers/${rawNumber}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(auth)}`
        }
      }
    );
    const lookupRes = await lookup.json();
    // check for valid phone number
    if (lookupRes.status === 404) throw new Error('Invalid phone number');

    // set variables for message
    const to = lookupRes.phone_number;
    const message = settings.message;
    const from = settings.from;
    const body = encodeURI(`Body=${message}&To=${to}&From=${from}`);
    let url = new URL(
      `https://api.twilio.com/2010-04-01/Accounts/${settings.accountSid}/Messages.json`
    );

    // send the message
    const send = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(auth)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
    const sendRes = await send.json();
    // check for successful queue
    if (sendRes.status !== 'queued') throw new Error(JSON.stringify(sendRes));
  } catch (err) {
    throw new Error(err);
  }
}
