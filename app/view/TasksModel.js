Ext.define('PON.view.TasksModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tasks',
    data: {
        menuGroups: {
            option: '10000'
        },
        /* {
                issuetypeId:[10002,10101,10100,10004],
                assigneeKey :["pv"]
            } */
        userFilters: '{}'
    },
    stores: {
        issues: {
            proxy: {
                type: 'ajax',
                url: 'http://localhost:3000/issues'
            },
            autoLoad: false,
            filters:  '{filters}',
            fields: [
                {name: 'key'},
                {name: 'summary'},
                {name: 'priority'},
                {name: 'priorityIcon'},
                {name: 'priorityId', type: 'number'},
                {name: 'status'},
                {name: 'statusId', type: 'number'},
                {name: 'status'},
                {name: 'created'},
                {name: 'description'},
                {name: 'issuetypeId', type: 'number'},
                {name: 'issuetype'},
                {name: 'issuetypeIcon'},
                {name: 'duedate'},
                {name: 'assigneeKey'},
                {name: 'assignee'},
                {name: 'labels'},
                {name: 'avatar'},
                {name: 'contractType'}
            ]
        }
    },
    buildUserFilters: function (jsonRules) {
        let rules = JSON.parse(jsonRules),
            keys = Object.keys(rules);

        return [ item => {
            if (keys.length === 0) return true;

            let result = {};

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                result[key] = rules[key].length === 0 || rules[key].includes(item.data[key]);
            }

            return Object.values(result).reduce( (a, c) => a && c);
        }]
    },
    formulas: {
        caption: function (getter) {
            let states = {
                '10000': 'ПЛАН',
                '3': 'В РАБОТЕ',
                '10001': 'ВЫПОЛНЕНО'
            };
            return states[getter('menuGroups.option')];
        },
        filters : {
            get: function (get) {
                let userFilters = this.buildUserFilters(get('userFilters')),
                    statusId = parseInt(get('menuGroups.option')),
                    grid = Ext.ComponentQuery.query('tasks')[0],
                    filters = userFilters.concat([{
                        property: 'statusId',
                        value: statusId
                    }]);

                if (grid.store) grid.store.clearFilter();

                return  filters ;
            },
            /*set: function (value) {
                this.set({userFilters: value})
            }*/
        }
    }
});