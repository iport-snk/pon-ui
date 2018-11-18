Ext.define('PON.view.StartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.start',

    toggleTasks: function () {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.TASKS);
    },

    togglePonControl: function () {
        Ext.Viewport.down('sfp-settings').fireEvent('setAction');
    },

    checkSettings: async function () {
        let goTasks = this.lookup('goTasks'),
            goPon = this.lookup('goPon');

        let synced = await PON.utils.DB.isSynced();
        let enabled = (PON.app.hasOwnProperty('settings') && synced);

        goTasks.setDisabled(true);
        goPon.setDisabled(!enabled);
    }
});