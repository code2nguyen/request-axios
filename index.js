const { callbackify } = require("util");
const axios = require("axios");
const { stringify } = require("qs");

function request(requestOptions, requestCallback) {
  requestOptions.url = requestOptions.url || requestOptions.uri;
  requestOptions.data =
    requestOptions.data || typeof requestOptions.json === "object"
      ? requestOptions.json
      : requestOptions.formData || {};
  if (
    requestOptions.headers &&
    requestOptions.headers["Content-Type"] ===
      "application/x-www-form-urlencoded"
  ) {
    const form = requestOptions.form || requestOptions.formData;
    if (form) {
      requestOptions.data = stringify(form);
    }
  }

  const callbackFunction = callbackify(() => axios(requestOptions));
  callbackFunction((error, response) => {
    if (error) {
      if (error.response) {
        response = { ...error.response };

        // Flat response data to error object.
        error = error.response;
        error.statusCode = error.status;
        error.error = error.data;
      }
    }
    if (response) {
      response.statusCode = response.status;
      response.statusMessage = response.statusText;
      response.body = response.data;
    }
    requestCallback(error, response, response ? response.data : null);
  });
}

// organize params for patch, post, put, head, del
function initParams(uri, options, callback) {
  if (typeof options === "function") {
    callback = options;
  }

  let params = {};
  if (options !== null && typeof options === "object") {
    params = { ...params, ...options, uri };
  } else if (typeof uri === "string") {
    params = { ...params, uri };
  } else {
    params = { ...params, ...uri };
    params.callback = callback || params.callback;
    return params;
  }
}

function verbFunc(verb) {
  const method = verb.toUpperCase();
  return function (uri, options, callback) {
    const params = initParams(uri, options, callback);
    params.method = method;
    return request(params, params.callback);
  };
}

["get", "delete", "head", "post", "put", "patch", "options"].forEach(
  (method) => {
    request[method] = verbFunc(method);
  }
);

module.exports = request;
