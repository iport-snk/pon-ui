Ext.define('PON.utils.DB', {
    alias: 'utils.db',

    statics: {
        remote: 'http://91.226.253.11:5984/pon',
        local: 'pon',
        init: function () {
            let db = new PouchDB(PON.utils.DB.local);

            db.putOnus = this.putOnus.bind(db);
            db.replicateFrom = this.replicateFrom.bind(db);
            db.refreshSignals = this.refreshSignals.bind(db);
            db.syncOn = this.syncOn.bind(db);

            return db;
        },

        syncOn: function () {
            let sync = PouchDB.sync(PON.utils.DB.local, PON.utils.DB.remote, {
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

        replicateFrom: function () {
            let db = this;

            return new Promise( (resolve, reject) => {
                db.replicate.from(PON.utils.DB.remote)
                    .on('complete', info => resolve (info))
                    .on('error', error => reject(error));
            } )
         },

        deleteOnus: function () {
            PON.app.db.query((doc, emit) => {
                if (doc.type === 'client') {
                    emit('deleted ', doc._id);
                    PON.app.db.remove(doc)
                }
            });
        },

        refreshSignals: function () {
            return new Promise( (resolve, reject) => {
                $.get('http://stat.fun.co.ua/geocode.php', {
                    action: 'getPonSignals'
                }).done( data => {
                    PON.app.db.putOnus(data, {resolve: resolve, reject: reject});

                });
            })

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

            db.replicate.to(PON.utils.DB.remote).on('complete', info => deferred.resolve(info))

        },
    }

});