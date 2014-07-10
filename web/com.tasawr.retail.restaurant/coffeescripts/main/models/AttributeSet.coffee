class AttributeSet extends OB.Data.ExtensibleModel
	modelName: "AttributeSet"
	tableName: "m_attributeset"
	entityName: "AttributeSet"
	source: "org.openbravo.model.common.plm.AttributeSet"
	dataLimit: 300
	local: true

AttributeSet.addProperties [
	{
		name: "id"
		column: "m_attributeset_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "name"
		column: "name"
		type: "TEXT"
	}
	{
		name: "description"
		column: "description"
		type: "TEXT"
	}
	{
		name: "serialNo"
		column: "isserno"
		type: "TEXT"
	}
	{
		name: "serialNoControl"
		column: "m_sernoctl_id"
		type: "TEXT"
	}
	{
		name: "lot"
		column: "islot"
		type: "TEXT"
	}
	{
		name: "lotControl"
		column: "m_lotctl_id"
		type: "TEXT"
	}
	{
		name: "expirationDate"
		column: "isguaranteedate"
		type: "TEXT"
	}
	{
		name: "guaranteedDays"
		column: "guaranteedays"
		type: "TEXT"
	}
	{
		name: "lockedInWarehouse"
		column: "islockable"
		type: "TEXT"
	}
	{
		name: "requireAtLeastOneValue"
		column: "isoneattrsetvalrequired"
		type: "TEXT"
	}
	{
		name: '_identifier'
		column: '_identifier'
		filter: true
		type: 'TEXT'
	}
]

OB.Data.Registry.registerModel AttributeSet