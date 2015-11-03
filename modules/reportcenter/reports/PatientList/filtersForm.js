/**
 * GaiaEHR (Electronic Health Records)
 * Copyright (C) 2015 TRA NextGen, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Filter available for the Patient List Report (Store)
 * @type {Ext.data.Store}
 */
var filtersStore = Ext.create('Ext.data.Store', {
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        }
    ],
    data : [
        {
            "id": 0,
            "value": 'provider',
            "name": 'Provider'
        },
        {
            "id": 1,
            "value": 'allergy',
            "name": 'Allergies'
        },
        {
            "id": 2,
            "value": 'problem',
            "name": 'Problems'
        },
        {
            "id": 3,
            "value": 'medication',
            "name": 'Medications'
        },
        {
            "id": 4,
            "value": 'encounter_begin_date',
            "name": 'Encounter Begin Date'
        },
        {
            "id": 5,
            "value": 'encounter_end_date',
            "name": 'Encounter End Date'
        }
    ]
});

/**
 * @type {Ext.data.Store}
 */
var filtersCollectedStore = Ext.create('Ext.data.Store', {
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'operator',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        }
    ],
    data: [],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    listeners:{
        update: function(store, record, operation, modifiedFieldNames, eOpts){
            filtersStore.removeAt(
                filtersStore.find('value', record.data.name)
            );
        }
    }
});

/**
 * Store of operators for the filter
 * @type {Ext.data.Store}
 */
var operatorsStore = Ext.create('Ext.data.Store', {
    fields: [
        'id',
        'operator',
        'operatorName'
    ],
    data : [
        {
            "id": 0,
            "operator": '=',
            "operatorName": _('equals')
        },
        {
            "id": 1,
            "operator": '>',
            "operatorName": _('greater_than')
        },
        {
            "id": 2,
            "operator": '<',
            "operatorName": _('less_than')
        },
        {
            "id": 3,
            "operator": '>=',
            "operatorName": _('greater_or_equal')
        },
        {
            "id": 4,
            "operator": '<=',
            "operatorName": _('less_or_equal')
        },
        {
            "id": 5,
            "operator": '<>',
            "operatorName": _('not_equal')
        }
    ]
});

/**
 * @type {Ext.grid.plugin.RowEditing}
 */
var rowEditor = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToEdit: 2,
    itemId: 'filterRowEditor'
});

