# Window model

class TablesWindow extends OB.Model.WindowModel
	models: [
		OB.Model.Section
		OB.Model.Table
		OB.Model.BookingInfo
    OB.Model.Printprodcode
	]

	# defaults:
	init: ->
		@sections = new OB.Collection.SectionList()
		OB.Dal.find OB.Model.Section, null, @handleSections, @dalError

	handleSections: (sections) =>
		@sections.reset sections.models

	dalError: (tx, error) =>
		OB.UTIL.showError "OBDAL error: #{error}"

OB.Model.TablesWindow = TablesWindow