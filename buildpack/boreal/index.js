/**
 * This is NOT a sandbox. The purpose of this shim is only to obscure the use
 * of Node.js as the runtime. The goal here is to simply make the executed code
 * run as though it is 1) targeting web standards and 2) it is not dependent on
 * running in AWS lambda.
 */

const Module = require('module');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const window = require('./window');
const { Segment, EventNotSupported, ServerRequest, URLSearchParams } = window;
const sourceCache = {};
const destinationCache = {};

// These are the names of the accepted event types mapped to the destination
// function names for handling the evente. This drives the definition of the
// default handling functions as well as restricts the event types that
// `processDestinationPayload` will accept.
const eventNames = {
  identify: 'onIdentify',
  track: 'onTrack',
  page: 'onPage',
  screen: 'onScreen',
  group: 'onGroup',
  alias: 'onAlias',
  delete: 'onDelete',
};

// This is the default handler for the source request function. The loaded
// module is expected to override this definition.
//
// @param {ServerRequest} request - Captured request information.
// @param {Object} settings - Settings object.
function defaultSourceHandler(request, settings) {
  throw new EventNotSupported(`request not supported`);
}

// This is the default handler for all destination event types. The loaded
// module is expected to override one or more of these handlers. For any not
// defined in the custom module, an `EventNotSupported` error is thrown which
// is handled and not treated as a runtime error.
//
// @param {Object} event - Incoming event object.
// @param {Object} settings - Settings object.
function defaultDestinationHandler(event, settings) {
  throw new EventNotSupported(`${event.type} not supported`);
}

// Create an absolute URL given the query parameters as either a string or an
// object.
//
// @param {string|Object} queryParameters - Parameter string or key/value map.
// @return {string} The absolute URL.
function createURL(queryParameters) {
  let url = "https://fn.segmentapis.com/";
  if (typeof queryParameters === "string") {
    if (queryParameters[0] !== '?') {
      url += '?';
    }
    url += queryParameters;
  } else if (typeof queryParameters === 'object' && queryParameters) {
    const params = new URLSearchParams();
    for (let [key, val] of Object.entries(queryParameters)) {
      if (Array.isArray(val)) {
        for (let item of val) {
          params.append(key, item);
        }
      } else {
        params.append(key, val);
      }
    }
    url += "?" + params.toString();
  }
  return url;
}

// The entry point for source functions.
//
// @param {Object} payload - Settings and captured values of the web request.
// @param {Object} payload.payload - Captured request information.
// @param {string|Object} payload.payload.body - Request body as a string or decoded JSON object.
// @param {Object} payload.payload.headers - Request headers.
// @param {string} [payload.payload.url] - Absolute request URL; takes precedence over `queryParameters`.
// @param {string|Object} [payload.payload.queryParameters] - Request query string or parsed key/value pairs.
// @param {Object} payload.settings - Settings object.
// @return {Object} Resulting events and/or objects.
exports.processSourcePayload = async payload => {
  const exports = { onRequest: defaultSourceHandler };

  const handler = loadModule("./handler", { exports, cache: sourceCache });
  const fn = handler.onRequest;
  if (typeof fn === 'function') {
    let { body, headers, url, queryParameters } = payload.payload;
    if (!url) {
      url = createURL(queryParameters);
    }

    const request = new ServerRequest(body, { headers, url });
    let settings = payload.settings || {};
    await fn(request, settings);

    // collect and reset implicit messages
    const { events, objects } = Segment
    Segment.events = []
    Segment.objects = []

    return { events, objects };
  }
}

// The entry point for destination functions.
//
// @param {Object} payload - Settings and captured values of the web request.
// @param {Object} payload.event - Parsed event object.
// @param {Object} payload.settings - Settings object.
// @return {any} Results of the event handler function.
exports.processDestinationPayload = async payload => {
  const { event, settings } = payload;
  const handlerName = eventNames[event.type];
  if (!handlerName) {
    return;
  }

  // Create intial module-scoped globals using the event handler names:
  //    exports.onIdentify = defaultDestinationHandler
  //    exports.onTrack = defaultDestinationHandler
  //    ...
  const exports = Object.values(eventNames).reduce((obj, n) => {
    obj[n] = defaultDestinationHandler;
    return obj;
  }, {});

  const handler = loadModule("./handler", { exports, cache: destinationCache });
  const fn = handler[handlerName];
  if (typeof fn === 'function') {
    return await fn(event, settings);
  }
};

