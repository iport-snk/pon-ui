Ext.define('PON.view.Promo', {
    extend: 'Ext.form.Panel',
    xtype: 'promo',
    requires: [
        'PON.view.PromoModel',
        'PON.view.PromoController'
    ],
    viewModel: {
        type: 'promo'
    },
    controller: 'promo',
    items: [{
        xtype: 'toolbar',
        hidden: false,
        docked: 'top',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back',
            align: 'left'
        },{
            xtype: 'combobox',
            reference: 'districtsCombo',
            bind: {
                store: '{districts}'
            },
            margin: '0 0 0 20',
            //label: 'Село',
            labelWidth: 50,
            labelAlign: 'left',
            displayField: 'district',
            valueField: 'district',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            flex: 1
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-plus-square',
            //ui: 'raised',
            menu: [{
                text: 'Реклама',
                handler: 'goNewAd'
            },{
                text: 'Абонент конкурентов',
                handler: 'goNewComp'
            }],

        }]
    },{
        xtype: 'textfield',
        reference: 'url',
        label: 'DB URL',
        placeholder: 'http://',
        required: true,
        clearable: true
    }],

    listeners: {
        setAction: 'setAction'
    }
});