Ext.define('PON.view.Start', {
    extend: 'Ext.Panel',
    xtype: 'start',
    requires: [
        'PON.view.StartController'
    ],
    autoSize: true,
    bodyPadding: 20,
    controller: 'start',
    title: 'IPORT.mobile',
    defaults: {
        xtype: 'button',
        cls: 'main-button',
        margin: '10 0',
        width: '100%'
    },
    tools: [{
        type: 'gear',
        handler: function() {
            Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.SETTINGS);
        }
    }],
    items: [{
        text: 'ЗАДАЧИ',
        handler: 'toggleTasks',
        reference: 'goTasks',
        //disabled: true
    }, {
        text: 'PON CONTROL',
        handler: 'togglePonControl',
        reference: 'goPon',
        disabled: true
    }, {
        text: 'PROMO',
        handler: 'togglePromo',
        reference: 'goPromo'
    }, {
        text: 'TRACK',
        handler: 'toggleTracks',
        reference: 'goTracks'
    }, {
        text: '-> MOVING',
        handler: function () {
            PON.app.geo.changePace(true, function() {
                console.log('- plugin is now tracking');
            });
        },
    }, {
        text: '-> STATIONARY',
        handler: function () {
            PON.app.geo.changePace(false, function() {
                console.log('- plugin is in stationary state');
            });
        },
    }],
    listeners: {
        show: 'checkSettings',
        dbInit: 'checkSettings'
    }
});