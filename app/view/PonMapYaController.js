Ext.define('PON.view.PonMapYaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pon-map-ya',
    position: [50.3482, 30.9561],
    body: null,

    draw: function (panel, el) {
        this.body = panel.bodyElement.dom;

        if (Ext.isEmpty(this.ya)) {
            this.ya = new ymaps.Map($(this.body).prop('id'), {
                center: this.position,
                zoom: 19
            });

        }

        this.ya.setCenter(this.position, 19);

        this.mark = new ymaps.Placemark(this.position, {}, {
            preset: 'islands#blueHomeIcon',
            draggable: true
        });

        this.ya.geoObjects.add(this.mark);

        this.getView().lookup('header').setTitle('ya');
    },

    setAction: function (e) {
        this.position = e.data;

        this.save = _ => {
            e.save(this.mark.geometry.getCoordinates());
            this.ya.geoObjects.removeAll();
            e.back();
        };

        this.back = _ => {
            this.ya.geoObjects.removeAll();
            e.back();
        };

        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.MAP);
    }


});