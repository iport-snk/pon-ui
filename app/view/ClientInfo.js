Ext.define('PON.view.ClientInfo', {
    extend: 'Ext.panel.Panel',
    requires: [
        'PON.view.ClientInfoController'
    ],
    controller: 'client-info',
    xtype: 'client-info',

    layout: {
        type: 'vbox'
    },

    items: [{
        xtype: 'grid',
        height: 168,
        hideHeaders: true,
        reference: 'info',
        columns: [{
            text: 'Prop',
            dataIndex: 'prop',
            align: 'right'
        },{
            text: 'Val',
            dataIndex: 'val',
            flex: 1,
            align: 'left'
        }],
    },{
        xtype: 'grid',
        border: true,
        //title: 'История сигнала',
        reference: 'signals',
        columns: [{
            text: 'Дата',
            dataIndex: 'datetime',
            flex: 1,
        },{
            text: 'dB',
            xtype: 'numbercolumn',
            format: '0.0',
            dataIndex: 'pwr',
            width: 80
        }],
        flex: 1
    },{
        xtype: 'titlebar',
        reference: 'titlebar',
        docked: 'top',
        titleAlign: 'center',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back',
            align: 'left'
        },{
            iconCls: 'x-fa fa-refresh',
            //iconCls: 'x-fa fa-stop',
            reference: 'rx-refresher',
            align: 'right',
            handler: 'toggleRxRefreshing'
        }]
    }],

    listeners: {
        setAction: 'setAction'
    }
});