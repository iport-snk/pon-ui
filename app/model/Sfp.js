Ext.define('PON.model.Sfp', {
    extend: 'Ext.data.Model',
    entityName: 'sfp',
    fields: [{
        name: "id"
    },{
        name: "olt"
    },{
        name: "port"
    },{
        name: "address"
    }]
});