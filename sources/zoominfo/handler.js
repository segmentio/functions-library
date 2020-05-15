/**
 * Handle incoming HTTP request
 *
 * @param  {FunctionRequest} request
 * @param  {FunctionSettings} settings
 */
async function onRequest(request, settings) {
	const body = request.json();

	//handle ZoomInfo authentication
	const authResponse = await fetch('https://api.zoominfo.com/authenticate', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			username: settings.aZoomInfoApiUsername,
			password: settings.bZoomInfoApiPassword
		})
	});
	let authJSON = await authResponse.json();
	let JWT = authJSON['jwt'];

	//ZoomInfo API Docs: https://documenter.getpostman.com/view/7012197/SVYwLGXM?version=latest#cf83bb37-31cf-45d3-a276-08625ca04c60
	let callType = '';
	let trackedProps = {};
	let groupProps = {};
	let zoomReq = { matchPersonInput: [], outputFields: [] };
	let matchKeys = {};
	let outputKeys = [
		'id',
		'firstname',
		'middlename',
		'lastname',
		'email',
		'hascanadianemail',
		'phone',
		'directphonedonotcall',
		'gender',
		'street',
		'city',
		'region',
		'metroarea',
		'zipcode',
		'state',
		'country',
		'personhasmoved',
		'withineu',
		'withincalifornia',
		'withincanada',
		'lastupdateddate',
		'noticeprovideddate',
		'salutation',
		'suffix',
		'jobtitle',
		'jobfunction',
		'companydivision',
		'education',
		'hashedemails',
		'picture',
		'mobilephonedonotcall',
		'externalurls',
		'companyid',
		'companyname',
		'companyphone',
		'companyfax',
		'companystreet',
		'companycity',
		'companystate',
		'companyzipcode',
		'companycountry',
		'companylogo',
		'contactaccuracyscore',
		'companywebsite',
		'companyrevenue',
		'companyrevenuenumeric',
		'companyemployeecount',
		'companytype',
		'companyticker',
		'companyranking',
		'isdefunct',
		'companysocialmediaurls',
		'companyprimaryindustry',
		'companyindustries',
		'companyrevenuerange',
		'companyemployeerange',
		'employmenthistory',
		'managementlevel',
		'companyId'
	];
	if (settings.cCustomOutputFields.length) {
		outputKeys = settings.cCustomOutputFields;
	}
	if ('type' in body) {
		callType = body['type'];
	}
	console.log(callType);
	if (callType == 'identify') {
		trackedProps = body['traits'];
	} else if (callType == 'track') {
		trackedProps = body['properties'];
	}

	let hasEmail, hasFirstName, hasLastName, hasFullName, hasCompany;
	if ('email' in trackedProps) {
		matchKeys['emailAddress'] = trackedProps['email'];
		hasEmail = true;
	}
	if ('first_name' in trackedProps) {
		matchKeys['firstName'] = trackedProps['first_name'];
		hasFirstName = true;
	}
	if ('last_name' in trackedProps) {
		matchKeys['lastName'] = trackedProps['last_name'];
		hasLastName = true;
	}
	if ('company' in trackedProps) {
		matchKeys['companyName'] = trackedProps['company'];
		hasCompany = true;
	}
	if ('name' in trackedProps) {
		matchKeys['fullName'] = trackedProps['name'];
		hasfullName = true;
	}

	if (
		!hasEmail &&
		!(hasFirstName && hasLastName && hasCompany) &&
		!(hasFullName && hasCompany) &&
		!settings.eAllowBadRequests
	) {
		throw new Error('Insufficient match keys - abandoning request.');
		return;
	}

	zoomReq['matchPersonInput'].push(matchKeys);
	zoomReq['outputFields'] = outputKeys;

	//query ZoomInfo
	const enrichURL = "https://api.zoominfo.com/enrich/contact"
	const enrichResponse = await fetch(enrichURL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(zoomReq)
	});
	let enrichJSON = await enrichResponse.json();

	enrichmentProperties = enrichJSON['data']['result'][0]['data'][0];
	console.log(typeof enrichmentProperties);

	let enrichedTraits = {};
	//union traits if config desires it
	if (settings.bMaintainOriginalTraits == true) {
		enrichedTraits = { ...enrichmentProperties, ...body.traits };
	} else {
		enrichedTraits = enrichmentProperties;
	}

	Segment.identify({
		userId: body.userId || null,
		anonymousId: body.anonymousId || null,
		traits: enrichedTraits
	});
}