// This is a very distilled version of the Node.js/CommonJS module loading
// system. It takes a requested path (i.e. the value that might be passed
// to `require`), and attempts to load the definitions specified in the
// `options.exports` object. This source file is *not*, however, expected to
// have a `module.exports` statement. That is, the symbols specified by the
// keys in `options.exports` are automatically exported into the resulting
// module. The values defined in `options.exports` provide the default values
// of those symbols if the loaded code does not define the symbol names.
//
// The caller may also specify "global" values via the `options.globals`
// object. All values in this object become globals scoped only to the loaded
// module. The loaded code does *not* have implicit access to the `require`
// function. If this is needed, it must be passed in through the
// `options.globals` object. This may be used to keep the code from using any
// Node.js internals.
//
// The code is loaded through a `vm` context provided by Node.js/V8. This
// is how Node.js works internally, so this is not an additional complexity.
//
// @param {string} request - The name or file to require.
// @param {Object} [options] - Environment configuration for the loaded module.
// @param {Object} [options.exports] - Symbol names and default values to export from the module.
// @param {Object} [options.globals] - Module-scoped global values.
// @param {Object} [options.cache] - Module load cache.
// @return {Object} The exported values.
function loadModule(request, options) {
  const filename = Module._resolveFilename(request, null, false);

  // Try and get an already loaded module from the optional cache.
  let mod = options && options.cache && options.cache[filename];
  if (mod) {
    return mod.exports;
  }

  // Copy the window rather than use a prototype chain so the module cannot
  // access the original window object.
  const contextWindow = Object.assign({}, window);
  contextWindow.window = contextWindow;

  // Create the module-scoped globals with all window members and all
  // optionally provided global definitions.
  const globals = Object.assign({}, contextWindow);
  if (options && options.globals) {
    Object.assign(globals, options.globals);
  }

  vm.createContext(globals);

  const content = readModule(filename);
  const wrapper = wrapModule(content, options);
  const context = vm.runInContext(wrapper, globals, {
    filename: path.basename(filename),
    lineOffset: -2,
    displayErrors: true,
  });

  mod = new Module();
  mod.filename = filename;
  mod.paths = [path.dirname(filename)];

  // Collect all the default exported values into an array. This gets spread
  // into the module loading function.
  const defaults = options && options.exports
    ? Object.values(options.exports)
    : [];

  context.call(
    /* this     = */ contextWindow,
    /* exports  = */ mod.exports,
    /* defaults = */ ...defaults
  );
  mod.loaded = true;

  if (options && options.cache) {
    options.cache[filename] = mod;
  }

  return mod.exports;
}

// This reads the code string from the absolute file path. A byte order
// mark is removed if present.
//
// @param {string} filename - Full path name to a source file.
// @return {string} Source code for the file.
function readModule(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (code.charCodeAt(0) === 0xFEFF) {
    code = code.slice(1);
  }

  return code;
}

// This works similar Module.wrap in CommonJS, but it removes all the Node.js
// magic parameters, obscures the `exports` parameter, and adds in default
// values for all exported symbols. These exported symbols are passed in as
// parameters so that they may be redefined using the `function` syntax. The
// exports statements are repeated to handle the unlikely case of an early
// return in the user code. Due to JavaScript declaration hoisting, the first
// set of export statements would capture the necessary function definitions.
// However, a conditionally set function would be missed so we add it to the
// end too.
//
// The result of `wrapModule` is roughly:
//     (function (__exports123, onIdentify, onTrack) {
//         __exports123.onIdentify = onIdentify;
//         __exports123.onTrack = onTrack;
//
//         ${user code};
//
//         __exports123.onIdentify = onIdentify;
//         __exports123.onTrack = onTrack;
//     });
//
// @param {string} code - The loaded source code.
// @param {Object} [options] - Environment configuration for the loaded module.
// @param {Object} [options.exports] - Symbol names and default values to export from the module.
// @return {string} Source code to evaluate.
function wrapModule(code, options) {
  // exportArg is the randomly generated export object symbol.
  const exportArg = "__exports" + Math.round(Math.random() * 1000000);

  // exportArgs is the string containing the comma-separated arguments to the
  // module loader function:
  //   ", onIdentify, onTrack, ..."
  let exportArgs = '';

  // exportAssign is the string containing the code to assign the export values:
  //   "__exports123.onIdentify = onIdentify; __exports123.onTrack = onTrack; ..."
  let exportAssign = '';

  if (options && options.exports) {
    for (let name of Object.keys(options.exports)) {
      exportArgs += `, ${name}`;
      exportAssign += `${exportArg}.${name} = ${name};`;
    }
  }

  return (
`(function (${exportArg}${exportArgs}) {
  ${exportAssign}
  ${code};
  ${exportAssign}
});`
);
}