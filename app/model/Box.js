Ext.define('PON.model.Box', {
    extend: 'Ext.data.Model',
    entityName: 'box',
    fields: [{
        name: "id"
    },{
        name: "coupler"
    },{
        name: "splitter"
    },{
        name: "branch"
    },{
        name: "address"
    }]
});