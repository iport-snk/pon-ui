Ext.define('PON.model.Client', {
    extend: 'Ext.data.Model',
    entityName: 'client',
    fields: [{
        name: "id"
    },{
        name: "contract"
    },{
        name: "address"
    }]
});