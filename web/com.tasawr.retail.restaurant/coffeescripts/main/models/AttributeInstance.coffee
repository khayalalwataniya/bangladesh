class AttributeInstance extends OB.Data.ExtensibleModel
	modelName: "AttributeInstance"
	tableName: "m_attributeinstance"
	entityName: "AttributeInstance"
	source: "org.openbravo.model.common.plm.AttributeInstance"
	dataLimit: 300


AttributeInstance.addProperties [
	{
		name: "id"
		column: "m_attributeinstance_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "attributeSetValue"
		column: "m_attributesetinstance_id"
		type: "TEXT"
	}
	{
		name: "attribute"
		column: "m_attribute_id"
		type: "TEXT"
	}
	{
		name: "attributeValue"
		column: "m_attributevalue_id"
		type: "TEXT"
	}
	{
		name: "searchKey"
		column: "value"
		type: "TEXT"
	}
	{
		name: '_identifier'
		column: '_identifier'
		filter: true
		type: 'TEXT'
	}
]

OB.Data.Registry.registerModel AttributeInstance