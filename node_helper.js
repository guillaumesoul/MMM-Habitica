var NodeHelper = require("node_helper");
const https = require('https');

module.exports = NodeHelper.create({
	start: function() {
	},

	reload: function(refConfig) {

		var self=this;
		self.httpsRequestData = '';

		var options = {
		  hostname: refConfig.habiticaURL,
		  port: refConfig.habiticaPORT,
		  path: refConfig.habiticaAPIPath,
		  method: 'GET',
		  headers: {
		    'Content-Type': 'application/json',
		 }
		};

		var req = https.request(options, (res) => {
            res.setEncoding('utf8');
			res.on('data', (chunk) => {
					self.httpsRequestData += chunk;
					try{
						var JSONParsed = JSON.parse(self.httpsRequestData);
						self.sendSocketNotification("RELOAD_DONE",JSONParsed);

					}catch(error) {
					}
			});

			res.on('end', () => {
			});

			req.on('error', (e) => {
				console.log(`problem with request: ${e.message}`);
			});

		});

		req.end();

	},

	socketNotificationReceived: function(notification, payload) {
	    if (notification === 'RELOAD') {
	      this.reload(payload);
	    }
	}
});






