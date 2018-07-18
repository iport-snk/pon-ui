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
                    `${PON.app.snmpApi}?action=rxByIf&olt=${records[i].get('olt')}&if=${records[i].get('if')}`
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

    reloadTelnet: function () {
        let grid = this.getView(),
            store = grid.getStore(),
            q = {
                ip: store.getAt(0).get('olt'),
                port: store.getAt(0).get('port')
            };

        grid.setMasked({ xtype: 'loadmask', message: 'Загрузка' });
        //fetch(`http://df.fun.co.ua/pon/getSnmp.php`).then( r => r.json() ).then( data => {
        fetch(`http://z.iport.net.ua:82/${q.ip}/${q.port}`).then( r => r.json() ).then( data => {
            let signals = data.signals;

            store.each( record => {
                let row = signals.find( signal => signal.num === record.get('num'));

                record.set(Ext.apply(row, {
                    active: true
                }))
            });
            grid.setMasked(false);
            console.log(data)
        })
       /* $.get('http://df.fun.co.ua/pon/getSnmp.php').done( data => {
           console.log(data)
        })*/
    },

    allowAction: function () {
        this.lookup('infoBtn').setDisabled(
            this.getView().getSelections().length === 0
        );
    }

});