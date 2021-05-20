Ext.define('PON.view.PromoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.promo',
    setAction: function (context) {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.PROMO);
        this.getViewModel().fillStores();
    },

    back: function () {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.MAIN);
    },

    goNewAd: function () {
        console.log('ddd')
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.PROMO_INFO);
    },

    goNewComp: function () {
        console.log('sss')
    }
});