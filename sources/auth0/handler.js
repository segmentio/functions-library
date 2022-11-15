/**
 * Handle incoming HTTP request
 *
 * @param  {FunctionRequest} request
 * @param  {FunctionSettings} settings
 */
async function onRequest(request, settings) {
	const body = request.json();

  //make event name easier to understand based on Auth0's log codes
  //https://auth0.com/docs/deploy-monitor/logs/log-event-type-codes
  const logCodes = {
      "admin_update_launch":	"Auth0 Update Launched",
      "api_limit":	"Rate Limit on the Authentication or Management APIs",
      "cls":	"Code/Link Sent",
      "cs":	"Code Sent",
      "depnote":	"Deprecation Notice",
      "du":	"Deleted User",
      "f":	"Failed Login",
      "fapi":	"Operation on API failed",
      "fc":	"Failed by Connector",
      "fce":	"Failed Change Email",
      "fco":	"Failed by CORS",
      "fcoa":	"Failed cross-origin authentication",
      "fcp":	"Failed Change Password",
      "fcph":	"Failed Post Change Password Hook",
      "fcpn":	"Failed Change Phone Number",
      "fcpr":	"Failed Change Password Request",
      "fcpro":	"Failed Connector Provisioning",
      "fcu":	"Failed Change Username",
      "fd":	"Failed Delegation",
      "fdeac":	"Failed Device Activation",
      "fdeaz":	"Failed Device Authorization Request",
      "fdecc":	"User Canceled Device Confirmation",
      "fdu":	"Failed User Deletion",
      "feacft":	"Failed Exchange",
      "feccft":	"Failed Exchange",
      "fede":	"Failed Exchange",
      "fens":	"Failed Exchange",
      "feoobft":	"Failed Exchange",
      "feotpft":	"Failed Exchange",
      "fepft":	"Failed Exchange",
      "fepotpft":	"Failed Exchange",
      "fercft":	"Failed Exchange",
      "fertft":	"Failed Exchange",
      "ferrt":	"Failed Exchange",
      "fi":	"Failed invite accept",
      "flo":	"Failed Logout",
      "fn":	"Failed Sending Notification",
      "fp":	"Failed Login (Incorrect Password)",
      "fs":	"Failed Signup",
      "fsa":	"Failed Silent Auth",
      "fu":	"Failed Login (Invalid Email/Username)",
      "fui":	"Failed users import",
      "fv":	"Failed Verification Email",
      "fvr":	"Failed Verification Email Request",
      "gd_auth_failed":	"MFA Auth failed",
      "gd_auth_rejected":	"MFA Auth rejected",
      "gd_auth_succeed":	"MFA Auth success",
      "gd_enrollment_complete":	"MFA enrollment complete",
      "gd_otp_rate_limit_exceed":	"Too many failures",
      "gd_recovery_failed":	"Recovery failed",
      "gd_recovery_rate_limit_exceed":	"Too many failures",
      "gd_recovery_succeed":	"Recovery success",
      "gd_send_email":	"Email Sent",
      "gd_send_pn":	"Push notification sent",
      "gd_send_pn_failure":	"Push notification sent",
      "gd_send_sms":	"SMS sent",
      "gd_send_sms_failure":	"SMS sent failures",
      "gd_send_voice":	"Voice call made",
      "gd_send_voice_failure":	"Voice call failure",
      "gd_start_auth":	"Second factor started",
      "gd_start_enroll":	"Enroll started",
      "gd_start_enroll_failed":	"Enrollment failed",
      "gd_tenant_update":	"Guardian tenant update",
      "gd_unenroll":	"Unenroll device account",
      "gd_update_device_account":	"Update device account",
      "gd_webauthn_challenge_failed":	"Enrollment challenge issued",
      "gd_webauthn_enrollment_failed":	"Enroll failed",
      "limit_delegation":	"Too Many Calls to /delegation",
      "limit_mu":	"Blocked IP Address",
      "limit_wc":	"Blocked Account",
      "limit_sul":	"Blocked Account",
      "mfar":	"MFA Required",
      "mgmt_api_read":	"Management API read Operation",
      "pla":	"Pre-login assessment",
      "pwd_leak":	"Breached password",
      "resource_cleanup":	"Refresh token excess warning",
      "s":	"Success Login",
      "sapi":	"Success API Operation",
      "sce":	"Success Change Email",
      "scoa":	"Success cross-origin authentication",
      "scp":	"Success Change Password",
      "scph":	"Success Post Change Password Hook",
      "scpn":	"Success Change Phone Number",
      "scpr":	"Success Change Password Request",
      "scu":	"Success Change Username",
      "sd":	"Success Delegation",
      "sdu":	"Success User Deletion",
      "seacft":	"Success Exchange",
      "seccft":	"Success Exchange",
      "sede":	"Success Exchange",
      "sens":	"Success Exchange",
      "seoobft":	"Success Exchange",
      "seotpft":	"Success Exchange",
      "sepft":	"Success Exchange",
      "sercft":	"Success Exchange",
      "sertft":	"Success Exchange",
      "si":	"Successful invite accept",
      "signup_pwd_leak":	"Breached password",
      "srrt":	"Success Revocation",
      "slo":	"Success Logout",
      "ss":	"Success Signup",
      "ssa":	"Success Silent Auth",
      "sui":	"Success users import",
      "sv":	"Success Verification Email",
      "svr":	"Success Verification Email Request",
      "sys_os_update_end":	"Auth0 OS Update Ended",
      "sys_os_update_start":	"Auth0 OS Update Started",
      "sys_update_end":	"Auth0 Update Ended",
      "sys_update_start":	"Auth0 Update Started",
      "ublkdu":	"User login block released",
      "w":	"Warnings During Login"
    }

	let eventToSend = {
		event: logCodes[body.data.type],
    //assigns an identifier from Auth0's payload
		anonymousId: body.data.client_id,
		properties: {
			...body.data
		}
	};

	//if payload is < Segment's limit of 32KB -> send it as is (https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#max-request-size)
	if (getRoughSizeOfObject(eventToSend) < 32) {
		Segment.track(eventToSend);
	} else {
		//otherwise remove a portion and then send the pared down version
		delete eventToSend.properties.details.request.auth.credentials.scopes;
		Segment.track(eventToSend);
	}


	//checks size of outgoing payload
	function getRoughSizeOfObject(object) {
		let objectList = [];
		let stack = [object];
		let bytes = 0;

		while (stack.length) {
			let value = stack.pop();
			if (typeof value === 'boolean') {
				bytes += 4;
			} else if (typeof value === 'string') {
				bytes += value.length * 2;
			} else if (typeof value === 'number') {
				bytes += 8;
			} else if (
				typeof value === 'object' &&
				objectList.indexOf(value) === -1
			) {
				objectList.push(value);
				for (let i in value) {
					stack.push(value[i]);
				}
			}
		}
		//returns kilobytes - Segment's limit is 32KB
		return bytes / 1000;
	}
}
