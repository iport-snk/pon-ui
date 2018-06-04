Ext.define('PON.view.SfpSettingsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.sfp-settings',

    stores: {
        olts: {
            fields: ['district', '_id', 'ports'],
            sorters: 'district'
        },
        ports: {
            fields: ['olt', 'port', 'district'],
            sorters: 'port'
        }
    },

    fillStores: function () {
        let olts = this.getStore('olts'),
            ports = this.getStore('ports');

        ports.clearFilter();
        olts.removeAll();
        ports.removeAll();

        PON.app.db.allDocs({
            include_docs: true,
            startkey: 'o.',
            endkey: 'o.' + PON.app.MATCHER
        }).then(function (result) {
            let data = [];
            result.rows.forEach( item => {
                olts.add(item.doc);
                item.doc.ports.split(',').forEach( function(port) {
                    data.push({
                        olt: item.doc._id,
                        port: port,
                        district: item.doc.district
                    })
                });
            });
            ports.setData(data);
            ports.filterBy( _ => false);
        });
    }
});