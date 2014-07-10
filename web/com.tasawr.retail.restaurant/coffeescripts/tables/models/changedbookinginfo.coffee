#global Backbone,_

class ChangedBookingInfo extends Backbone.Model
	modelName: "ChangedBookingInfo"
	tableName: "tsrr_changedbookinginfo"
	entityName: ""
	source: ""
	local: true
	properties: [
		"id"
		"json"
		"tsrr_booking_info_id"
		"isbeingprocessed"
	]
	propertyMap:
		id: "changedbookinginfo_id"
		json: "json"
		tsrr_booking_info_id: "tsrr_booking_info_id"
		isbeingprocessed: "isbeingprocessed"

	createStatement: "CREATE TABLE IF NOT EXISTS tsrr_changedbookinginfo (changedbookinginfo_id TEXT PRIMARY KEY, json TEXT, tsrr_booking_info_id TEXT, isbeingprocessed TEXT)"
	dropStatement: "DROP TABLE IF EXISTS tsrr_changedbookinginfo"
	insertStatement: "INSERT INTO tsrr_changedbookinginfo(changedbookinginfo_id, json, tsrr_booking_info_id, isbeingprocessed) VALUES (?,?,?,?)"

OB.Data.Registry.registerModel ChangedBookingInfo
