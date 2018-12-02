Ext.define('PON.view.PromoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.promo',
    setAction: function (context) {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.PROMO);
        this.getViewModel().fillStores();
    },
});