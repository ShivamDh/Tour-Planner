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

var formatResults = (data, options, callback) => {
	var formatData = function (element) {
		return {
			distance: element.distance.text,
			distanceValue: element.distance.value,
			duration: element.duration.text,
			durationValue: element.duration.value,
			origin: element.origin,
			destination: element.destination,
			units: options.units,
			language: options.language,
		};
	};

	var requestStatus = data.status;
	if (requestStatus != 'OK') {
		return callback(new Error('Status error: ' + requestStatus + ': ' + data.error_message));
	}

	var results = [];

	for (var i = 0; i < data.origin_addresses.length; i++) {
		for (var j = 0; j < data.destination_addresses.length; j++) {
			var element = data.rows[i].elements[j];
			var resultStatus = element.status;

			if (resultStatus != 'OK') {
				return callback(new Error('Result error: ' + resultStatus));
			}

			element.origin = data.origin_addresses[i];
			element.destination = data.destination_addresses[j];

			results.push(formatData(element));
		}
	}

	return callback(null, results);
};

var requestHasError = (err, callback) => {
	callback(new Error('Request error: Could not fetch data from Google\'s servers: ' + err));
}

module.exports = new MapsDistance();
