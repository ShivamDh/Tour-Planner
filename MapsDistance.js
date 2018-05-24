import qs from 'querystring';

import GOOGLE_CREDENTIALS from './GoogleCredentials';

var API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

var MapsDistance = function() {
	this.get = function(args, callback) {
		var options = formatOptions(args);

		
	}
};

module.exports = new MapsDistance();
