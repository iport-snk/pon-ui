Ext.define('PON.view.TasksController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tasks',
    init:  function (view) {
        let filters = [{
            text:'111',
            xtype:'menucheckitem',
            separator: true,
            bind: {
                checked: '{filter1}'
            }
        },{
            text:'222',
            xtype: 'menucheckitem',
            bind: {
                checked: '{filter2}'
            }
        }];
        //let tasks = await fetch('http://localhost:3000/statuses').then( _ => _.json());

        //this.lookup('panelTitle').getMenu().removeAll();
        /*this.lookup('panelTitle').getMenu().add(tasks.map( (task, o) => {
            let ch = (o == 0);
            return {
                text: task.name,
                value: task.value,
                xtype: 'menuradioitem',
                group: 'option',
                checked: ch
            }
        }))*/


    },

    storechange: function (grid, store) {
        store.on('load', this.buildFilters, this);
    },

    buildFilters: function (store) {
        let types = [],
            menu = this.lookup('panelTitle').getMenu();

        store.getData().getSource().items.forEach( item => {
            if (!types.find( _ => _.value === item.data.issuetypeId)) {
                types.push({
                    value: item.data.issuetypeId,
                    text: item.data.issuetype
                })
            }
        });

        let filters = types.map( config => ({
            xtype: 'menucheckitem',
            cls: 'dynamic',
            text: config.text,
            value: JSON.stringify( { property: 'issuetypeId', value: config.value} ),
            listeners: {
                checkchange: 'filterChecked2'
            }
        }));
        filters[0].separator = true;

        menu.query('[cls="dynamic"]').forEach( item => menu.remove(item, true));
        menu.add(filters);

    },

    draw: async function () {
        let model = this.getViewModel();
        model.data.issues.load();
    },

    back: function () {
        Ext.Viewport.setActiveItem(PON.app.CARD_INDEXES.MAIN);
    },

    filterChecked2: function (component, checked) {
        let model = this.getViewModel(),
            filter = JSON.parse(component.getValue()),
            userFilters = JSON.parse(model.data.userFilters);

        if (!userFilters.hasOwnProperty(filter.property)) userFilters[filter.property] = [];


        if (checked) {
            userFilters[filter.property].push(filter.value);
        } else {
            userFilters[filter.property] = userFilters[filter.property].filter( _ => _ !== filter.value);
        }

        model.set('userFilters',  JSON.stringify(userFilters));
    },

    refresh: function () {},

    activeItemchange: function () {}
});