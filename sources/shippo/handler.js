/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
// exports.processEvents = async (event) => {
  const body = request.json()
  const { data } = body;
  const { tracking_status } = data;
  const properties = getProperties(body);
  Segment.set({
    collection: 'shipment',
    id: tracking_status.object_id,
    properties
  })
}

/**
 * @param {String} type e.g. `from` or `to`.
 * @param {Object} address Object with different properties of address. Keys here are `zip`, `country`, etc.
 * @returns {Object} Where each key in `address` is prefixed by `type`.
 */
function getTypedAddress(type, address) {
  const ret = {};
  Object.keys(address).forEach((key) => {
    ret[`${type}_${key}`] = address[key];
  })
  return ret;
}

/**
 * @param {Object} body from Shippo.
 * @returns {Object} properties for Segment to put in the `properties` field.
 */
function getProperties(body) {
  const { carrier, data } = body;
  const { tracking_status, address_from, address_to, tracking_number, eta, original_eta } = data;
  return {
    carrier,
    eta,
    original_eta,
    tracking_number,
    status: tracking_status.status,
    ...getTypedAddress('from', address_from),
    ...getTypedAddress('to', address_to)
  }
}



