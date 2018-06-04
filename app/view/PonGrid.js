Ext.define('PON.view.PonGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'pon-grid',
    requires: [
        'PON.view.PonGridController'
    ],
    controller: 'pon-grid',
    title: '',
    columns: [{
        text: 'Адрес',
        dataIndex: 'address',
        renderer: function (text, record) {
            if (Ext.isEmpty(record.get('street'))) {
                return record.get('id');
            } else {
                let street = record.get('street');

                if (street.indexOf('-') > -1) street = street.split("-")[1].trim();
                return `${street} , ${record.get('house')}`;
            }

        },
        flex: 1,
    },{
        text: 'Дог.',
        dataIndex: 'contract',
        width: 80
    }, {
        //xtype: 'numbercolumn',
        width: 80,
        text: 'dB',
        dataIndex: 'power',
        align: 'right',
        renderer: function (text, record, index, cell) {
            let cls = record.data.active ? 'green' : 'red';

            cell.addCls(cls);
            return Ext.util.Format.number(text, '0.0');
        }
    }],
    items: [{
        reference: 'grid-header',
        xtype: 'titlebar',
        docked: 'top',
        title: 'hello',
        titleAlign: 'center',
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            handler: 'back',
            align: 'left'
        },  {
            reference: 'infoBtn',
            iconCls: 'x-fa fa-info',
            disabled: true,
            handler: 'info',
            align: 'right'
        }]
    }],
    listeners: {
        select: 'allowAction',
        deselect: 'allowAction',
        //storechange: 'setItemActions'
        sfpchange: 'draw'
    }
});