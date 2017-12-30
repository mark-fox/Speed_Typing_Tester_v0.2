var request = require('request');

// Source of API.
var baseURL = "http://ron-swanson-quotes.herokuapp.com/v2/quotes/";

function quoteRequest(callback) {
    var queryParam = {};

    // Uses 'request' to query the API for a single result.
    request({url: baseURL + 1, qs: queryParam}, function (error, quote_response, body) {
        if (!error && quote_response.statusCode == 200) {
            // Converts the returned object into a JSON object.
            var quoteJSON = JSON.parse(body);
            callback(quoteJSON);
        }
    });
}

// Exports function.
module.exports = quoteRequest;