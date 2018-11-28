Ext.define('PON.view.SfpSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sfp-settings',

    filterPorts: function (target, value) {
        let combo = this.lookup('sfp'),
            store = combo.getStore();

        store.clearFilter();
        store.filterBy( item => item.get('olt') === value );
        this.setActionsEnabled('enable');
    },

    filterStreets: function (target, value) {
        let combo = this.lookup('streetsCombo'),
            store = combo.getStore();

        store.clearFilter();
        store.filterBy( item => item.get('district') === value );
        this.setActionsEnabled('enable');
    },

    loadClients: function () {
        let searchByAddress = this.lookup('searchBy').getValue(),
            criterion;

        if (searchByAddress) {
            let street = this.lookup('streetsCombo').getSelection();

            if (street) {
                criterion = {
                    query: 'streets',
                    id: street.data.key,
                    title: street.data.key
                };
            } else {
                let district = this.lookup('districtsCombo').getSelection().data.district;

                criterion = {
                    query: 'streets',
                    id: district,
                    title: district
                };
            }

        } else {
            let sfp = this.lookup('sfp').getSelection();
            if (sfp) {
                let data = sfp.data,
                    olt = data.olt.split('.')[1];

                criterion = {
                    query: 'clients',
                    id: `${olt}.${data.port}`,
                    title: `OLT : ${data.district} : ${data.port}`
                };
            } else {
                let data = this.lookup('olt').getSelection().data,
                    olt = data._id.split('.')[1];

                criterion = {
                    query: 'clients',
                    id: `${olt}.`,
                    title: `OLT : ${data.district}`
                };
            }

        }

        Ext.ComponentQuery.query('pon-grid')[0].fireEvent('sfpchange', criterion);
    },

    loadBranch: function () {
        let target = this.lookup('sfp'),
            selection = target.getSelection();

        if (!Ext.isObject(selection)) return;

        let data = selection.data,
            olt = data.olt.split('.')[1],
            port = data.port,
            rootId = `${olt}.${port}`;

        Promise.all([
            this.getBoxes(rootId),
            this.getClients(rootId)
        ]).then( stores => {
            let [boxes, clients] = stores;

            let sfp = {
                id: rootId,
                port: port,
                district: data.district,
                districtId: data.districtId
            };
            let branch = [{
                type: 'group',
                children: [],
                id: 'undefGroup',
                expanded: false
            }].concat(clients, boxes);

            this.buildTree(branch, sfp);
        });
    },

    getBoxes: function (sfp) {
        return PON.app.db.query('boxes',  {
            startkey: sfp ,
            endkey: sfp
        }).then(r => {
            return r.rows.map(row => {
                row.value.id = row.value._id;
                row.value.children = [];
                return row.value;
            });
        })
    },

    getClients: function (sfp) {
        return PON.app.db.query('clients', {
            startkey: sfp ,
            endkey: sfp
        }).then(r => {
            return r.rows.map(row => {
                row.value.id = row.value._id;
                row.value.children = [];
                if (Ext.isEmpty(row.value.parentId)) {
                    row.value.parentId = 'undefGroup';
                }

                return row.value;
            });
        })
    },


    buildTree: function (data, sfp) {
        Ext.Viewport.setActiveItem(0);
        let tree = Ext.ComponentQuery.query('pon-tree')[0];
        let store = Ext.create('Ext.data.TreeStore', {
            type: 'memory',
            reader: {
                type: 'json'
            },
            parentIdProperty: 'parentId',
            lazyFill: false,
            data: data
        });

        tree.down('[reference="grid-header"]').setTitle(`${sfp.district} : ${sfp.port}`);

        tree.relayEvents(store, ['datachanged'], 'store');
        tree.setStore(store);
        tree.getRootNode().set('sfp', sfp);
    },

    setActionsEnabled: function (action) {
        let f = Ext.isObject(action) || Ext.isEmpty(action) ? 'enable' : action;

        ['treeBtn', 'gridBtn'].forEach( ref => this.lookup(ref)[f]());
    },

    showGrid: function () {
        this.loadClients();
    },

    showTree: function () {
        this.loadBranch();
    },

    loadSignals: async function () {
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка сигналов ОНУ' });
        await PON.utils.DB.updateSignals();
        Ext.Viewport.setMasked(false);
        this.setTitle();
    },

    setTitle: function () {
        let button = this.lookup('syncSignalsBtn');

        if (PON.app.signals) {
            let date = PON.app.signals.time.split(':'),
                formatted = `${date[0]}:${date[1]}`;

            button.setText(formatted);
            button.setDisabled(false);
        } else {
            button.setText('Статистика не загружена')
        }

    },

    refresh: function () {
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка' });

        PON.utils.DB.syncAll().then(
            info => this.updateDateOnRefreshed()
        ).catch( error => {
            console.warn(error);
        })
    },

    updateDateOnRefreshed: function () {
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: Договоров' });
        return PON.app.db.query('contracts', {
            startkey: '111.111' , endkey: '111.111'
        }).then( _ => {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: Улиц' });
            return PON.app.db.query('streets', { startkey: '' , endkey: '' });
        }).then( _ => {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: SFP' });
            return PON.app.db.query('clients', { startkey: '' , endkey: '' });
        }).then( _ => {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: Боксов' });
            return PON.app.db.query('boxes', { startkey: '' , endkey: '' });
        }).then( _ => {
            this.setTitle();
            this.getViewModel().fillStores();
            Ext.Viewport.setMasked(false);
        });
    },

    doSearch: function (field, search) {
        let wg = this.lookup('contracts'),
            store = wg.getStore();

        if (Ext.isEmpty(search)) {
            wg.setHidden(true);
        } else {
            wg.setHidden(false);
            PON.app.db.query('contracts', {
                startkey: search ,
                endkey: search + PON.app.MATCHER ,
                limit: 12
            }).then(r => {
                store.setData(r.rows.map( row => {
                    let sfp = row.value.sfp.split('.'),
                        mac = row.id.split('.')[1],
                        signal = PON.app.signals.data[mac];

                    row.value.sfp = sfp[0];
                    row.value.port = sfp[1];
                    row.value.id = row.value._id;
                    Ext.apply(row.value, signal);
                    return row.value
                }));
            }).catch( error => {
                store.setData([]);
            });
        }
    },

    selectContract: function (list, record) {
        this.lookup('search').setValue(record.get('contract'));
        this.lookup('contracts').setHidden(true);

        Ext.Viewport.down('client-info').fireEvent('setAction', {
            info: record,
            gettingBackCardId: PON.app.CARD_INDEXES.SFP_SELECTION,
            cb: function (record) {
                //data.sfp  = this.getSfp();
            }
        })
    },

    toggleFilter: function (field, value) {
        if (value) {
            this.lookup('filter-by-address').setHidden(false);
            this.lookup('filter-by-olt').setHidden(true);
        } else {
            this.lookup('filter-by-address').setHidden(true);
            this.lookup('filter-by-olt').setHidden(false);
        }
    },

    setAction: function (context) {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.SFP_SELECTION);
        this.getViewModel().fillStores();
        this.setTitle();
    },

    back: function  () {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.MAIN);
    }

});