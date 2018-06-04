Ext.define('PON.view.SfpSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sfp-settings',

    filterPorts: function (target, value) {
        let combo = this.lookup('sfp'),
            store = combo.getStore();

        store.clearFilter();
        store.filterBy( item => item.get('olt') === value );
        this.setActionsEnabled('disable');
    },

    loadClients: function () {
        let data = this.lookup('sfp').getSelection().data,
            olt = data.olt.split('.')[1],
            sfp = {
                id: `${olt}.${data.port}`,
                port: data.port,
                district: data.district,
            };

        Ext.ComponentQuery.query('pon-grid')[0].fireEvent('sfpchange', sfp);
    },

    loadBranch: function () {
        let target = this.lookup('sfp'),
            selection = target.getSelection();

        if (!Ext.isObject(selection)) return;

        let data = selection.data,
            olt = data.olt.split('.')[1],
            port = data.port,
            rootId = `${olt}.${port}`;

        PON.app.db.allDocs({
            include_docs: true,
            startkey: `n.${rootId}.`,
            endkey: `n.${rootId}.${PON.app.MATCHER}`
        }).then( result => {
            let sfp = {
                id: rootId,
                port: port,
                district: data.district,
            };
            let branch = [{
                type: 'group',
                children: [],
                id: rootId + '.undef',
                //parentId: rootId,
                expanded: false
            }].concat(result.rows.map( row => {
                row.doc.id = row.doc._id;
                row.doc.children = [];

                if (row.doc.type === 'client' && Ext.isEmpty(row.doc.parentId)) {
                    row.doc.parentId = rootId + '.undef'
                }
                return row.doc
            }));

            this.buildTree(branch, sfp);
        });
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
        PON.app.db.replicateFrom().then( info => {
            this.updateDateOnRefreshed();
        }).catch( error => {
            debugger;
        })
    },

    updateDateOnRefreshed: function () {
        Ext.Viewport.setMasked(false);
        this.setTitle();
        this.getViewModel().fillStores();
    },

    setAction: function (context) {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.SFP_SELECTION);
        this.getViewModel().fillStores();
        this.setTitle();
    }

});