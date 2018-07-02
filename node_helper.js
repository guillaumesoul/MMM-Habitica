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

    reload: function(refConfig) {

    	let self = this;

    	let jsonData = {};

        refConfig.habiticaAPIResources.forEach(function(resource) {
            switch (resource) {
                case 'members':
                    jsonData.members = self.getMembersData(refConfig);
                    break;
            }
        })

    },

	socketNotificationReceived: function(notification, payload) {
	    if (notification === 'RELOAD') {
	      this.reload(payload);
	    }
	},

    getMembersData: function(refConfig) {

    	let self = this;
        let membersData = {};

        refConfig.membersID.forEach(function(memberID, index) {

            var reloadType = 'RELOAD_TEMP';

            if(index+1 == refConfig.membersID.length) {
                reloadType = 'RELOAD_DONE';
            }

            var requestOptions = {
                hostname: refConfig.habiticaURL,
                port: refConfig.habiticaPORT,
                path: refConfig.habiticaAPIPath + "/members/" + memberID,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

        	var memberData = self.requestHabiticaApi(requestOptions);
            /*console.log('test');
            console.log(memberData);*/


        })
	},

	requestHabiticaApi: function(requestOptions, reloadType) {

        let self = this;
        let JSONParsed = {};

        var req = https.request(requestOptions, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                try{
                    JSONParsed = JSON.parse(chunk);
                    self.sendSocketNotification("RELOAD_DONE", JSONParsed);
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
	}


});






