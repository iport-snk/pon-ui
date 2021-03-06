Ext.define('PON.view.PonMap', {
    extend: 'Ext.panel.Panel',
    xtype: 'pon-map',
    requires: [
        'PON.view.PonMapController'
    ],
    controller: 'map',
    html: '<div class = "map" id = "map"></div>',
    items: [{
        reference: 'header',
        xtype: 'titlebar',
        docked: 'top',
        titleAlign: 'center',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back',
            align: 'left'
        },  {
            reference: 'saveBtn',
            iconCls: 'x-fa fa-save',
            handler: 'save',
            align: 'right'
        }]
    }],
    listeners: {
        //painted: 'drawHere',
        painted: 'drawLeaf',
        setAction: 'setAction'

    }


});