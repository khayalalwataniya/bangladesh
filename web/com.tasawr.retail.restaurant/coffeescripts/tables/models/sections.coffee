class Section extends OB.Data.ExtensibleModel
	modelName: "Section"
	tableName: "tsrr_section"
	entityName: "TSRR_Section"
	url: '../../org.openbravo.service.json.jsonrest/TSRR_Section'
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


class Printprodcode extends OB.Data.ExtensibleModel
  modelName: "Printprodcode"
  tableName: "tsrr_printprodcode"
  entityName: "TSRR_Printprodcode"
  url: '../../org.openbravo.service.json.jsonrest/TSRR_Printprodcode'
  source: "com.tasawr.retail.restaurant.data.Printprodcode"
  dataLimit: 300

Printprodcode.addProperties [
    {
      name: "id"
      column: "tsrr_printprodcode_id"
      primaryKey: true
      type: "TEXT"
    }
    {
      name: "pOSTerminal"
      column: "obpos_applications_id"
      type: "TEXT"
    }
    {
      name: "product"
      column: "m_product_id"
      type: "TEXT"
    }
    {
    name: "printCode"
    column: "print_code"
    type: "TEXT"
    }
    {
    name: "printerProperty"
    column: "printer_property"
    type: "TEXT"
    }
  


  ]

OB.Data.Registry.registerModel Printprodcode


#'pOSTerminal':'obpos_applications_id','product':'m_product_id','printCode':'print_code','printerProperty':'printer_property','_identifier':'_identifier',


#
#class OrderLineStatus extends OB.Data.ExtensibleModel
#  modelName: "OrderLineStatus"
#  tableName: "tsrr_orderlinestatus"
#  entityName: "TSRR_orderlinestatus"
#
#OrderLineStatus.addProperties [
#  {
#    name: "id"
#    column: "tsrr_orderlinestatus"
#    primaryKey: true
#    type: "TEXT"
#  }
#  {
#    name: "order"
#    column: "obpos_applications_id"
#    type: "TEXT"
#  }
#  {
#    name: "product"
#    column: "m_product_id"
#    type: "TEXT"
#  }
#  {
#    name: "printCode"
#    column: "print_code"
#    type: "TEXT"
#  }
#  {
#    name: "printerProperty"
#    column: "printer_property"
#    type: "TEXT"
#  }
#
#
#
#]
#
#OB.Data.Registry.registerModel Printprodcode




