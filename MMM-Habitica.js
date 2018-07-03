'use strict';

Module.register("MMM-Habitica",{
	// Default module config.
	defaults: {
		updateInterval: 5000,
		initialLoadDelay: 0,
		animationSpeed: 1000,
		result: {},
		membersData: []
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

		var HabiticaDataWrapper = this.getHabiticaDomWrapper();
		wrapper.appendChild(HabiticaDataWrapper);
		return wrapper;

	},

    getHabiticaDomWrapper: function() {
        var tableWrap = document.createElement("table");
        tableWrap.className = "small";

        var titleLineWrapper = document.createElement("tr");
        titleLineWrapper.className = "normal";

        var titleTD = document.createElement('td');
        titleTD.className = "title light align-left";
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

            if(typeof member.data != "undefined") {
                var memberWrapper = document.createElement("tr");
                memberWrapper.className = "normal";

                var titleTD = document.createElement('td');
                var logo = new Image()
                switch(member.data.profile.name) {
                    case 'guillaume':
                        logo.src = 'modules/MMM-Habitica/public/Habitica_avatar_guillaume_transparent.png'
                        break;
                    case 'mumu':
                        logo.src = 'modules/MMM-Habitica/public/Habitica_avatar_muriel_transparent.png'
                        break;
                    default:
                        logo.src = 'modules/MMM-Habitica/public/Habitica_avatar_muriel_transparent.png'
                        break;

                }
                logo.setAttribute('width', '50px')
                titleTD.appendChild(logo)
                memberWrapper.appendChild(titleTD);

                var levelTD = document.createElement('td');
                levelTD.className = "time bright align-right";
                levelTD.innerHTML = member.data.stats.lvl;
                memberWrapper.appendChild(levelTD);

                var XPTD = document.createElement('td');
                XPTD.className = "time bright align-right";
                XPTD.innerHTML = parseFloat(member.data.stats.exp).toFixed(0);
                memberWrapper.appendChild(XPTD);

                var HPTD = document.createElement('td');
                HPTD.className = "time bright align-right";
                HPTD.innerHTML = parseFloat(member.data.stats.hp).toFixed(1);
                memberWrapper.appendChild(HPTD);

                tableWrap.appendChild(memberWrapper);
            }

        }
        return tableWrap;
	},

	updateHabitica: function() {
        this.sendSocketNotification('RELOAD',this.config);
	},

	socketNotificationReceived: function(notification, payload) {

        console.log(notification);

        var indexNotification = notification.replace(/[^\d]/g, '');
		this.config.membersData[indexNotification] = payload;

        if (this.config.membersData.length == this.config.membersID.length) {
            this.loaded = true;
            this.updateDom(this.animationSpeed);
        }
	}

});
