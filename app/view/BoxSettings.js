Ext.define('PON.view.BoxSettings', {
    extend: 'Ext.form.Panel',
    requires: [
        'PON.view.BoxSettingsController',
        'PON.view.BoxSettingsModel'
    ],
    viewModel: {
        type: 'box-settings'
    },
    controller: 'box-settings',
    xtype: 'box-settings',
    trackResetOnLoad: true,
    //bodyPadding: 20,
    scrollable: 'y',
    items: [{
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            reference: 'back-button',
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back'
        }, '->' , {
            reference: 'save-button',
            iconCls: 'x-fa fa-save',
            handler: 'save'
        }]
    }, {
        xtype: 'textfield',
        label: 'Координаты',
        reference: 'address',
        name: 'address',
        editable: false,
        triggers: {
            location: {
                iconCls: 'x-fa fa-refresh',
                handler: 'getLocation'
            },
        },
        //labelAlign: 'left',
        required: true
    }, {
        xtype: 'combobox',
        reference: 'coupler',
        name: 'coupler',
        bind: {
            store: '{couplers}'
        },
        label: 'Каплер - 1',
        labelAlign: 'left',
        displayField: 'name',
        valueField: 'name',
        queryMode: 'local',
        forceSelection: true,
        editable: false
    }, {
        xtype: 'combobox',
        reference: 'branch',
        name: 'branch',
        bind: {
            store: '{couplers}'
        },
        label: 'Каплер - 2',
        labelAlign: 'left',
        displayField: 'name',
        valueField: 'name',
        queryMode: 'local',
        forceSelection: true,
        editable: false
    }, {
        xtype: 'combobox',
        reference: 'splitter',
        name: 'splitter',
        bind: {
            store: '{splitters}'
        },
        label: 'Сплитер',
        labelAlign: 'left',
        displayField: 'name',
        valueField: 'name',
        queryMode: 'local',
        forceSelection: true,
        editable: false
    }],
    listeners: {
        setAction: 'setAction'
    }
});