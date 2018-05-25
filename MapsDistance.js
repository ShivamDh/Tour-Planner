import qs from 'querystring';

import GOOGLE_CREDENTIALS from './GoogleCredentials';

var API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

var MapsDistance = function() {
	this.get = (args, callback) => {
		var options = formatOptions(args);

		fetchData(options, (err, data) => {
			if (err) {
				return callback(err);
			}

			formatResults(data, options, (err, results) => {
				if (err) return callback(err);
				return callback(null, results);
			});

		});
	}
};

var formatOptions = (args) => {
	var options = {
		origins: args.origins.join('|'),
		destinations: args.destinations.join('|'),
		mode: 'driving',
		units: 'metric',
		language: 'en',
		key: GOOGLE_CREDENTIALS.key,
		batchMode: true
	};

	if (!options.origins || !options.destinations) {
		throw new Error('Argument Error: Locations are invalid');
	}

	return options;
};

var fetchData = (options, callback) => {
  	fetch(API_URL + qs.stringify(options))
		.then((response) => {
			if(response.status != 200) {
				let error = new Error(response.statusText);
				error.response = response;
				throw error;
			}
			return response;
		})
		.then((response) => response.json())
		.then((response) => {
			callback(null, response);
		})
		.catch ((error) => {
			requestHasError(error, callback);
		});
};

module.exports = new MapsDistance();
