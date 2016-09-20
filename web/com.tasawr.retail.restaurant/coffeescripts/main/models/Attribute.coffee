class Attribute extends OB.Data.ExtensibleModel
	modelName: "Attribute"
	tableName: "m_attribute"
	entityName: "Attribute"
	source: "org.openbravo.model.common.plm.Attribute"
	dataLimit: 300

Attribute.addProperties [
	{
		name: "id"
		column: "m_attribute_id"
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
		name: "mandatory"
		column: "ismandatory"
		type: "TEXT"
	}
	{
		name: "instanceAttribute"
		column: "isinstanceattribute"
		type: "TEXT"
	}
	{
		name: "list"
		column: "islist"
		type: "TEXT"
	}
	{
		name: '_identifier'
		column: '_identifier'
		filter: true
		type: 'TEXT'
	}
]


OB.Data.Registry.registerModel Attribute