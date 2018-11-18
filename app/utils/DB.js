Ext.define('PON.utils.DB', {
    alias: 'utils.db',

    statics: {
        init: async function () {
            let settings = localStorage.getItem('PON.app.settings');
            if (settings) PON.app.settings = JSON.parse(settings);
            //if (!settings) throw 'need to set the DB url';
            //PON.app.settings = JSON.parse(settings);

            let db = PON.app.db = new PouchDB('network', {auto_compaction: true});

            db.putOnus = this.putOnus.bind(db);
            db.syncOn = this.syncOn.bind(db);
            db.syncOnce = this.syncOnce.bind(db);
            db.syncAll = this.syncAll.bind(db);

            PON.app.__signals = new PouchDB('signals', {auto_compaction: true});

            return PON.app.db.get('settings').then( settings => {
                Object.assign(PON.app.settings, settings);
                return PON.app.__signals.get('signals');
            }).then( signals => {
                PON.app.signals = signals
            });
        },

        isSynced: async function () {
            try {
                await PON.app.db.get('settings');
                return true;
            } catch (e) {
                return false;
            }

        },

        syncOn: function () {
            PouchDB.sync('network', `http://${PON.app.settings.url}/network`, {
                live: true,
                retry: true
            }).on('change', function (info) {
                console.log('DB change');
                console.log(info);
            }).on('paused', function (err) {
                console.log('DB paused');
            }).on('active', function () {
                console.log('DB active');
            }).on('denied', function (err) {
                console.log('DB denied');
                console.log(err);
            }).on('complete', function (info) {
                console.log('DB complete');
                console.log(info);
            }).on('error', function (err) {
                console.log('DB error');
                console.log(err);
            });
        },

        syncOnce: function () {
            return PouchDB.sync('network', `http://${PON.app.settings.url}/network`, {
                live: false,
                retry: true
            }).then(
                _ => PON.app.db.get('settings')
            ).then( settings => Object.assign(PON.app.settings, settings))
        },

        syncAll: async function () {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка: Клиентов' });
            await PON.app.db.syncOnce();
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка: Сигналов' });
            await PON.utils.DB.syncSignals();
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: Сигналов' });
        },

        updateSignals: function () {
            return new Promise( (resolve, reject) => {
                $.ajax({
                    url: PON.app.settings.signals,
                    dataType: "jsonp",
                    jsonpCallback: "ff",
                    success: signals =>  {
                        PON.app.__signals.destroy().then( _ => {
                            PON.app.__signals = new PouchDB('signals');
                            PON.app.signals = signals;

                            return PON.app.__signals.put(Object.assign({
                                _id : 'signals'
                            }, signals));
                        }).then( _ => resolve (signals))
                    }
                });
            })
        },

        syncSignals: function () {
            return PouchDB.replicate(
                `http://${PON.app.settings.url}/signals`, 'signals'
            ).then(
                _ => PON.app.__signals.get('signals')
            ).then(
                record => PON.app.signals = record
            );

        },

        deleteOnus: function () {
            PON.app.db.query((doc, emit) => {
                if (doc.type === 'client') {
                    emit('deleted ', doc._id);
                    PON.app.db.remove(doc)
                }
            });
        },

        // Клиенты индексируются по mac onu
        // Если при очередной синхронизации обнаружилось что клиента переключили на другую СФП необходимо
        //  - сохранить старое сфп
        //  - найти бокс по parentId и пометить его как измененный
        // Потом при отображении дерева такие боксы нужно  подсвечивать и придумать как разрешать кокфликт
        putOnus: function (data, deferred) {
            let db = this;

            data.forEach( async item => {
                //if (Ext.isEmpty(item.street)) console.warn('Empty address', item);


                let port = item.name.split('/')[1].split(':')[0],
                    mac = item.mac.replace(/:/g, '');

                let sfp = `${item.olt}.${port}`;

                let record = {
                    _id: `onu.${mac}`,
                    sfp: sfp,
                    type: 'client',
                    contract: item.contract,
                    power: item.pwr === 'Offline' ? item.last_pwr : item.pwr,
                    active: item.pwr !== 'Offline',
                    time: item.last_activity,
                    mid: item.mid,
                    street: item.street,
                    house: item.house
                };

                try {
                    let dr = await db.get(record._id);

                    if (dr.sfp !== record.sfp) record.dirty = dr.sfp;
                    db.put(Ext.apply(dr, record));
                } catch (err) {
                    db.put(record);
                }

            });

            db.replicate.to(`http://${PON.app.settings.url}/network`).on('complete', info => deferred.resolve(info))

        },
    }

});