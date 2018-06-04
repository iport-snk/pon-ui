Ext.define('PON.view.SfpSettings', {
    extend: 'Ext.form.Panel',
    requires: [
        'PON.view.SfpSettingsModel',
        'PON.view.SfpSettingsController'
    ],
    viewModel: {
        type: 'sfp-settings'
    },
    xtype: 'sfp-settings',
    controller: 'sfp-settings',
    trackResetOnLoad: true,
    tools: [{
        type: 'refresh',
        handler: 'refresh'
    }],
    //bodyPadding: 20,
    scrollable: 'y',
    items: [{
        xtype: 'combobox',
        reference: 'olt',
        name: 'olt',
        bind: {
            store: '{olts}'
        },
        label: 'ОЛТ',
        labelAlign: 'left',
        displayField: 'district',
        valueField: '_id',
        queryMode: 'local',
        forceSelection: true,
        editable: false,
        listeners: {
            change: 'filterPorts'
        }
    }, {
        xtype: 'combobox',
        reference: 'sfp',
        name: 'sfp',
        bind: {
            store: '{ports}'
        },
        label: 'ПОРТ',
        labelAlign: 'left',
        displayField: 'port',
        valueField: 'port',
        queryMode: 'local',
        forceSelection: true,
        editable: false,
        listeners: {
            change: 'setActionsEnabled'
        }
    }],
    tbar: [{
        text: 'Затухания',
        xtype: 'button',
        margin: '0 10',
        iconCls: 'x-fa fa-download',
        handler: 'loadOnus',
        minWidth: 85
    },{
        text: 'OLTs',
        xtype: 'button',
        margin: '0 10',
        iconCls: 'x-fa fa-download',
        handler: 'loadOlts',
        minWidth: 85
    }],
    bbar: [{
        xtype: 'spacer'
    },{
        reference: 'treeBtn',
        iconCls: 'x-fa fa-sitemap',
        handler: 'showTree',
        disabled: true
    },{
        xtype: 'spacer'
    },{
        reference: 'gridBtn',
        iconCls: 'x-fa fa-list',
        handler: 'showGrid',
        disabled: true
    }, {
        xtype: 'spacer'
    }],
    listeners: {
        setAction: 'setAction'
    }


});