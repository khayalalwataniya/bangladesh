#global enyo, Backbone, _, $


enyo.kind
	name: "TSRR.Main.UI.LockButton"
	permission: 'OBPOS_order.changePrice'
	lockTableAjax: (table) ->
		data =
			data: [
				_entityName: "TSRR_Table"
				id: table.id
				locked: 'Y'
				locker: OB.POS.modelterminal.usermodel.get('id')
			]
		console.info 'posting to TSRR_Table info api'
		console.info data
		$.ajax "../../org.openbravo.service.json.jsonrest/TSRR_Table",
			data: JSON.stringify(data)
			type: "PUT"
			processData: false
			contentType: "application/json"
			success: (resp) ->
				console.info 'DONE'
				OB.UTIL.showSuccess '[DONE] table with name: "' + table.name + '" has been locked succussfully'
			error: ->
				OB.UTIL.showWarning 'could not post Table API'
				console.log arguments
		table
		return

	lockTable: (me, table) ->
		errorCallback = (tx, error) ->
			OB.UTIL.showError "OBDAL error: " + error
			return
		successCallbackTables = (tbl) ->
			console.info 'inside TSRR.Main.UI.UnLockButton successCallbackTables'
			console.info tbl
			tbl.set 'locked', true
			tbl.set 'locker', OB.POS.modelterminal.usermodel.get('id')
			tbl.save()
			me.lockTableAjax(table)
			return

		OB.Dal.get OB.Model.Table, table.id, successCallbackTables, errorCallback
		return


	action: (keyboard, txt) ->
		me = @
		currentTable = keyboard.receipt.get('restaurantTable')
		if currentTable
			me.lockTable(me, currentTable)
		keyboard.receipt.trigger('scan')
		return

enyo.kind
	name: "TSRR.Main.UI.UnLockButton"
	permission: 'OBPOS_order.changePrice'
	unlockTableAjax: (table) ->
		data =
			data: [
				_entityName: "TSRR_Table"
				id: table.id
				locked: 'N'
				locker: OB.POS.modelterminal.usermodel.get('id')
			]
		console.info 'posting to TSRR_Table info api'
		console.info data
		$.ajax "../../org.openbravo.service.json.jsonrest/TSRR_Table",
			data: JSON.stringify(data)
			type: "PUT"
			processData: false
			contentType: "application/json"
			success: (resp) ->
				console.info 'DONE'
				OB.UTIL.showSuccess '[DONE] table with name: "' + table.name + '" has been unlocked succussfully'
			error: ->
				OB.UTIL.showWarning 'could not post Table API'
				console.log arguments

		table
		return

	unlockTable: (me, table) ->
		errorCallback = (tx, error) ->
			OB.UTIL.showError "OBDAL error: " + error
			return
		successCallbackUnlockTables = (tbl) ->
			console.info 'inside TSRR.Main.UI.UnLockButton successCallbackTables'
			console.info tbl.get 'tsrrSection'
			tbl.set 'locked', false
			tbl.set 'locker', OB.POS.modelterminal.usermodel.get('id')
			tbl.save()
			me.unlockTableAjax(table)
			return

		OB.Dal.get OB.Model.Table, table.id, successCallbackUnlockTables, errorCallback
		return

	action: (keyboard, txt) ->
		me = @
		currentTable = keyboard.receipt.get('restaurantTable')
		if currentTable
			me.unlockTable(me, currentTable)

		keyboard.receipt.trigger('scan')
		return

enyo.kind
	name: "TSRR.Main.UI.TransferButton"
	permission: 'OBPOS_order.changePrice'
	action: (keyboard, txt) ->
		keyboard.doShowPopup
			popup: "receiptPropertiesDialog"
			args:
				message: txt
				keyboard: keyboard

		keyboard.receipt.trigger('scan')
		return


OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "line:lockCommand", new TSRR.Main.UI.LockButton()
OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "line:unlockCommand", new TSRR.Main.UI.UnLockButton()
OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "line:transferCommand", new TSRR.Main.UI.TransferButton()


OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
	i18nLabel: "TSRR_Lock_Table"
	command: 'line:lockCommand'
	classButtonActive: "btnactive-blue"

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
	i18nLabel: "TSRR_UnLock_Table"
	command: 'line:unlockCommand'
	classButtonActive: "btnactive-blue"

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
	i18nLabel: "TSRR_Transfer_Table"
	command: 'line:transferCommand'
	classButtonActive: "btnactive-blue"

