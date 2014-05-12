/**
 * GaiaEHR (Electronic Health Records)
 * Copyright (C) 2013 Certun, LLC.
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

Ext.define('App.model.patient.Allergies', {
	extend: 'Ext.data.Model',
	table: {
		name: 'patient_allergies',
		comment: 'Patient Allergies'
	},
	fields: [
		{
			name: 'id',
			type: 'int',
			comment: 'Patient Allergies ID'
		},
		{
			name: 'eid',
			type: 'int',
			index: true
		},
		{
			name: 'pid',
			type: 'int',
			index: true
		},
		{
			name: 'allergy',
			len: 80,
			type: 'string'
		},
		{
			name: 'allergy_type',
			type: 'string',
			len: 20
		},
		{
			name: 'allergy_code',
			type: 'string',
			len: 20,
			comment: 'RxNORM RXCUI code if food allergy'
		},
		{
			name: 'allergy_code_type',
			len: 20,
			type: 'string'
		},
		{
			name: 'location',
			len: 80,
			type: 'string'
		},
		{
			name: 'reaction',
			len: 80,
			type: 'string'
		},
		{
			name: 'severity',
			len: 80,
			type: 'string'
		},
		{
			name: 'begin_date',
			type: 'date',
			dataType: 'date',
			dateFormat: 'Y-m-d'
		},
		{
			name: 'end_date',
			type: 'date',
			dataType: 'date',
			dateFormat: 'Y-m-d'
		},
		{
			name: 'active',
			type: 'bool',
			store: false,
			convert: function(v, record){
				return record.data.end_date == '' || record.data.end_date == null;
			}
		},
		{
			name: 'created_uid',
			type: 'int'
		},
		{
			name: 'updated_uid',
			type: 'int'
		},
		{
			name: 'create_date',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s'
		},
		{
			name: 'update_date',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
		}
	],
	proxy: {
		type: 'direct',
		api: {
			read: 'Medical.getPatientAllergies',
			create: 'Medical.addPatientAllergies',
			update: 'Medical.updatePatientAllergies'
		}
	}
});