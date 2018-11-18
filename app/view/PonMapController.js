Ext.define('PON.view.PonMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map',

    initLeaf: function (el) {
        if(this.map) {
            this.map.invalidateSize();
            return;
        };

        //Remove the API Required div
        if (el.firstChild) {
            Ext.fly(el.firstChild).destroy();
        }


        let normal = L.tileLayer.here({
                appId: 'w5wENGWZ4ula2lwOcDTL',
                appCode: 'A-yZC7Ls9bbT-6sIJ1cR1w',
                scheme: 'normal.day.mobile'
            }),
            hybrid = L.tileLayer.here({
                appId: 'w5wENGWZ4ula2lwOcDTL',
                appCode: 'A-yZC7Ls9bbT-6sIJ1cR1w',
                scheme: 'hybrid.day.mobile'
            });

        this.map = L.map(el, {
            zoom: 19,
            layers: [hybrid, normal]
        });

        L.control.layers({
            "hybrid": hybrid,
            "normal": normal

        }).addTo(this.map);
    },

    setPositionLeaf: function () {
        let pos = {lat:this.position[0], lng:this.position[1]};

        this.map.setView(pos, 19);

        if (this.marker) {
            this.marker.setLatLng(pos);
        } else {
            this.marker = L.marker(pos, {
                draggable: true
            }).addTo(this.map);
        }



    },

    drawLeaf: function(panel) {
        this.initLeaf(panel.bodyElement.dom);
        this.setPositionLeaf();


    },

    drawHere: function (panel) {
        this.initHere(panel);
        this.switchMapLanguage();
        this.setPosition();
    },

    setPosition: function () {
        let pos = {lat:this.position[0], lng:this.position[1]};

        this.map.setCenter(pos);
        //this.setMarker(pos);
        this.map.setZoom(19);


    },

    switchMapLanguage: function(){
        let mapTileService = this.platform.getMapTileService({
                //type: 'aerial'
                type: 'base'
            }),
            // Our layer will load tiles from the HERE Map Tile API
            localMapLayer = mapTileService.createTileLayer(
                'maptile',
                //'hybrid.day.mobile',
                'normal.day.mobile',
                256,
                'png8',
                {lg: 'ukr', ppi:  undefined}
            );
        this.map.setBaseLayer(localMapLayer);
    },

    setMarker: function (pos) {
        if (this.marker) {
            this.marker.setPosition(pos);
            return;
        }


        this.marker = new H.map.Marker(pos);
        // Ensure that the marker can receive drag events
        this.marker.draggable = true;
        this.map.addObject(this.marker);

        // disable the default draggability of the underlying map
        // when starting to drag a marker object:
        this.map.addEventListener('dragstart', ev => {
            let target = ev.target;
            if (target instanceof H.map.Marker) {
                this.behavior.disable();
            }
        }, false);


        // re-enable the default draggability of the underlying map
        // when dragging has completed
        this.map.addEventListener('dragend', ev => {
            let target = ev.target;
            if (target instanceof H.map.Marker) {
                this.behavior.enable();
            }
        }, false);

        // Listen to the drag event and move the position of the marker
        // as necessary
        this.map.addEventListener('drag', ev => {
            let target = ev.target,
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker) {
                target.setPosition(this.map.screenToGeo(pointer.viewportX, pointer.viewportY));
            }
        }, false);
    },

    initHere: function (panel) {
        //if (this.map) return;

        var pixelRatio = window.devicePixelRatio || 1;
        var el = Ext.query('.map', panel.bodyElement.dom)[0];


        this.platform = new H.service.Platform({
            'app_id': 'w5wENGWZ4ula2lwOcDTL',
            'app_code': 'A-yZC7Ls9bbT-6sIJ1cR1w',
            useCIT: false,
            useHTTPS: false
        });


        this.defaultLayers = this.platform.createDefaultLayers({
            tileSize: pixelRatio === 1 ? 256 : 512,
            ppi: pixelRatio === 1 ? undefined : 320
        });

        //Step 2: initialize a map  - not specificing a location will give a whole world view.
        this.map = new H.Map(
            el,
            this.defaultLayers.normal.map,
            {
                pixelRatio: pixelRatio
            }
        );
        window.addEventListener('resize', () => this.map.getViewPort().resize());

        //Step 3: make the map interactive
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        this.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

        // Create the default UI components
        var ui = H.ui.UI.createDefault(this.map, this.defaultLayers, 'ru-RU');

    },

    getPosition: function () {
        if (typeof this.marker.getLatLng === 'function') {
            return this.marker.getLatLng()
        } else {
            return this.marker.getPosition()
        }

    },

    setAction: function (e) {
        this.position = e.data;

        this.getView().lookup('header').setTitle(e.title);

        this.save = _ => {
            let pos = this.getPosition();
            e.save([pos.lat, pos.lng]);
            e.back();
        };

        this.back = _ => {
            e.back();
        };

        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.MAP);
    }
});