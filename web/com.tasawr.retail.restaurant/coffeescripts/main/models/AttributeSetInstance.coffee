class AttributeSetInstance extends OB.Data.ExtensibleModel
	modelName: "AttributeSetInstance"
	tableName: "m_attributesetinstance"
	entityName: "AttributeSetInstance"
	source: "org.openbravo.model.common.plm.AttributeSetInstance"
	dataLimit: 300

AttributeSetInstance.addProperties [
	{
		name: "id"
		column: "m_attributesetinstance_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "attributeSet"
		column: "m_attributeset_id"
		type: "TEXT"
	}
	{
		name: "serialNo"
		column: "serno"
		type: "TEXT"
	}
	{
		name: "description"
		column: "description"
		type: "TEXT"
	}
	{
		name: "lotName"
		column: "lot"
		type: "TEXT"
	}
	{
		name: "lot"
		column: "m_lot_id"
		type: "TEXT"
	}
	{
		name: "islocked"
		column: "islocked"
		type: "TEXT"
	}
	{
		name: "lockDescription"
		column: "lock_description"
		type: "TEXT"
	}
	{
		name: 'expirationDate'
		column: 'guaranteedate'
		type: 'TEXT'
	}
	{
		name: '_identifier'
		column: '_identifier'
		filter: true
		type: 'TEXT'
	}
]

OB.Data.Registry.registerModel AttributeSetInstance