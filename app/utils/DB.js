Ext.define('PON.utils.DB', {
    alias: 'utils.db',
    statics: {
        init: function () {
            let db = new PouchDB('pon');

            let sync = PouchDB.sync('pon', 'http://localhost:5984/pon', {
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

            return db;
        }
    }

});