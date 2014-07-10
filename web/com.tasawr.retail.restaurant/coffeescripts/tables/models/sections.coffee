class Section extends OB.Data.ExtensibleModel
	modelName: "Section"
	tableName: "tsrr_section"
	entityName: "TSRR_Section"
	url: '/openbravo/org.openbravo.service.json.jsonrest/TSRR_Section'
	source: "com.tasawr.retail.restaurant.data.Section"
	dataLimit: 300

Section.addProperties [
	{
		name: "id"
		column: "tsrr_section_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "name"
		column: "name"
		type: "TEXT"
	}
]

OB.Data.Registry.registerModel Section