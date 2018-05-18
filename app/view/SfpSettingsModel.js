Ext.define('PON.view.SfpSettingsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.sfp-settings',

    stores: {
        olts: {
            fields: ['name']
        },
        ports: {
            fields: ['name', 'id', 'device']
        }
    },

    fillStores: function () {
        let olts = this.getStore('olts'),
            ports = this.getStore('ports');

        PON.app.db.query(function (doc, emit) {
            if (doc.type === 'sfp') {
                emit(doc.port, {port: doc.port, olt: doc.olt, address: doc.address});
            }
        }).then(function (result) {
            result.rows.forEach( item => {
                let docId = item.id,
                    port = item.value.port,
                    olt = item.value.olt;

                if (olts.findExact('name', olt) === -1) olts.add({name: olt});
                ports.add({name: port, id: docId, olt: olt});
            });
            ports.filterBy( _ => false);
        });

    }
});