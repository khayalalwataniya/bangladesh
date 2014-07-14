#global enyo, Backbone, _, $


enyo.kind
  name: "TSRR.Main.UI.LockButton"
  stateless: true

  lockTable: (tableId) ->
    errorCallback = (tx, error) ->
      OB.error tx
      OB.error error
      return
    successCallbackTables = (tbl) ->
      console.info 'inside TSRR.Main.UI.UnLockButton successCallbackTables'
      console.info tbl
      tbl.set 'locked', true
      tbl.set 'locker', OB.POS.modelterminal.usermodel.get('id')
      tbl.save()
      tbl.trigger 'sync'
      OB.UTIL.showSuccess '[DONE] table with ID: "' + tbl.id + '" has been locked succussfully'
      return

    OB.Dal.get OB.Model.Table, tableId, successCallbackTables, errorCallback
    return


  action: (keyboard, txt) ->
    me = @
    currentTable = keyboard.receipt.get('restaurantTable')
    if currentTable
      me.lockTable(currentTable.id)
    keyboard.receipt.trigger('scan')
    return

enyo.kind
  name: "TSRR.Main.UI.UnLockButton"
  stateless: true

  unlockTable: (tableId) ->
    errorCallback = (tx, error) ->
      OB.error tx
      OB.error error
      return
    successCallbackUnlockTables = (tbl) ->
      console.info 'inside TSRR.Main.UI.UnLockButton successCallbackTables'
      console.info tbl.get 'tsrrSection'
      tbl.set 'locked', false
      tbl.set 'locker', OB.POS.modelterminal.usermodel.get('id')
      tbl.save()
      tbl.trigger 'sync'
      OB.UTIL.showSuccess '[DONE] table with ID: "' + tbl.id + '" has been unlocked succussfully'
      return

    OB.Dal.get OB.Model.Table, tableId, successCallbackUnlockTables, errorCallback
    return

  action: (keyboard, txt) ->
    me = @
    currentTable = keyboard.receipt.get('restaurantTable')
    if currentTable
      me.unlockTable(currentTable.id)
    keyboard.receipt.trigger('scan')
    return

enyo.kind
  name: "TSRR.Main.UI.TransferButton"
  stateless: true

  action: (keyboard, txt) ->
    keyboard.doShowPopup
      popup: "receiptPropertiesDialog"
      args:
        message: txt
        keyboard: keyboard

    keyboard.receipt.trigger('scan')
    return


OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "lockCommand", new TSRR.Main.UI.LockButton()
OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "unlockCommand", new TSRR.Main.UI.UnLockButton()
OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "transferCommand", new TSRR.Main.UI.TransferButton()


OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  label: "Transfer Table" # TODO: move it to i18N message
  classButtonActive: "btnactive-blue"
  command: 'transferCommand'

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  label: "Lock Table" # TODO: move it to i18N message
  classButtonActive: "btnactive-blue"
  command: 'lockCommand'

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  label: "UnLock Table" # TODO: move it to i18N message
  classButtonActive: "btnactive-blue"
  command: 'unlockCommand'
