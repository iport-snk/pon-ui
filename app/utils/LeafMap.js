Ext.define('PON.utils.LeafMap', {


    statics: {
        init: function (el) {
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

            navigator.geolocation.getCurrentPosition( position => {
                this.map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }, 19);

            })
        },
    }
});