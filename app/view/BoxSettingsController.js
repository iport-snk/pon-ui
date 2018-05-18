Ext.define('PON.view.BoxSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.box-settings',

    getDirtyFields: function () {
        this.getView().getFields
    },

    save: function() {
        let data = Ext.apply({
            type: 'box'
        }, this.getView().getValues());

        this.getView().reset();
        Ext.Viewport.setActiveItem(0);
        this.onSaveFunction(data);
    },

    back: function () {
        this.getView().reset();
        Ext.Viewport.setActiveItem(0);
    },

    setAction: function (context) {
        Ext.Viewport.setActiveItem(1);
        this.onSaveFunction = context.cb;

        this.getView().reset();
        if (context.formdData) this.getView().setValues(context.formdData);
    }
});