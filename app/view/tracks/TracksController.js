Ext.define('PON.view.tracks.TracksController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tracks',
    requires: ['PON.utils.LeafMap'],

    data: {
        tracks: []
    },

    getTrack: function (){
        if (this.data.tracks.length === 0) return null;
        return this.data.tracks[this.data.tracks.length - 1];
    },

    constructor: function () {
        this.initLeaf = PON.utils.LeafMap.init.bind(this);
    },

    togglePace: async function () {
        let pace = this.getViewModel().get('pace');

        if (pace) {
            this.stopTracking();
        } else {
            this.startTracking();
        }
    },

    startTracking: async function() {
        // sync
        await PON.app.geo.sync();
        // draw line
        await this.drawTrack();
        // changePace true
        await PON.app.geo.changePace(true);
        this.getViewModel().set('pace', true);

        // keep going handling events
    },

    stopTracking: async function() {
        await PON.app.geo.changePace(false);
        this.getViewModel().set('pace', false);
    },

    resumeTracking: function() {

    },

    back: function() {

    },

    geo: function () {
        if (window.BackgroundGeolocation) {
            let g = PON.app.geo = window.BackgroundGeolocation,
                me = this;

            g.onLocation(function(location) {
                console.log('[location] -', location);
                me.trackMotion(location, me);
            });

            g.onMotionChange((event) => {
                console.log('[motionchange] -', event.isMoving, event.location);
            });
            //g.onMotionChange( event => this.trackMotion(event));
            g.ready({
                debug: false,
                reset: true,
                logLevel: g.LOG_LEVEL_VERBOSE,
                desiredAccuracy: g.DESIRED_ACCURACY_HIGH,
                distanceFilter: 1,
                //url: 'http://172.16.252.100:3000/telemetry',
                autoSync: false,
                //autoSyncThreshold: 5,
                batchSync: true,
                //maxBatchSize: 50,
                stopOnTerminate: false,
                foregroundService: true,
                startOnBoot: true
            }, function(state) {    // <-- Current state provided to #configure callback
                // 3.  Start tracking
                console.log('BackgroundGeolocation is configured and ready to use');
                if (!state.enabled) {
                    g.start().then(function() {
                        console.log('- BackgroundGeolocation tracking started');
                    });

                }
            });
        }

    },

    setAction: function (context) {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.TRACKS);
    },

    trackMotion: function (location, context) {
        let track = this.getTrack();
        console.log('trackMotion', this);
        console.log('context', context);
        if (track) {
            let latlng = [location.coords.latitude, location.coords.longitude];

            track.addLatLng(latlng);
            this.map.panTo(latlng);
        }

    },

    drawTrack: async function () {
        let track = PON.app.geo.getLocations();
        console.log('track', track);
        let latlngs = track.map( _ => ([_.coords.latitude, _.coords.longitude]));
        let last = latlngs[latlngs.length - 1];

        this.data.tracks.push( L.polyline(latlngs, {color: 'red'}).addTo(this.map) );
        this.map.setView({lat: last[0], lng: last[1]}, 19);
    },

    drawLeaf: function(panel) {
        this.initLeaf(panel.bodyElement.dom);
        this.geo();
    },
});