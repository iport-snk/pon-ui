Ext.define('PON.view.PromoModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.promo',

    stores: {
        districts: {
            fields: ['district'],
            sorters: 'district'
        },
    },

    fillStores: function () {
        let dStore = this.getStore('districts');

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
                }
            }
            dStore.setData(districts);
        })
    },
});