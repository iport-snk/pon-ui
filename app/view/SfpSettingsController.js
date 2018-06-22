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
            this.getUnresolvedClients(rootId)
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

    getUnresolvedClients: function (sfp) {
        return PON.app.db.query('clients', {
            startkey: sfp ,
            endkey: sfp
        }).then(r => {
            return r.rows.map(row => {
                row.value.id = row.value._id;
                row.value.children = [];
                if (Ext.isEmpty(row.value.parentId)) {
                    row.value.parentId = 'undefGroup';
                } else {
                    console.log(row.value)
                }

                return row.value;
            });
        })
    },


    buildTree: function (data, sfp) {
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

        tree.setTitle(`${sfp.district} : ${sfp.port}`);

        tree.relayEvents(store, ['datachanged'], 'store');
        tree.setStore(store);
        tree.getRootNode().set('sfp', sfp);

        Ext.Viewport.setActiveItem(0);
    },

    loadOlts: function () {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Загрузка'
        });

        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getOlts'
        }).done( data => {
            data.forEach( async _ => {
                let dr, record = {
                    _id: 'o.' + _.olt,
                    type: 'olt',
                    district: _.place,
                    numsfp: _.numsfp,
                    ports: _.ports
                };

                try {
                    dr = await PON.app.db.get(record._id);
                    record._rev = dr._rev;
                } catch (e) {

                } finally {
                    PON.app.db.put(record);

                }
            });

            Ext.Viewport.setMasked(false);
        });
    },

    loadOnus: function () {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Загрузка'
        });

        PON.app.db.refreshSignals().then( info => {
            this.updateDateOnRefreshed()
        })
    },


    setActionsEnabled: function (action) {
        let f = Ext.isObject(action) || Ext.isEmpty(action) ? 'enable' : action;

        ['treeBtn', 'gridBtn'].forEach( ref => this.lookup(ref)[f]());
    },

    showGrid: function () {
        this.loadClients();
    },

    showTree: function () {
        //PON.app.db.syncOn();
        this.loadBranch();
    },

    setTitle: function () {
        this.getView().setTitle('Индексация ...');
        PON.app.db.query('clients', {limit: 1}).then(r => {
            this.getView().setTitle(r.rows[0].value.time);
        }).catch( error => this.getView().setTitle('Статистика не загружена'));
    },

    refresh: function () {
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка' });
        //PON.app.db.replicateFrom().then( info => {
        PON.app.db.syncOnce().then( info => {
            this.updateDateOnRefreshed();
        }).catch( error => {
            console.warn(error);
        })
    },

    updateDateOnRefreshed: function () {
        PON.app.db.query('contracts', {
            startkey: '111.111' ,
            endkey: '111.111'
        }).then( _ => {
            Ext.Viewport.setMasked(false);
            this.setTitle();
            this.getViewModel().fillStores();
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
                    let sfp = row.value.sfp.split('.');

                    row.value.sfp = sfp[0];
                    row.value.port = sfp[1];
                    row.value.id = row.value._id;
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
    }

});