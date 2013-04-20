var app = {
    // Application Constructor
    initialize: function() {
    	document.getElementById('registerButton').addEventListener('click',this.register, false);
    	document.getElementById('unregisterButton').addEventListener('click',this.unregister, false);
        this.bindEvents();
    },
    register: function(e){
    	var pushNotification = window.plugins.pushNotification;
    	pushNotification.register(this.tokenHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
    },
    unregister: function(e){
    	var pushNotification = window.plugins.pushNotification;
    	pushNotification.unregister(this.tokenHandler,this.errorHandler);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {	
    	app.receivedEvent('deviceready');
    },
    tokenHandler:function(msg) {
    	var generalElement = document.getElementById('general');
		generalElement.value = msg;
        console.log("Token Handler " + msg);
    },
    errorHandler:function(error) {
        console.log("Error Handler  " + error);
        alert(error);
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
    	var generalElement = document.getElementById('general');
		generalElement.value = result;
    	alert('Success! Result = '+result);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var pushNotification = window.plugins.pushNotification;
        // TODO: Enter your own GCM Sender ID in the register call for Android
        if (device.platform == 'android' || device.platform == 'Android') {
            pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"574493253386","ecb":"app.onNotificationGCM"});
        }
        else {
            pushNotification.register(this.tokenHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
        }
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // iOS
    onNotificationAPN: function(event) {
        var pushNotification = window.plugins.pushNotification;
        console.log("Received a notification! " + event.alert);
        console.log("event sound " + event.sound);
        console.log("event badge " + event.badge);
        console.log("event " + event);
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }
        if (event.badge) {
            console.log("Set badge on  " + pushNotification);
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    },
    // Android
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
					var generalElement = document.getElementById('general');
					generalElement.value = e.regid;
					alert('registration id = '+e.regid);
                }
            break;

            case 'message':
              // this is the actual push notification. its format depends on the data model
              // of the intermediary push server which must also be reflected in GCMIntentService.java
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;

            case 'error':
              alert('GCM error = '+e.msg);
            break;

            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }

};

