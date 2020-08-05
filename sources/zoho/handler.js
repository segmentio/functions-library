// Learn more about source functions API at
// https://segment.com/docs/connections/sources/source-functions

/**
 * Handle incoming HTTP request
 *
 * @param  {FunctionRequest} request
 * @param  {FunctionSettings} settings
 */
async function onRequest(request, settings) {
	var eventBody = request.json();
	// expected input is a one element array
	var data = eventBody[0].payload;
	// set variables for ticket you want to pass through to track call

	var ticket_id = data.ticketNumber;
	var ticket_status = data.statusType;
	var ticket_subject = data.subject;
	var ticket_classification = data.classification;
	var ticket_priority = data.priority;
	//removinging opening and closing div tag from description of ticket
	var ticket_description = data.description.slice(5, -6);

	//variables for user info for identify call
	var contactInfo = data.contact;
	var user_id = contactInfo.id;
	var contact_name = contactInfo.lastName;
	var contact_phone = contactInfo.phone;

	//variables for company info for group call
	var account = contactInfo.account;
	var account_name = account.accountName;
	var account_id = account.id;

	// See https://segment.com/docs/connections/spec/track/
	Segment.track({
		event: 'Ticket Created',
		userId: user_id,
		properties: {
			status: ticket_status,
			ticketId: ticket_id,
			subject: ticket_subject,
			classification: ticket_classification,
			priority: ticket_priority,
			description: ticket_description
		}
	});

	Segment.identify({
		userId: user_id,
		traits: {
			name: contact_name,
			phone: contact_phone
		}
	});

	Segment.group({
		userId: user_id,
		groupId: account_id,
		traits: {
			company: account_name
		}
	});
}
