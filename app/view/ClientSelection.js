Ext.define('PON.view.ClientSelection', {
    extend: 'Ext.form.Panel',
    requires: [
        'PON.view.ClientSelectionController'
    ],
    controller: 'client-selection',
    xtype: 'client-selection',
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
        xtype: 'combobox',
        reference: 'address',
        name: 'address',
        label: 'Адрес',
        labelAlign: 'left',
        displayField: 'address',
        valueField: 'address',
        queryMode: 'local',
        forceSelection: true,
        editable: false
    }],
    listeners: {
        setAction: 'setAction'
    }
});