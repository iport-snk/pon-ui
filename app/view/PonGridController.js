Ext.define('PON.view.PonGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pon-grid',


    draw: function (criterion) {
        let grid = this.getView(),
            title = this.lookup('grid-header');

        grid.setMasked({ xtype: 'loadmask', message: 'Загрузка' });
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.GRID);
        title.setTitle(criterion.title);

        PON.app.db.query(criterion.query, {
            startkey: `${criterion.id}`,
            endkey: `${criterion.id}${PON.app.MATCHER}`
        }).then( result => {
            grid.setStore(Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'street'}, {name: 'house'}, {name: 'active'},
                    {name: 'sfp'},
                    {name: 'if'},
                    {name: 'port', type: 'number'},
                    {name: 'power', type: 'number'},
                    {name: 'contract'},
                    {name: 'corp'}
                ],
                data: result.rows.map( row => {
                    let port = row.value.sfp.split('.'),
                        mac = row.id.split('.')[1],
                        signal = PON.app.signals.data[mac];

                    row.value.port = port[1];
                    row.value.sfp = port[0];
                    row.value.id = row.value._id;

                    Ext.apply(row.value, signal);

                    return row.value
                })
            }));
            title.setTitle(criterion.title + ` / ${result.rows.length}`);
            this.lookup('infoBtn').disable();
            grid.setMasked(false);
        });

    },

    back: function () {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.SFP_SELECTION);
    },

    info: function () {
        let grid = this.getView(),
            target = grid.getSelections()[0];

        Ext.Viewport.down('client-info').fireEvent('setAction', {
            info: target,
            gettingBackCardId: PON.app.CARD_INDEXES.GRID,
            cb: record => {
                //data.sfp  = this.getSfp();

            }
        })
    },

    reload: async function () {
        let grid = this.getView(),
            records = grid.getStore().getData().items,
            title = this.lookup('grid-header'),
            caption = title.getTitle();

        title.setTitle('Обновление ...');

        for (let i = 0; i < records.length; i++) {
            let signal = await fetch(
                    `${PON.app.settings.snmpApi}?action=rxByIf&olt=${records[i].get('olt')}&if=${records[i].get('if')}`
                ).then(r => r.json()),
                val;

            if (signal.rx === 'Offline') {
                val = {
                    active: false
                }
            } else {
                val = {
                    power: signal.rx,
                    active: true
                }
            }
            records[i].set(val);
            PON.app.db.get(records[i].get('id')).then ( doc => {
                PON.app.db.put(Ext.apply(doc, val));
            })
        }
        title.setTitle(caption);
    },

    allowAction: function () {
        this.lookup('infoBtn').setDisabled(
            this.getView().getSelections().length === 0
        );
    }

});