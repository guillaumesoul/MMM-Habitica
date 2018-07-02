'use strict';

Module.register("MMM-Habitica",{
	// Default module config.
	defaults: {
		updateInterval: 5000,
		initialLoadDelay: 0,
		animationSpeed: 1000,
		result: {},
		membersData: [],
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

        var titleLineWrapper = document.createElement("tr");
        titleLineWrapper.className = "normal";

        var titleTD = document.createElement('td');
        titleTD.className = "title bright align-left";
        titleTD.innerHTML = "Joueur";
        titleLineWrapper.appendChild(titleTD);

        var levelTD = document.createElement('td');
        levelTD.className = "time light align-right";
        levelTD.innerHTML = "Niveau";
        titleLineWrapper.appendChild(levelTD);

        var XPTD = document.createElement('td');
        XPTD.className = "time light align-right";
        XPTD.innerHTML = "XP";
        titleLineWrapper.appendChild(XPTD);

        var HPTD = document.createElement('td');
        HPTD.className = "time light align-right";
        HPTD.innerHTML = "PV";
        titleLineWrapper.appendChild(HPTD);

        tableWrap.appendChild(titleLineWrapper);

		for (var member in this.config.membersData) {
			var member = this.config.membersData[member];

            var memberWrapper = document.createElement("tr");
			memberWrapper.className = "normal";

			var titleTD = document.createElement('td');
			titleTD.className = "title bright align-left";
			titleTD.innerHTML = member.data.profile.name;
			memberWrapper.appendChild(titleTD);

			var levelTD = document.createElement('td');
            levelTD.className = "time light align-right";
            levelTD.innerHTML = member.data.stats.lvl;
			memberWrapper.appendChild(levelTD);

			var XPTD = document.createElement('td');
            XPTD.className = "time light align-right";
            XPTD.innerHTML = member.data.stats.exp;
			memberWrapper.appendChild(XPTD);

			var HPTD = document.createElement('td');
            HPTD.className = "time light align-right";
            HPTD.innerHTML = member.data.stats.hp;
			memberWrapper.appendChild(HPTD);

			tableWrap.appendChild(memberWrapper);

		}

		wrapper.appendChild(tableWrap);
		return wrapper;

	},
	updateHabitica: function() {
        this.sendSocketNotification('RELOAD',this.config);
	},
	socketNotificationReceived: function(notification, payload) {

        if (notification === "RELOAD_DONE") {
            this.config.membersData.push(payload);

            if(this.config.membersData.length == this.config.membersID.length) {
                this.loaded = true;
                this.updateDom(this.animationSpeed);
            }
        }
	}

});
