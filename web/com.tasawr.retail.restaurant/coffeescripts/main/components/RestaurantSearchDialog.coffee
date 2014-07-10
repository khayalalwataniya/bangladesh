#global enyo, Backbone, _, $


enyo.kind
  name: "TSRR.Main.UI.LockButton"
  stateless: true

  lockTable: (tableId) ->
    data =
      data: [
        _entityName: "TSRR_Table"
        id: tableId
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
        console.info resp
      error: ->
        OB.UTIL.showWarning 'could not post Table API'
        console.log arguments
    return


  action: (keyboard, txt) ->
    me = @
    criteria =
      orderidlocal: keyboard.receipt.get('id')
    OB.Dal.find OB.Model.BookingInfo, criteria, ((bookingsFound) -> #OB.Dal.find success
      console.log 'dal resp'
      console.log bookingsFound
      if bookingsFound and bookingsFound.length > 0
        bi = bookingsFound.at 0
        tableId = bi.get 'restaurantTable'
        me.lockTable(tableId) if OB.POS.modelterminal.get("connectedToERP")
        # TODO: move it to i18N message
        OB.UTIL.showSuccess '[DONE] table with ID: "' + tableId + '" has been locked succussfully'
      else
        OB.UTIL.showWarning 'no booking found with'
        console.log criteria
    ), ->
      console.log arguments
    keyboard.receipt.trigger('scan')
    return

enyo.kind
  name: "TSRR.Main.UI.UnLockButton"
  stateless: true

  unlockTable: (tableId) ->
    data =
      data: [
        _entityName: "TSRR_Table"
        id: tableId
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
        console.info resp
      error: ->
        OB.UTIL.showWarning 'could not post Table API'
        console.log arguments
    return


  action: (keyboard, txt) ->
    me = @
    criteria =
      orderidlocal: keyboard.receipt.get('id')
    OB.Dal.find OB.Model.BookingInfo, criteria, ((bookingsFound) -> #OB.Dal.find success
      console.log 'dal resp'
      console.log bookingsFound
      if bookingsFound and bookingsFound.length > 0
        bi = bookingsFound.at 0
        tableId = bi.get 'restaurantTable'
        me.unlockTable(tableId) if OB.POS.modelterminal.get("connectedToERP")
        # TODO: move it to i18N message
        OB.UTIL.showSuccess '[DONE] table with ID: "' + tableId + '" has been locked succussfully'
      else
        OB.UTIL.showWarning 'no booking found with'
        console.log criteria
    ), ->
      console.log arguments
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
