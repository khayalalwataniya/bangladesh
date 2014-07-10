class AttributeUse extends OB.Data.ExtensibleModel
	modelName: "AttributeUse"
	tableName: "m_attributeuse"
	entityName: "AttributeUse"
	source: "org.openbravo.model.common.plm.AttributeUse"
	dataLimit: 300

AttributeUse.addProperties [
	{
		name: "id"
		column: "m_attributeuse_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "attribute"
		column: "m_attribute_id"
		type: "TEXT"
	}
	{
		name: "attributeSet"
		column: "m_attributeset_id"
		type: "TEXT"
	}
	{
		name: "sequenceNumber"
		column: "seqno"
		type: "TEXT"
	}
	{
		name: '_identifier'
		column: '_identifier'
		filter: true
		type: 'TEXT'
	}
]

OB.Data.Registry.registerModel AttributeUse