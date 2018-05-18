Ext.define('PON.view.PonTreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.pon-tree',

    stores: {
        ponTree: {
            type: 'tree',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                },
                __url: '/app/data/pon-tree.json'
            },
            parentIdProperty: 'parentId',

        }
    }
});