Ext.define('PON.view.ClientInfoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.client-info',


    keepRunning: false,

    save: function() {
        let data = Ext.apply({
            type: 'client'
        }, this.getView().getValues());

        this.getView().reset();
        Ext.Viewport.setActiveItem(0);
        this.onSaveFunction(data);
    },

    back: function () {
        this.keepRunning = false;
        Ext.Viewport.setActiveItem(this.gettingBackCardId);
    },

    loadData: function () {
        let signals = this.lookup('signals');

        signals.setMasked({ xtype: 'loadmask', message: 'Загрузка' });
        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getSignalHistory',
            mac: this.info.onu
        }).done( data => {
            signals.setStore(Ext.create('Ext.data.Store', {
                fields: ['pwr', 'datetime'],
                data: data
            }));
            signals.setMasked(false);
        })
    },

    saveLocation: function (grid, e) {
        let pos = e.record.get('val').split('|')[1].trim();
        e.record.store.suspendEvents();
        e.record.set('val', pos);
        e.record.store.resumeEvents();
        e.record.commit();
        e.tool.hide();

        this.context.info.set('location', pos);

        PON.app.db.get(this.context.info.id).then( doc => {
            PON.app.db.put(Ext.apply(doc, {location: pos}));
        })
    },

    getLocation: async function (grid, e) {
        let position = this.context.info.get('location');

        if (Ext.isEmpty(position)) {
            position = await PON.app.getGps();
        } else {
            position = position.split(" ")
        }


        Ext.Viewport.down('pon-map').fireEvent('setAction', {
            title: this.lookup('titlebar').getTitle(),
            data: position,
            back: _ => Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.CLIENT_INFO),
            save: position => e.record.set({val: `точность: 1m | ${position[0]} ${position[1]}`}),
            cb: data => {

            }
        });


    },

    setProps: function (info) {
        let street = info.get('street');

        this.lookup('titlebar').setTitle(PON.app.formatMac(this.info.onu) + ' : ' + info.get('contract'));

        let data = [
            {prop: 'dB', val: `${info.get('power')} / ${info.get('time')}`},
            {prop: 'location', val: info.get('location')}
        ];

        if (!Ext.isEmpty(street)) {
            data.push({
                prop: 'Адрес', val: street + ' ,' + info.get('house')
            })
        }

        PON.app.db.get('o.' + this.info.sfp).then( olt => {
            data.push({
                prop: 'SFP',
                val: `${olt.district} / Порт:  ${info.get('port')}`
            });
            this.lookup('info').setStore(Ext.create('Ext.data.Store', {
                fields: ['prop', 'val'],
                data: data
            }));
        })
    },

    startRxRefreshing: async function () {
        let rxRecord = this.lookup('info').getStore().findRecord('prop', 'dB');

        //let mac = PON.app.formatMac(this.info.onu);
        let sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

        //let iface = await fetch(`${this.snmpApi}?action=ifByMac&olt=${this.info.olt}&onu=${mac}`).then(r => r.json());

        while (this.keepRunning) {
            let signal = await fetch(
                `${PON.app.settings.snmpApi}?action=rxByIf&olt=${this.info.olt}&if=${this.info.if}`
            ).then(r => r.json());

            rxRecord.set('val', `${signal.rx} / ${Ext.Date.format(new Date(), 'H:i:s')}`);
            await sleep(500);
        }
    },

    toggleRxRefreshing: function () {
        this.keepRunning = !this.keepRunning;
        if (this.keepRunning) {
            this.lookup('rx-refresher').setIconCls('x-fa fa-stop');
            this.startRxRefreshing();
            setTimeout( _ => {
                this.keepRunning = true;
                this.toggleRxRefreshing();
            }, 20000);
        } else {
            this.lookup('rx-refresher').setIconCls('x-fa fa-refresh')
        }
    },

    setAction: function (context) {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.CLIENT_INFO);
        this.onSaveFunction = context.cb;
        this.lookup('rx-refresher').setIconCls('x-fa fa-refresh');
        this.context = context;

        if (context) {
            this.info = {
                onu: context.info.get('id').split('.')[1],
                sfp: context.info.get('sfp'),
                olt: context.info.get('olt'),
                if: context.info.get('if')
            };

            this.gettingBackCardId = context.gettingBackCardId;
            this.loadData();
            this.setProps(context.info);
        }
    }
});