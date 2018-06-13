Ext.define('PON.view.PonTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pon-tree',

    FIELDS: {
        box: {
            add: ['_id', 'address', 'branch', 'coupler', 'index', 'parentId', 'splitter', 'type', 'sfp'],
            update: ['_id', '_rev', 'address', 'branch', 'coupler', 'index', 'parentId', 'splitter', 'type', 'sfp'],
        },
        client: {
            add: ['_id', 'address', 'contract', 'index', 'parentId', 'type', 'sfp'],
            update: ['_id', '_rev', 'contract', 'address', 'index', 'parentId', 'type', 'sfp']
        }
    },

    onSelectionChange: function(selectable, selection) {
        /*var button = this.lookup('add-button'),
            selectedNode;

        if (selection.length) {
            selectedNode = selection[0];

            if (selectedNode instanceof KitchenSink.model.tree.Territory) {
                button.setText('Add Country');
                button.enable();
            } else if (selectedNode instanceof KitchenSink.model.tree.Country) {
                button.setText('Add City');
                button.enable();
            } else {
                button.disable();
            }
        } else {
            button.setText('Add Territory');
            button.enable();
        }*/
    },

    getSfp: function () {
        return this.getView().getRootNode().get('sfp');
    },

    getNextBoxId: function (items) {
        let boxes = items.filter( _ => _.data.type === 'box'),
            lastId = 0;

        if (boxes.length === 0) {
            return 0
        } else if (boxes.length === 1) {
            lastId = boxes[0].id
        } else {
            lastId = boxes.reduce(function(a, b) {
                return a.id > b.id ? a.id : b.id;
            });
        }

        let id = parseInt(lastId.substr(lastId.lastIndexOf('.') + 1));
        return id + 1;
    },

    applyAddBoxSettings: function (item, tree) {
        //let id = this.getNextBoxId(tree.getStore().getData().items);
        let id = (new Date()).getTime(),
            sfp = this.getSfp();

        item.sfp = sfp.id;
        item.id = item._id = `b.${sfp.districtId}.${id}`;
        item.children = [];
    },

    addBox: function( ) {
        let tree = this.getView(),
            selected = tree.getSelections()[0],
            target = selected ? selected.parentNode : tree.getRootNode();


        Ext.Viewport.down('box-settings').fireEvent('setAction', {
            cb: data => {
                this.applyAddBoxSettings(data, tree);

                let node = target.insertBefore(data, Ext.isEmpty(selected) ? null : selected.nextSibling );

                this.dbPost(node, this.FIELDS.box.add);
                tree.select(node);
            }
        })
    },

    addBranch: function( ) {
        let tree = this.getView(),
            target = tree.getSelections()[0];

        Ext.Viewport.down('box-settings').fireEvent('setAction', {
            cb: data => {
                this.applyAddBoxSettings(data, tree);

                let node = target.appendChild(data);

                this.dbPost(node, this.FIELDS.box.add);
                if (!target.isExpanded()) target.expand(false);
                tree.select(node);
            }
        })
    },

    dbPost: function (node, fields) {
        let data = {}, keys = fields.forEach( key => data[key] = node.get(key));

        PON.app.db.post(data).then( result => {
            node.setId(result.id);
        });
    },

    edit: function () {
        let tree = this.getView(),
            target = tree.getSelections()[0],
            type = target.get('type');

        Ext.Viewport.down(`${type}-settings`).fireEvent('setAction', {
            formdData: target.data,
            cb: data => {
                target.set(data);
                this.dbPut(target, this.FIELDS[type].update);
            }
        })
    },

    dbPut: function (node, fields) {
        let data = {}, keys = fields.forEach( key => data[key] = node.get(key));

        PON.app.db.put(data).then( result => {
            node.set('_rev', result.rev);
        });
    },

    dbUpdate: function (node, data) {
        PON.app.db.get(node.data._id).then( record => {
            let fresh = Ext.apply(record, data);
            return PON.app.db.put(fresh);
        }).then( result => {
            node.set('_rev', result.rev)
        })
    },


    addCustomer: function( ) {
        let tree = this.getView(),
            target = tree.getSelections()[0];

        Ext.Viewport.down('client-selection').fireEvent('setAction', {
            clients: this.getUnresolvedClients(),
            cb: record => {
                //data.sfp  = this.getSfp();
                let node = record.data.node;

                target.appendChild(node);

                this.dbUpdate(node, {parentId: node.get('parentId')});
                if (!target.isExpanded()) target.expand(false);
                tree.select(node);
            }
        })
    },

    back: function () {
        Ext.Viewport.setActiveItem(2);
    },

    moveUp: function () {
        let tree = this.getView(),
            target = tree.getSelections()[0],
            prev = target.previousSibling;

        if (target.previousSibling) {
            target.parentNode.insertBefore(target, prev);
            tree.select(target);

            this.dbUpdate(target, {index: target.get('index')});
            this.dbUpdate(prev, {index: prev.get('index')});
        }
    },

    moveDown: function () {
        let target = this.getView().getSelections()[0],
            next = target.nextSibling;

        if (target.nextSibling) target.parentNode.insertBefore(next, target);

        this.dbUpdate(next, {index: next.get('index')});
        this.dbUpdate(target, {index: target.get('index')});
    },

    selected: function (tree, selection) {
        if (!Ext.isArray(selection) || selection[0].data.id.endsWith('.undef')) {
            this.setItemActions('disable');
        } else {
            this.setItemActions('enable');
        }
    },

    setItemActions: function (action) {
        let f = Ext.isObject(action) ? 'disable' : action;

        ['addBranchBtn', 'addCustomerBtn', 'moveUp', 'moveDown', 'editBtn'].forEach(
            btn => this.lookup(btn)[f]()
        )
    },

    getUnresolvedClients: function () {
        let store = this.getView().getStore(),
            clients = store.findNode('type', 'group');

        return clients.childNodes;
    }


});