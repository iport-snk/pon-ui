Ext.define('PON.view.PonTree', {
    extend: 'Ext.grid.Tree',
    xtype: 'pon-tree',
    requires: [
        'PON.view.PonTreeController'
    ],
    controller: 'pon-tree',
    rootVisible: false,
    rowLines: true,
    title: '',
    hideHeaders: true,
    columns: [{
        xtype: 'treecolumn',
        text: 'Name',
        dataIndex: 'text',
        flex: 1,
        renderer: function(v, record) {
            let name = '';

            if (record.data.type === "box") {
                name = `${record.data.coupler} ${record.data.branch ?  ' - ' + record.data.branch : ''} : ${record.data.splitter}`;
                record.data.iconCls = "x-fa fa-sitemap";
            } else if (record.data.type === "group") {
                name = `Распределение`;
                record.data.iconCls = "x-fa fa-users";
            } else if (record.data.type === "client") {
                record.data.iconCls = "x-fa fa-user";
                record.data.leaf = true;

                name = PON.app.formatAddress(record.data);

            } else if (record.data.type === "sfp") {
                record.data.iconCls = "x-fa fa-podcast";
                name = record.data.district + " : SFP." + record.data.port;
            }

            return name;
        }
    }, {
        width: 70,
        text: 'dB',
        dataIndex: 'power'
    }],
    items: [{
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back'
        }, '->', {
            reference: 'addBoxBtn',
            iconCls: 'x-fa fa-sitemap',
            handler: 'addBox'
        }, {
            reference: 'addBranchBtn',
            iconCls: 'x-fa fa-share-alt',
            handler: 'addBranch'
        },{
            reference: 'addCustomerBtn',
            iconCls: 'x-fa fa-user',
            handler: 'addCustomer'
        }, {
            xtype: 'spacer'
        }, {
            reference: 'moveUp',
            iconCls: 'x-fa fa-arrow-up',
            handler: 'moveUp'
        },{
            reference: 'moveDown',
            iconCls: 'x-fa fa-arrow-down',
            handler: 'moveDown'
        },{
            reference: 'unbind',
            iconCls: 'x-fa fa-trash',
            handler: 'unbind'
        },{
            xtype: 'spacer'
        }, {
            reference: 'editBtn',
            iconCls: 'x-fa fa-edit',
            handler: 'edit'
        }]
    }],
    listeners: {
        //storedatachanged: 'datachanged',
        select: 'selected',
        deselect: 'setItemActions',
        storechange: 'setItemActions'
    }
});