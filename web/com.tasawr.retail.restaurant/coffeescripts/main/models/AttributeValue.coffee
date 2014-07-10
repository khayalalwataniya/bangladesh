class AttributeValue extends OB.Data.ExtensibleModel
	modelName: "AttributeValue"
	tableName: "m_attributevalue"
	entityName: "AttributeValue"
	source: "org.openbravo.model.common.plm.AttributeValue"
	dataLimit: 300

AttributeValue.addProperties [
	{
		name: "id"
		column: "m_attributevalue_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "attribute"
		column: "m_attribute_id"
		type: "TEXT"
	}
	{
		name: "searchKey"
		column: "value"
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
		name: "tsrrAddprice"
		column: "em_tsrr_addprice"
		type: "TEXT"
	}
	{
		name: '_identifier'
		column: '_identifier'
		filter: true
		type: 'TEXT'
	}
]

OB.Data.Registry.registerModel AttributeValue