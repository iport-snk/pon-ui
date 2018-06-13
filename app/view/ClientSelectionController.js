Ext.define('PON.view.ClientSelectionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.client-selection',

    save: function() {
        this.onSaveFunction(this.lookup('address').getSelection());

        this.getView().reset();
        Ext.Viewport.setActiveItem(0);

    },

    back: function () {
        this.getView().reset();
        Ext.Viewport.setActiveItem(0);
    },

    setAction: function (context) {
        Ext.Viewport.setActiveItem(3);
        this.onSaveFunction = context.cb;

        this.getView().reset();
        let clients = context.clients;

        let store = Ext.create('Ext.data.Store', {
            fields: ['address', 'contract'],
            data: clients.map( item => ({
                node: item,
                contract: item.data.contract,
                address: PON.app.formatAddress(item.data)
            }))
        });

        store.setSorters('address');
        this.lookup('address').setStore(store);
    }
});