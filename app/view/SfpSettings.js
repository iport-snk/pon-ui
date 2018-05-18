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
        displayField: 'name',
        valueField: 'name',
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
        displayField: 'name',
        valueField: 'name',
        queryMode: 'local',
        forceSelection: true,
        editable: false,
        listeners: {
            change: 'loadBranch'
        }
    }]
});