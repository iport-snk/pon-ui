Ext.define('PON.view.PonGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pon-grid',

    sfp: {},

    draw: function (sfp) {
        let grid = this.getView();

        grid.setMasked({ xtype: 'loadmask', message: 'Загрузка' });

        this.sfp = sfp;
        this.lookup('grid-header').setTitle(`${sfp.district} : ${sfp.port}`);

        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.GRID);
        PON.app.db.query('clients', {
            startkey: `${sfp.id}`,
            endkey: `${sfp.id}`
        }).then( result => {
            grid.setStore(Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'street'}, {name: 'house'}, {name: 'active'},
                    {name: 'power', type: 'number'},
                    {name: 'contract'}
                ],
                data: result.rows.map( row => {
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
            info: {
                client: target,
                sfp: this.sfp
            },
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