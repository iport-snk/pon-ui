Ext.application({
    name: 'PON',
    requires: [
        'PON.model.Box',
        'PON.model.Client',
        'PON.model.Sfp',
        'PON.utils.Auth',
        'PON.utils.DB'
    ],

    views:[
        'PON.view.SfpSettings',
        'PON.view.PonTree',
        'PON.view.BoxSettings',
    ],

    viewport: {
        layout: 'card'
    },

    schema: {
        box: ['id', 'parentId', 'address', 'coupler', 'splitter', 'branch'],
        client: ['id', 'parentId', 'address', 'contract']
    },

    launch: function () {
        this.db = PON.utils.DB.init();

        PON.utils.Auth.auth().then( user => {
            PON.app.user = user;

            Ext.Viewport.add([{
                xtype: 'pon-tree'
            },{
                xtype: 'box-settings'
            },{
                xtype: 'sfp-settings'
            }]);
            Ext.Viewport.setActiveItem(2);
            Ext.ComponentQuery.query('sfp-settings')[0].getViewModel().fillStores();

        }).catch( err => {

            Ext.Msg.alert(
                err.status,
                err.user.id + "<br /><br />" + err.user.email + "<br /><br />" + err.user.name
            );

        });
    }
});
