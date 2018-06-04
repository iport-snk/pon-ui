Ext.application({
    name: 'PON',
    phone: false,
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
        'PON.view.PonGrid',
        'PON.view.BoxSettings',
        'PON.view.ClientSelection',
        'PON.view.ClientInfo',
    ],

    viewport: {
        layout: 'card'
    },

    schema: {
        box: ['id', 'parentId', 'address', 'coupler', 'splitter', 'branch'],
        client: ['id', 'parentId', 'address', 'contract']
        // olt index:           o.[olt]
        // node onu index:      n.[olt].[port].c.[mac]
        // node box index:      n.[olt].[port].b.[id]
    },

    CARD_INDEXES: {
        SFP_SELECTION: 2,
        TREE: 0,
        GRID: 4,
        CLIENT_SELECTION: 3,
        BOX_SETTINGS: 1,
        CLIENT_INFO: 5
    },

    MATCHER: '\ufff0',

    formatMac: function (mac) {
        return `${mac.substr(0, 2)}:${mac.substr(2, 2)}:${mac.substr(4, 2)}:${mac.substr(6, 2)}:${mac.substr(8, 2)}:${mac.substr(10, 2)}`
    },

    launch: function () {
        this.db = PON.utils.DB.init();

        //PON.utils.Auth.auth().then( user => {
        //    PON.app.user = user;

            Ext.Viewport.add([{
                xtype: 'pon-tree'
            },{
                xtype: 'box-settings'
            },{
                xtype: 'sfp-settings'
            },{
                xtype: 'client-selection'
            },{
                xtype: 'pon-grid'
            },{
                xtype: 'client-info'
            }]);

            Ext.Viewport.down('sfp-settings').fireEvent('setAction');


        /*}).catch( err => {

            Ext.Msg.alert(
                err.status,
                err.user.id + "<br /><br />" + err.user.email + "<br /><br />" + err.user.name
            );

        });*/
    },
    _launch: function () {
        this.db = PON.utils.DB.init();
        Ext.Viewport.add([{
            xtype: 'pon-tree'
        },{
            xtype: 'box-settings'
        },{
            xtype: 'sfp-settings'
        },{
            xtype: 'client-selection'
        },{
            xtype: 'pon-grid'
        }]);
        Ext.Viewport.setActiveItem(2);
        Ext.ComponentQuery.query('sfp-settings')[0].getViewModel().fillStores();
    }
});
