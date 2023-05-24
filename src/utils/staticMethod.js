/*jslint browser: true, devel: true*/
// /*global window, exports, module, define*/

var staticMethod = {
  clearWebAuth: function (callback) {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('expires_in');
    sessionStorage.removeItem('access_token_received_at');
    if (typeof callback === 'function') {
      callback();
    }
  },
  parseIDToken: function (idToken) {
    var payload = idToken.split('.')[1];
    function base64urlDecode(str) {
      return window.atob(str.replace(/_/g, '/').replace(/-/g, '+'));
    }
    //base64url decode
    payload = base64urlDecode(payload);

    return JSON.parse(decodeURIComponent(window.escape(payload)));
  },
  createQueryString: function (params) {
    var str = '?',
      param;
    for (param in params) {
      if (params.hasOwnProperty(param) && params[param]) {
        str = str + param + '=' + encodeURIComponent(params[param]) + '&';
      }
    }
    return str.slice(0, -1);
  },

  parseQueryString: function (url, callback) {
    var i,
      len,
      result,
      pair,
      queryObj = {};
    result = (url || location.search).match(/[\?\&\#][^\?\&\#]+=[^\?\&\#]+/g);
    if (result !== null) {
      for (i = 0, len = result.length; i < len; i += 1) {
        pair = result[i].slice(1).split('=');
        queryObj[pair[0]] = decodeURIComponent(pair[1]);
      }
    }
    if (typeof callback === 'function') {
      callback(queryObj);
    }
    return queryObj;
  },

  handleRedirectError: function (callback) {
    var href = window.location.href,
      error;
    this.parseQueryString(href, function (params) {
      error = params.error;
      if (error && typeof callback === 'function') {
        if (
          [
            'invalid_request',
            'invalid_client',
            'invalid_grant',
            'unauthorized_client',
            'unsupported_grant_type',
            'invalid_scope',
          ].indexOf(error) !== -1
        ) {
          callback(error, params.error_description);
        }
      }
    });
  },
  getAccessToken: function () {
    if (sessionStorage.getItem('access_token')) {
      return sessionStorage.getItem('access_token');
    }
    throw new Error('Error! There is no access token');
  },
  getIdToken: function () {
    if (sessionStorage.getItem('id_token')) {
      return sessionStorage.getItem('id_token');
    }
    throw new Error('Error! There is no id token');
  },
};

export default staticMethod;
