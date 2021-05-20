Ext.define('PON.view.tracks.Tracks', {
    extend: 'Ext.panel.Panel',
    xtype: 'tracks',
    requires: [
        'PON.view.tracks.TracksController',
        'PON.view.tracks.TracksModel'
    ],
    controller: 'tracks',
    viewModel: 'tracks',

    html: '<div class = "map"></div>',
    items: [{
        reference: 'header',
        xtype: 'titlebar',
        docked: 'top',
        titleAlign: 'center',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back'
        }, {
            bind: {
                iconCls: 'x-fa fa-{pace ? "stop" : "play"}',
            },
            margin: '0 20 0 0',
            align: 'right',
            handler: 'togglePace'
        }, {
            reference: 'saveBtn',
            iconCls: 'x-fa fa-save',
            align: 'right'
        }]
    }],
    listeners: {
        painted: 'drawLeaf',
        setAction: 'setAction'

    }
});