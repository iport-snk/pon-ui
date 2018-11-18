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
    /*tools: [{
        type: 'refresh',
        handler: 'refresh'
    }],*/
    //bodyPadding: 20,
    scrollable: 'y',
    items: [{
        xtype: 'toolbar',
        hidden: false,
        docked: 'top',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back',
            align: 'left'
        },{
            xtype: 'spacer'
        },{
            text: 'Статистика не загружена',
            disabled: true,
            reference: 'syncSignalsBtn',
            xtype: 'button',
            //margin: '0 10',
            iconCls: 'x-fa fa-download',
            handler: 'loadSignals',
            iconAlign: 'right',
            minWidth: 85
        }]
    },{
        //xtype: 'toolbar',
        //docked: 'top',
        flex: 1,
        layout: 'vbox',
        shadow: 'true',

        items: [{
            xtype: 'searchfield',
            reference: 'search',
            placeholder: 'Номер договора',
            ui: 'solo',
            listeners: {
                buffer: 500,
                change: 'doSearch'
            }
        },{
            xtype: 'list',
            reference: 'contracts',
            flex: 1,
            store: Ext.create('Ext.data.Store', {
                fields: ['contract', 'author', 'title']
            }),
            itemTpl: '<span style = "float: left; width: 60px;">{contract}</span><span style = "float: left;"> {street} , {house}</span></span>',
            listeners: {
                select: 'selectContract'
            }
        }]
    },{
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            xtype: 'togglefield',
            reference: 'searchBy',
            boxLabel: 'По адресу',
            margin: null,
            padding: '0 10',
            listeners: {
                change: 'toggleFilter'
            }

        },{
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
    },{
        xtype: 'toolbar',
        docked: 'bottom',
        reference: 'filter-by-olt',
        items: [{
            xtype: 'combobox',
            reference: 'olt',
            margin: '0 20 0 0',
            name: 'olt',
            bind: {
                store: '{olts}'
            },
            label: 'ОЛТ',
            //labelAlign: 'top',
            displayField: 'district',
            valueField: '_id',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            flex: 1,
            listeners: {
                change: 'filterPorts'
            }
        },{
            xtype: 'combobox',
            reference: 'sfp',
            name: 'sfp',
            bind: {
                store: '{ports}'
            },
            label: 'ПОРТ',
            //labelAlign: 'left',
            displayField: 'port',
            valueField: 'port',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            clearable: true,
            width: 80
        },]
    },{
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        reference: 'filter-by-address',
        items: [{
            xtype: 'combobox',
            reference: 'districtsCombo',
            margin: '0 20 0 0',
            //name: 'olt',
            bind: {
                store: '{districts}'
            },
            label: 'Село',
            //labelAlign: 'top',
            displayField: 'district',
            valueField: 'district',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            flex: 1,
            listeners: {
                change: 'filterStreets'
            }
        },{
            xtype: 'combobox',
            reference: 'streetsCombo',
            bind: {
                store: '{streets}'
            },
            label: 'Улица',
            //labelAlign: 'left',
            displayField: 'street',
            valueField: 'key',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            clearable: true,
            flex: 1
        },]
    }],

    listeners: {
        setAction: 'setAction'
    }


});