// This example uses the Radar track API

/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
 async function onTrack(event, settings) {
	const endpoint = 'https://api.radar.io/v1/track';
	let response;

	try {
		if (hasRequiredIdentifiers(event) && hasRequiredLocationContext(event)) {
			radarTrackPayload = createPayload(event);
			setIfDefined(event,'anonymousId',radarTrackPayload,'metadata.segmentAnonymousId');
			setIfDefined(event, 'userId', radarTrackPayload, 'userId');
			setIfDefined(event, 'context.os.version', radarTrackPayload, 'deviceOS');
			setIfDefined(event,'context.device.manufacturer',radarTrackPayload,'deviceMake');
			setIfDefined(event,'context.device.model',radarTrackPayload,'deviceModel');
			response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Authorization: `${settings.radarPublishableKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(radarTrackPayload)
			});
		} else {
			throw new InvalidEventPayload('Missing required attributes');
		}
	} catch (error) {
		// Retry on connection error
		throw new RetryError(error.message);
	}

	if (response.status >= 500 || response.status === 429) {
		// Retry on 5xx (server errors) and 429s (rate limits)
		throw new RetryError(`Failed with ${response.status}`);
	}
}

const setIfDefined = (
	sourceObject,
	sourcePath,
	destObject,
	destPath,
	defaultValue
) => {
	let value = _.get(sourceObject, sourcePath);
	if (value !== undefined) {
		_.set(destObject, destPath, value);
	} else if (defaultValue !== undefined) {
		_.set(destObject, destPath, defaultValue);
	}
};

/**
 * Handle identify event
 * @param  {SegmentIdentifyEvent} event
 * @param  {FunctionSettings} settings
 */
async function onIdentify(event, settings) {
	throw new EventNotSupported('identify is not supported');
}

/**
 * Handle group event
 * @param  {SegmentGroupEvent} event
 * @param  {FunctionSettings} settings
 */
async function onGroup(event, settings) {
	throw new EventNotSupported('group is not supported');
}

/**
 * Handle page event
 * @param  {SegmentPageEvent} event
 * @param  {FunctionSettings} settings
 */
async function onPage(event, settings) {
	throw new EventNotSupported('page is not supported');
}

/**
 * Handle screen event
 * @param  {SegmentScreenEvent} event
 * @param  {FunctionSettings} settings
 */
async function onScreen(event, settings) {
	throw new EventNotSupported('screen is not supported');
}

/**
 * Handle alias event
 * @param  {SegmentAliasEvent} event
 * @param  {FunctionSettings} settings
 */
async function onAlias(event, settings) {
	throw new EventNotSupported('alias is not supported');
}

/**
 * Handle delete event
 * @param  {SegmentDeleteEvent} event
 * @param  {FunctionSettings} settings
 */
async function onDelete(event, settings) {
	throw new EventNotSupported('delete is not supported');
}

function hasRequiredLocationContext(event) {
	if (event.context?.location?.latitude && event.context?.location?.longitude) {
		return true;
	} else {
		return false;
	}
}

function hasRequiredIdentifiers(event) {
	if (event.context?.device?.id || event.anonymousId) {
		return true;
	} else {
		return false;
	}
}

function deviceTypeTransform(deviceType) {
	if (deviceType) {
		switch (deviceType.toLowerCase()) {
			case 'ios':
				return 'iOS';
			case 'android':
				return 'Android';
			default:
				return 'Web';
		}
	} else {
		return 'Web';
	}
}

const createPayload = e => {
	var date = new Date();
	return {
		deviceId: e.context.device?.id ?? e.anonymousId,
		latitude: e.context.location.latitude,
		longitude: e.context.location.longitude,
		accuracy: e.context.location.accuracy ?? 65,
		deviceType: deviceTypeTransform(e.context.device?.type),
		foreground: true,
		stopped: true,
		metadata: {},
		updatedAt: e.sentAt ?? date.toISOString()
	};
};
