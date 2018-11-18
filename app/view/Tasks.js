Ext.define('PON.view.Tasks', {
    extend: 'Ext.grid.Grid',
    xtype: 'tasks',
    requires: [
        'PON.view.TasksController',
        'PON.view.TasksModel'
    ],
    controller: 'tasks',
    variableHeights: true,
    viewModel: {
        type: 'tasks'
    },
    bind: '{issues}',
    itemConfig: {
        collapsed: false,
        body: {
            tpl: '<span>{summary}</span>'
        }
    },
    listeners: {
        painted: 'draw',
        storechange: 'storechange'
    },
    items: [{
        reference: 'grid-header',
        xtype: 'toolbar',
        docked: 'top',
        title: '',
        titleAlign: 'center',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back',
            align: 'left'
        },{
            xtype: 'spacer'
        }, {
            bind: '{caption}',
            xtype: 'button',
            reference: 'panelTitle',

            menu: {
                listeners: {
                    activeItemchange: 'activeItemchange'
                },
                bind: {
                    groups: '{menuGroups}'
                },
                items: [{
                    text: 'План',
                    value: '10000',
                    checked: true,
                    xtype: 'menuradioitem',
                    group: 'option',

                }, {
                    text: 'В работе',
                    value: '3',
                    xtype: 'menuradioitem',
                    group: 'option'
                }, {
                    text: 'Выполнено',
                    value: '10001',
                    xtype: 'menuradioitem',
                    group: 'option'
                }, {
                    text:'MY',
                    value: '{"property":"assigneeKey", "value":"pv"}',
                    xtype:'menucheckitem',
                    separator: true,
                    listeners: {
                        checkchange: 'filterChecked2'
                    }
                }]
            }
        },{
            xtype: 'spacer'
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-refresh',
            handler: 'refresh',
            iconAlign: 'right'
        }]
    }],

    columns: [{
        text: 'Task',
        flex: 1,
        dataIndex: 'key',
        cell: {
            encodeHtml: false
        },
        renderer: function (val, record, index) {
            let icon = record.get('issuetypeIcon'),
                labels = record.get('labels').map( _ => ' [' + _ + '] ');

            return `<span style = "background: url('${icon}') left no-repeat; padding-left: 20px;">${val} : ${labels}</span>`
        }
    }, {
        text: 'duedate',
        dataIndex: 'duedate',
        width: 80,
        align: 'right',
        cell: {
            encodeHtml: false
        },
        renderer: function (val, record, index) {
            let icon = record.get('priorityIcon'),
                due = (val || "--").split('-');

            return `<span style = "background: url('${icon}') right no-repeat; padding-right: 20px;">${due[1]}-${due[2]}</span>`
        }
    },
       /* {
        text: '% Change',
        width: 100,
        dataIndex: 'pctChange',
        renderer: 'renderPercent',
        cell: {
            encodeHtml: false
        }
    }, {
        text: 'Last Updated',
        width: 125,
        dataIndex: 'lastChange',
        formatter: 'date("m/d/Y")'
    }*/
    ]
});