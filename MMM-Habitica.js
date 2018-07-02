'use strict';

Module.register("MMM-Habitica",{
	// Default module config.
	defaults: {
		updateInterval: 5000,
		initialLoadDelay: 0,
		animationSpeed: 1000,
		result: {},
		jsonData: {},
		//stations: [],
	},

	start: function() {

		Log.log('LOG' + this.name + ' is started!');
		// Set locale.
		moment.locale(config.language);
		this.title = "Loading...";
		this.loaded = false;
		var self = this;
		setInterval(function() { self.updateHabitica(); }, this.config.updateInterval);

		// first update on start
		self.updateHabitica();
	},
	getStyles: function() {
	    return ['font-awesome.css', 'MMM-Habitica.css'];
	},

	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");
		var data = this.result;
		if (!this.loaded) {
			wrapper.innerHTML = "Loading...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		var tableWrap = document.createElement("table");
		tableWrap.className = "small";


		for (var c in this.config.stations) {
			var station = this.config.stations[c];

			var sensorWrapper = document.createElement("tr");
			sensorWrapper.className = "normal";

			var titleTD = document.createElement('td');
			titleTD.className = "title bright align-left";
			titleTD.innerHTML = station.name;
			sensorWrapper.appendChild(titleTD);

			var statusTD = document.createElement('td');
			statusTD.className = "time light align-right";
			statusTD.innerHTML = station.available_bikes;
			sensorWrapper.appendChild(statusTD);

			tableWrap.appendChild(sensorWrapper);

		}

		wrapper.appendChild(tableWrap);
		return wrapper;

	},
	updateHabitica: function() {

        console.log("updateHabitica");

        /*var self = this;

        this.config.jsonData = {};

		this.config.habiticaAPIResources.forEach(function(resource) {
			switch (resource) {
				case 'members':
					self.updateMembers();
                    //self.updateHabitica();
					break;
			}
		});*/

        this.sendSocketNotification('RELOAD',this.config);
	},
    updateMembers: function () {

        let self = this;
        //let config = this.config;

		let requests = [];
		let requestsReturnData = [];

        if(typeof self.config.membersID != undefined) {

            self.sendSocketNotification('RELOAD',self.config);

            /*self.config.membersID.forEach(function(memberID) {

                var requestOptions = {
                    hostname: self.config.habiticaURL,
                    port: self.config.habiticaPORT,
                    path: self.config.habiticaAPIPath + "/members/" + memberID,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };

                requests.push(requestOptions);
				self.sendSocketNotification('RELOAD',requestOptions);
			})*/

        }
    },
	socketNotificationReceived: function(notification, payload) {

		console.log("socketNotifReceived");
		console.log(notification, payload);

		/*for (var key in payload.values){
				var attrName = key;
				var attrValue = payload.values[key];

				// "Dr Long  / Aubépins"
				if(payload.values[key].gid == 789) {
					this.config.stations.push(attrValue);
				}
				// Place antoinette
				if(payload.values[key].gid == 1002) {
					this.config.stations.push(attrValue);
				}
				// Gare de villeurbanne
				if(payload.values[key].gid == 794) {
					this.config.stations.push(attrValue);
				}
			}

		if (notification === "RELOAD_DONE") {
			this.loaded = true;
			this.updateDom(this.animationSpeed);
		}*/
	}

});
