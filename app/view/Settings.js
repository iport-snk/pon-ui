Ext.define('PON.view.Settings', {
    extend: 'Ext.form.Panel',
    xtype: 'settings',
    requires: [ 'PON.view.SettingsController' ],
    controller: 'settings',
    items: [{
        reference: 'settings-header',
        xtype: 'titlebar',
        docked: 'top',
        title: 'Настройки',
        titleAlign: 'center',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: () => Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.MAIN),
            align: 'left'
        }, {
            reference: 'deleteDbBtn',
            iconCls: 'x-fa fa-trash',
            handler: 'deleteDb',
            align: 'right'
        }, {
            reference: 'reloadBtn',
            iconCls: 'x-fa fa-refresh',
            handler: 'sync',
            align: 'right'
        }, {
            reference: 'saveBtn',
            iconCls: 'x-fa fa-save',
            handler: 'save',
            align: 'right'
        }]
    },{
        xtype: 'textfield',
        reference: 'url',
        label: 'DB URL',
        placeholder: 'http://',
        required: true,
        clearable: true
    },{
        xtype: 'textfield',
        reference: 'jiraLogin',
        label: 'Jira Login',
        placeholder: 'Login',
        required: true,
        clearable: true
    },{
        xtype: 'passwordfield',
        reference: 'jiraPassword',
        label: 'Jira Password',
        placeholder: 'Password',
        required: true,
        clearable: true
    }],
    listeners: {
        show: 'onShow'
    }
});