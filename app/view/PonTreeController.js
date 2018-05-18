Ext.define('PON.view.PonTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pon-tree',

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
        return this.getView().getStore().getData().getAt(0).getData().sfp;
    },

    addBox: function( ) {
        let tree = this.getView(),
            selected = tree.getSelections()[0],
            target = selected.parentNode;

        Ext.Viewport.down('box-settings').fireEvent('setAction', {
            formdData: { sfp: this.getSfp()},
            cb: data => {
                data.sfp  = this.getSfp();
                let node = target.insertBefore(data, selected.nextSibling);

                this.dbPost(node);
                tree.select(node);
            }
        })
    },

    addBranch: function( ) {
        let tree = this.getView(),
            target = tree.getSelections()[0];

        Ext.Viewport.down('box-settings').fireEvent('setAction', {
            formdData: { sfp: this.getSfp()},
            cb: data => {
                data.sfp  = this.getSfp();
                let node = target.appendChild(data);

                this.dbPost(node);
                if (!target.isExpanded()) target.expand(false);
                tree.select(node);
            }
        })
    },

    dbPost: function (node) {
        let data = {}, keys = [
                'address', 'branch', 'coupler', 'index', 'parentId', 'splitter', 'type', 'sfp'
            ].forEach( key => data[key] = node.get(key));

        PON.app.db.post(data).then( result => {
            node.setId(result.id);
        });
    },

    edit: function () {
        let tree = this.getView(),
            target = tree.getSelections()[0];

        Ext.Viewport.down('box-settings').fireEvent('setAction', {
            formdData: target.data,
            cb: data => {
                target.set(data);
                this.dbPut(target);
            }
        })
    },

    dbPut: function (node) {
        let data = {}, keys = [
            '_id', '_rev', 'address', 'branch', 'coupler', 'index', 'parentId', 'splitter', 'type', 'sfp'
        ].forEach( key => data[key] = node.get(key));

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
        //Ext.Viewport.setActiveItem(1);
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

    datachanged: function () {
        console.log('changed')
    }

});