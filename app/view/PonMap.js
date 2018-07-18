Ext.define('PON.view.PonMap', {
    extend: 'Ext.Panel',
    xtype: 'pon-map',
    mixins: ['Ext.mixin.Mashup'],
    requiredScripts: [
        'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
        //'//maps.googleapis.com/maps/api/js?key=AIzaSyD52ON0i4XrydN5OPKn4QHKY2Bd4QXztlU'
    ],
    requires: [
        'PON.view.PonMapController'
    ],
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
    controller: 'pon-map',
    layout: 'fit',
    shadow: true,
    cls: 'map-container',
    listeners: {
        painted: 'draw',
        setAction: 'setAction'
    }

});