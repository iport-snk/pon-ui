Ext.define('PON.view.PromoInfo', {
    extend: 'Ext.form.Panel',
    xtype: 'promo-info',
    layout: {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start',
    },

    scrollable: 'y',
    autoSize: true,

    defaults: {
        labelAlign: 'placeholder',
        xtype: 'textfield'
    },

    items: [{
        label: 'Title'
    }, {
        label: 'Price'
    }, {
        label: 'Specific Location (optional)',
        value: 'KS'
    }, {
        xtype: 'textareafield',
        label: 'Description',
        flex: 1
    }]
});