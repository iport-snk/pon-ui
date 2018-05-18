Ext.define('PON.view.SfpSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sfp-settings',

    filterPorts: function (target, value) {
        let ports = this.lookup('sfp').getStore();

        ports.clearFilter();
        ports.filterBy( item => item.get('olt') === value )
    },

    loadBranch: function (target, value) {
        let docId = target.getSelection().id;

        PON.app.db.query('sfp', {startkey: docId, endkey: docId}).then(function (result) {
            let branch = result.rows.map( row => {
                row.value.id = row.value._id;
                row.value.children = [];
                return row.value
            });

            let tree = Ext.ComponentQuery.query('pon-tree')[0];

            if (branch.length === 1) branch[0].children = [];
            branch.find( node => node._id === docId).expanded = true;

            let store = Ext.create('Ext.data.TreeStore', {
                type: 'memory',
                reader: {
                    type: 'json'
                },
                parentIdProperty: 'parentId',
                lazyFill: false,
                data: branch
            });
            tree.relayEvents(store, ['datachanged'], 'store');
            tree.setStore(store);

            Ext.Viewport.setActiveItem(0);
        });
    }
});