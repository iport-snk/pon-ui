Ext.define('PON.view.SettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',

    sync: function() {
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка' });

        PON.utils.DB.syncAll().then( info => {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: Договоров' });
            return PON.app.db.query('contracts', { startkey: '111.111' , endkey: '111.111' });
        }).then( _ => {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: Улиц' });
            return PON.app.db.query('streets', { startkey: '' , endkey: '' });
        }).then( _ => {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: SFP' });
            return PON.app.db.query('clients', { startkey: '' , endkey: '' });
        }).then( _ => {
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Индексирование: Боксов' });
            return PON.app.db.query('boxes', { startkey: '' , endkey: '' });
        }).then( _ => {
            this.setTitle();
            Ext.Viewport.setMasked(false);
        }).catch( error => {
            console.warn(error);
        });
    },

    setTitle: function () {
        let title = 'Статистика не загружена';

        if (PON.app.signals) {
            let date = PON.app.signals.time.split(':');

            title = `${date[0]}:${date[1]}`;
        }

        this.lookup('settings-header').setTitle(title);
    },

    onShow: function () {
        this.setTitle();
        if (PON.app.settings) {
            this.lookup('url').setValue(PON.app.settings.url);
            this.lookup('jiraLogin').setValue(PON.app.settings.jiraLogin);
            this.lookup('jiraPassword').setValue(PON.app.settings.jiraPassword);
        }
    },

    save: function () {
        PON.app.settings = {
            url: this.lookup('url').getValue(),
            jiraLogin: this.lookup('jiraLogin').getValue(),
            jiraPassword: this.lookup('jiraPassword').getValue()
        };
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Сохранение' });
        fetch("http://" + PON.app.settings.url).then( _ => _.json()).then( r => {

        }).catch(
            e => Ext.Msg.alert('Не верный адрес', "http://" + PON.app.settings.url, Ext.emptyFn)
        ).finally( _ => Ext.Viewport.setMasked(false));

        localStorage.setItem('PON.app.settings', JSON.stringify(PON.app.settings));

    },

    deleteDb: function () {
        Ext.Msg.confirm(
            'Подтвердите удаление данных из телефона', '<b>Продолжить</b>?',
            answer => {
                Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Удаление' });
                PON.utils.DB.recreate().then( _ => {
                    this.setTitle();
                    Ext.Viewport.setMasked(false);
                });
            }
        );
    }
});