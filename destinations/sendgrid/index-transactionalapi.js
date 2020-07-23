/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
async function onTrack(event, settings) {
    // Learn more at https://segment.com/docs/connections/spec/track/
    
    //If either of these is not available in the call, use the getTrait function below
	let { name, email } = event.context.traits;

    //Change this to your exact template needs
	let favorite_video_category = await getTrait(
		email,
		'favorite_video_category'
    );

	const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
		method: 'POST',
		headers: new Headers({
			Authorization: `Bearer ${settings.apiKey}`,
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({
			personalizations: [
				{
					to: [{ email, name }],
					dynamic_template_data: {
						favorite_article_category: favorite_video_category
					}
				}
            ],
            //Change this to actual values
			from: { email: 'shauravgarg@benderapps.com', name: 'Shaurav Garg' },
			template_id: settings.templateId
		})
	});

	return await res.text();
}

async function getTrait(personasSpace, email, traitName) {
	const res = await fetch(
		`https://profiles.segment.com/v1/spaces/${personasSpace}/collections/users/profiles/email:${email}/traits`,
		{
			method: 'GET',
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Basic ${btoa(settings.profileApiKey)}`
			})
		}
	);

	let jsonResult = await res.json();
	return jsonResult.traits[traitName];
}
