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

exports.processEvents = async (event) => {
  const { body } = event.payload;
  const { data } = body;
  const { tracking_status } = data;
  const properties = getProperties(body);
  return {
    objects: [
      {
        collection: 'shipment',
        id: tracking_status.object_id,
        properties
      }
    ]
  };
}

