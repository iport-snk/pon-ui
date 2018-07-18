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
        'PON.view.PonMap',
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
        CLIENT_INFO: 5,
        MAP: 6
    },

    MATCHER: '\ufff0',

    snmpApi: 'http://df.fun.co.ua/snmp.php',

    formatMac: function (mac) {
        return `${mac.substr(0, 2)}:${mac.substr(2, 2)}:${mac.substr(4, 2)}:${mac.substr(6, 2)}:${mac.substr(8, 2)}:${mac.substr(10, 2)}`
    },

    formatAddress: function (client) {
        let name = this.formatMac(client._id.split('.')[1]);
        if (client.street) name = `${client.street.split('-')[1].trim()} , ${client.house}`;
        if (client.contract) name += ' : ' + client.contract;
        return name;
    },

    keepAwake: function () {
        if (window.plugins && window.plugins.insomnia) window.plugins.insomnia.keepAwake();
    },

    allowSleep: function () {
        if (window.plugins && window.plugins.insomnia) window.plugins.insomnia.allowSleepAgain();
    },

    getGps: function () {
        return new Promise( (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => resolve([position.coords.latitude, position.coords.longitude]),
                reject,
                {enableHighAccuracy: true}
            )
        })
    },

    launch: async function () {
        PON.app.keepAwake();

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
        },{
            xtype: 'pon-map'
        }]);
        try {
            await PON.utils.DB.init()
        } catch (e) {
            console.log('signals is not replicated yet')
        }
        Ext.Viewport.down('sfp-settings').fireEvent('setAction');
    }
});
