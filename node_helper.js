var NodeHelper = require("node_helper");
const https = require('https');

module.exports = NodeHelper.create({
	start: function() {
	},

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

            if(index == 0) {
                reloadType = 'RELOAD_FIRST';
            }

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

            console.log(reloadType);

            self.requestHabiticaApi(requestOptions, reloadType);

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
                }catch(error) {
                }
            });

            res.on('end', () => {
                self.sendSocketNotification(reloadType, JSONParsed);
            });

            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
            });

        });

        req.end();
	}


});






