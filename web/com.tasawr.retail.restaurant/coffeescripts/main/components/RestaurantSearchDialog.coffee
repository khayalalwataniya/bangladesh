#global enyo, Backbone, _, $

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  i18nLabel: "TSRR_Lock_Table"
  command: 'line:lockCommand'
  classButtonActive: "btnactive-blue"
  stateless: true
  definition:
    stateless: true
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
        beforeSend: (xhr)->
          xhr.setRequestHeader {headers: Authorization: "Basic " + atob(OB.POS.modelterminal.user + ":" + OB.POS.modelterminal.password)}
        success: (resp) ->
          console.info 'DONE'
          OB.UTIL.showSuccess '[DONE] table with name: "' + table.name + '" has been locked succussfully'
        error: ->
          OB.UTIL.showWarning 'could not post Table API'
      #console.log arguments
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

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  i18nLabel: "TSRR_UnLock_Table"
  command: 'line:unlockCommand'
  classButtonActive: "btnactive-blue"
  stateless: true
  definition:
    stateless: true
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
      #console.log arguments

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

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  i18nLabel: "TSRR_Transfer_Table"
  command: 'line:transferCommand'
  classButtonActive: "btnactive-blue"
  stateless: true
  definition:
    stateless: true
    action: (keyboard, txt) ->
      keyboard.doShowPopup
        popup: "receiptPropertiesDialog"
        args:
          message: txt
          keyboard: keyboard
      keyboard.receipt.trigger('scan')
      return


#OB.POS.modelterminal.password