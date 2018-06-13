Ext.define('PON.view.PonGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pon-grid',


    draw: function (criterion) {
        let grid = this.getView();

        grid.setMasked({ xtype: 'loadmask', message: 'Загрузка' });
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.GRID);

        this.lookup('grid-header').setTitle(criterion.title);

        PON.app.db.query(criterion.query, {
            startkey: `${criterion.id}`,
            endkey: `${criterion.id}${PON.app.MATCHER}`
        }).then( result => {
            grid.setStore(Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'street'}, {name: 'house'}, {name: 'active'},
                    {name: 'sfp'},
                    {name: 'port', type: 'number'},
                    {name: 'power', type: 'number'},
                    {name: 'contract'}
                ],
                data: result.rows.map( row => {
                    let port = row.value.sfp.split('.');

                    row.value.port = port[1];
                    row.value.sfp = port[0];
                    row.value.id = row.value._id;
                    return row.value
                })
            }));
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

    allowAction: function () {
        this.lookup('infoBtn').setDisabled(
            this.getView().getSelections().length === 0
        );
    }

});