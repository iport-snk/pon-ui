Ext.define('PON.view.BoxSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.box-settings',

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

        this.lookup('address').setLabel('Координаты');

        this.getView().reset();
        if (context.formdData) this.getView().setValues(context.formdData);
    },

    getLocation: async function () {
        let field = this.lookup('address'),
            position = field.getValue();

        if (Ext.isEmpty(position)) {
            position = await PON.app.getGps();
        } else {
            position = position.split(" ");
        }


        Ext.Viewport.down('pon-map').fireEvent('setAction', {
            data: position,
            back: _ => Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.BOX_SETTINGS),
            save: position => field.setValue(`${position[0]} ${position[1]}`),
            cb: data => {

            }
        });
    }
});