Ext.define('PON.view.PonTree', {
    extend: 'Ext.grid.Tree',
    xtype: 'pon-tree',
    requires: [
        'PON.view.PonTreeController'
    ],
    controller: 'pon-tree',
    rootVisible: false,
    rowLines: true,
    hideHeaders: true,
    viewConfig: {
        plugins: {
            treeviewdragdrop: {
                containerScroll: true
            }
        }
    },
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
            } else if (record.data.type === "client") {
                record.data.iconCls = "x-fa fa-user";
                record.data.leaf = true;
                name = record.data.contract;
            } else if (record.data.type === "sfp") {
                record.data.iconCls = "x-fa fa-podcast";
                name = record.data.olt + " : SFP." + record.data.port;
            }

            return name;
        }
    }, {
        text: 'Улица',
        dataIndex: 'address'
    }],
    items: [{
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            reference: 'editBtn',
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
            xtype: 'spacer'
        }, {
            reference: 'editBtn',
            iconCls: 'x-fa fa-edit',
            handler: 'edit'
        }]
    }],
    listeners: {
        storedatachanged: 'datachanged'
    }

});