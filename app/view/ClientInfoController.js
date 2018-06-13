Ext.define('PON.view.ClientInfoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.client-info',

    snmpApi: 'http://df.fun.co.ua/snmp.php',
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

    setProps: function (info) {
        let street = info.get('street');

        this.lookup('titlebar').setTitle(PON.app.formatMac(this.info.onu));

        let data = [
            {prop: 'dB', val: `${info.get('power')} / ${info.get('time')}`}
        ];

        if (!Ext.isEmpty(street)) {
            data.push({
                prop: 'Адрес', val: street + ' ,' + info.get('house')
            },{
                prop: 'Договор', val: info.get('contract'),
            })
        }

        PON.app.db.get('o.' + this.info.olt).then( olt => {
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

        let mac = PON.app.formatMac(this.info.onu),
            sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

        let iface = await fetch(`${this.snmpApi}?action=ifByMac&olt=${this.info.olt}&onu=${mac}`).then(r => r.json());

        while (this.keepRunning) {
            let signal = await fetch(
                `${this.snmpApi}?action=rxByIf&olt=${this.info.olt}&if=${iface.if}`
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
        } else {
            this.lookup('rx-refresher').setIconCls('x-fa fa-refresh')
        }
    },

    setAction: function (context) {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.CLIENT_INFO);
        this.onSaveFunction = context.cb;

        if (context) {

            this.info = {
                onu: context.info.get('id').split('.')[1],
                olt: context.info.get('sfp')
            };

            this.gettingBackCardId = context.gettingBackCardId;
            this.loadData();
            this.setProps(context.info);
            //this.getView().setValues(context.client);
        }
    }
});