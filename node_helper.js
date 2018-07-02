var NodeHelper = require("node_helper");
const https = require('https');

module.exports = NodeHelper.create({
	start: function() {
	},

	/*reload: function(refConfig) {

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

	},*/

    reload: function(requests) {

        var self=this;
        self.httpsRequestData = '';

        /*var options = {
            hostname: refConfig.habiticaURL,
            port: refConfig.habiticaPORT,
            path: refConfig.habiticaAPIPath,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };*/

        let requestsJSONReturnValues = [];

        requests.forEach(function(requestOptions) {

            //console.log(requestOptions);

            var req = https.request(requestOptions, (res) => {

                console.log('coucou');

                res.setEncoding('utf8');
                res.on('data', (chunk) => {



                    self.httpsRequestData += chunk;
                    try{
                        var JSONParsed = JSON.parse(self.httpsRequestData);
                        //console.log(JSONParsed);
                        requestsJSONReturnValues.push(JSONParsed);
                    }catch(error) {
                    }
                });


                req.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                });

            });


            //console.log(requestsJSONReturnValues);

            //req.end();

		});



        self.sendSocketNotification("RELOAD_DONE",requestsJSONReturnValues);


        /*var req = https.request(requestOptions, (res) => {
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

        });*/



    },

	socketNotificationReceived: function(notification, payload) {
	    if (notification === 'RELOAD') {
	      this.reload(payload);
	    }
	}
});






