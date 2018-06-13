Ext.define('PON.view.SfpSettingsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.sfp-settings',

    stores: {
        olts: {
            fields: ['district', '_id', 'ports', 'districtId'],
            sorters: 'district'
        },
        ports: {
            fields: ['olt', 'port', 'district', 'districtId'],
            sorters: 'port'
        },
        districts: {
            fields: ['district'],
            sorters: 'district'
        },
        streets: {
            fields: ['street', 'key', 'district'],
            sorters: 'key'
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
                        district: item.doc.district,
                        districtId: item.doc.districtId
                    })
                });
            });
            ports.setData(data);
            ports.filterBy( _ => false);
        });

        this.fillAddresses();
    },

    fillAddresses: function () {
        let dStore = this.getStore('districts'),
            sStore = this.getStore('streets');

        sStore.clearFilter();
        //dStore.removeAll();
        //sStore.removeAll();

        let districts = [], streets = [],
            district, street;

        PON.app.db.query('streets').then( r => {
            for (i = 0; i < r.rows.length; i++) {
                if (street != r.rows[i].key) {
                    street = r.rows[i].key;
                    let region = street.split('-'),
                        dist = region[0].trim();

                    if (dist != district) {
                        district = dist;
                        districts.push({district: dist});
                    }


                    streets.push({
                        key: street,
                        district: district,
                        street: region.length > 1 ? region[1].trim() : ''
                    });

                }
            }
            dStore.setData(districts);
            sStore.setData(streets);
            //sStore.filterBy( _ => false);
        })
    },
});