Ext.define('Modules.reportcenter.reports.PatientList.filtersForm', {
    extend: 'Ext.grid.Panel',
    requires:[
        'Ext.form.field.Date',
        'App.ux.combo.ActiveProviders',
        'App.ux.combo.Allergies',
        'App.ux.LiveMedicationSearch',
        'App.ux.LiveSnomedProblemSearch'
    ],
    xtype: 'reportFilter',
    store: filtersCollectedStore,
    region: 'north',
    title: _('filters'),
    collapsible: true,
    border: true,
    selType: 'rowmodel',
    plugins: [
        rowEditor
    ],
    columns: [
        {
            text: _('filter'),
            sortable: false,
            dataIndex: 'name',
            hideable: false,
            width: 200,
            renderer: function(value){
                try {
                    switch(value){
                        case 'provider':
                            return 'Provider';
                        case 'allergy':
                            return 'Allergies';
                        case 'problem':
                            return 'Problems';
                        case 'medication':
                            return 'Medications';
                        case 'encounter_begin_date':
                            return 'Encounter Begin Date';
                        case 'encounter_end_date':
                            return 'Encounter End Date';
                    }
                } catch(err) {
                    return value;
                }
            },
            editor: {
                xtype: 'combo',
                name: 'name',
                store: filtersStore,
                displayField: 'name',
                valueField: 'value',
                editable: false,
                listeners:{
                    select: function(records, eOpts ){
                        var Grid = Ext.ComponentQuery.query('reportFilter')[0],
                            ValueColumn = Grid.columns[2];
                        switch(records.value) {
                            case 'provider':
                                ValueColumn.setEditor({
                                    xtype: 'activeproviderscombo',
                                    name: 'value',
                                    allowBlank: false,
                                    flex: 1,
                                    displayField: 'option_name',
                                    valueField: 'id'
                                });
                                break;
                            case 'allergy':
                                ValueColumn.setEditor({
                                    xtype: 'allergieslivesearch',
                                    itemId: 'allergySearchCombo',
                                    name: 'value',
                                    enableKeyEvents: true,
                                    flex: 1,
                                    allowBlank: false
                                });
                                break;
                            case 'problem':
                                ValueColumn.setEditor({
                                    xtype: 'snomedliveproblemsearch',
                                    itemId: 'problemSearchCombo',
                                    name: 'value',
                                    enableKeyEvents: true,
                                    flex: 1,
                                    allowBlank: false
                                });
                                break;
                            case 'medication':
                                ValueColumn.setEditor({
                                    xtype: 'medicationlivetsearch',
                                    itemId: 'medicationSearchCombo',
                                    name: 'value',
                                    enableKeyEvents: true,
                                    flex: 1,
                                    allowBlank: false
                                });
                                break;
                            case 'encounter_begin_date':
                                ValueColumn.setEditor({
                                    xtype: 'datefield',
                                    name: 'value',
                                    flex: 1,
                                    allowBlank: false,
                                    format: g('date_display_format'),
                                    submitFormat: 'Y-m-d'
                                });
                                break;
                            case 'encounter_end_date':
                                ValueColumn.setEditor({
                                    xtype: 'datefield',
                                    name: 'value',
                                    flex: 1,
                                    allowBlank: false,
                                    format: g('date_display_format'),
                                    submitFormat: 'Y-m-d'
                                });
                                break;
                        }
                    }
                }
            }
        },
        {
            text: _('operator'),
            sortable: false,
            dataIndex: 'operator',
            hideable: false,
            width: 120,
            renderer: function(value) {
                try {
                    return operatorsStore.findRecord('operator', value).get('operatorName');
                } catch(err) {
                    return value;
                }
            },
            editor: {
                xtype: 'combo',
                name: 'operator',
                store: operatorsStore,
                displayField: 'operatorName',
                valueField: 'operator',
                editable: false
            }
        },
        {
            text: _('value'),
            sortable: false,
            hideable: false,
            dataIndex: 'value',
            flex: 1,
            renderer: function(value){
                //var record = operatorsStore.getAt(
                //    operatorsStore.find('operator', value)
                //);
                return value;
            }
        }
    ],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            '->',
            {
                xtype: 'button',
                text: _('add_filter'),
                listeners:{
                    click: function(e, eOpts){
                        rowEditor.cancelEdit();
                        filtersCollectedStore.commitChanges();
                        filtersCollectedStore.add({
                            "filter":"",
                            "operator":"",
                            "value":""
                        });
                        rowEditor.startEdit(filtersCollectedStore.getCount()-1, 0);
                    }
                }
            },
            '-',
            {
                xtype: 'button',
                text: _('remove_filter'),
                listeners:{
                    click: function(e, eOpts){
                        var Grid = Ext.ComponentQuery.query('reportFilter')[0],
                            Selection = Grid.getSelectionModel().getSelection();
                        rowEditor.cancelEdit();
                        filtersCollectedStore.remove(Selection);
                        filtersCollectedStore.commitChanges();
                        // Add the filter back to the filtersStore
                        switch(Selection[0].data.name){
                            case 'provider':
                                filtersStore.add({
                                    "id": 0,
                                    "value": 'provider',
                                    "name": 'Provider'
                                });
                                break;
                            case 'allergy':
                                filtersStore.add({
                                    "id": 1,
                                    "value": 'allergy',
                                    "name": 'Allergies'
                                });
                                break;
                            case 'problem':
                                filtersStore.add({
                                    "id": 2,
                                    "value": 'problem',
                                    "name": 'Problems'
                                });
                                break;
                            case 'medication':
                                filtersStore.add({
                                    "id": 3,
                                    "value": 'medication',
                                    "name": 'Medications'
                                });
                                break;
                            case 'encounter_begin_date':
                                filtersStore.add({
                                    "id": 4,
                                    "value": 'encounter_begin_date',
                                    "name": 'Encounter Begin Date'
                                });
                                break;
                            case 'encounter_end_date':
                                filtersStore.add({
                                    "id": 5,
                                    "value": 'encounter_end_date',
                                    "name": 'Encounter End Date'
                                });
                                break;
                        }
                    }
                }
            }
        ]
    }],

    filterData: function(filter){
        var data = [{
            "id": 0,
            "value": 'provider',
            "name": 'Provider'
        },
        {
            "id": 1,
            "value": 'allergy',
            "name": 'Allergies'
        },
        {
            "id": 2,
            "value": 'problem',
            "name": 'Problems'
        },
        {
            "id": 3,
            "value": 'medication',
            "name": 'Medications'
        },
        {
            "id": 4,
            "value": 'encounter_begin_date',
            "name": 'Encounter Begin Date'
        },
        {
            "id": 5,
            "value": 'encounter_end_date',
            "name": 'Encounter End Date'
        }];

        if(filter)
        {
            return data.filter(function(o){return o.value == value;});
        }
        else
        {
            return data;
        }
    }

});