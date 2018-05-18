Ext.define('PON.view.BoxSettingsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.box-settings',

    stores: {
        couplers: {
            fields: [{
                name: 'name',
            }],
            data: [
                {name: '50/50'},
                {name: '70/30'},
                {name: '80/20'},
                {name: '90/10'},
                {name: '95/5'},
            ],
            autoLoad: false
        },
        splitters: {
            fields: [{
                name: 'name',
            }],
            data: [
                {name: '1/2'},
                {name: '1/4'},
                {name: '1/6'}
            ],
            autoLoad: false
        }
    }
});