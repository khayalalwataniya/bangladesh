(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_Lock_Table",
    command: 'line:lockCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      lockTableAjax: function(table) {
        var data;
        data = {
          data: [
            {
              _entityName: "TSRR_Table",
              id: table.id,
              locked: 'Y',
              locker: OB.POS.modelterminal.usermodel.get('id')
            }
          ]
        };
        console.info('posting to TSRR_Table info api');
        console.info(data);
        $.ajax("../../org.openbravo.service.json.jsonrest/TSRR_Table", {
          data: JSON.stringify(data),
          type: "PUT",
          processData: false,
          contentType: "application/json",
          success: function(resp) {
            console.info('DONE');
            return OB.UTIL.showSuccess('[DONE] table with name: "' + table.name + '" has been locked succussfully');
          },
          error: function() {
            return OB.UTIL.showWarning('could not post Table API');
          }
        });
        table;
      },
      lockTable: function(me, table) {
        var errorCallback, successCallbackTables;
        errorCallback = function(tx, error) {
          OB.UTIL.showError("OBDAL error: " + error);
        };
        successCallbackTables = function(tbl) {
          console.info('inside TSRR.Main.UI.UnLockButton successCallbackTables');
          console.info(tbl);
          tbl.set('locked', true);
          tbl.set('locker', OB.POS.modelterminal.usermodel.get('id'));
          tbl.save();
          me.lockTableAjax(table);
        };
        OB.Dal.get(OB.Model.Table, table.id, successCallbackTables, errorCallback);
      },
      action: function(keyboard, txt) {
        var currentTable, me;
        me = this;
        currentTable = keyboard.receipt.get('restaurantTable');
        if (currentTable) {
          me.lockTable(me, currentTable);
        }
        keyboard.receipt.trigger('scan');
      }
    }
  });

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_UnLock_Table",
    command: 'line:unlockCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      unlockTableAjax: function(table) {
        var data;
        data = {
          data: [
            {
              _entityName: "TSRR_Table",
              id: table.id,
              locked: 'N',
              locker: OB.POS.modelterminal.usermodel.get('id')
            }
          ]
        };
        console.info('posting to TSRR_Table info api');
        console.info(data);
        $.ajax("../../org.openbravo.service.json.jsonrest/TSRR_Table", {
          data: JSON.stringify(data),
          type: "PUT",
          processData: false,
          contentType: "application/json",
          success: function(resp) {
            console.info('DONE');
            return OB.UTIL.showSuccess('[DONE] table with name: "' + table.name + '" has been unlocked succussfully');
          },
          error: function() {
            return OB.UTIL.showWarning('could not post Table API');
          }
        });
        table;
      },
      unlockTable: function(me, table) {
        var errorCallback, successCallbackUnlockTables;
        errorCallback = function(tx, error) {
          OB.UTIL.showError("OBDAL error: " + error);
        };
        successCallbackUnlockTables = function(tbl) {
          console.info('inside TSRR.Main.UI.UnLockButton successCallbackTables');
          console.info(tbl.get('tsrrSection'));
          tbl.set('locked', false);
          tbl.set('locker', OB.POS.modelterminal.usermodel.get('id'));
          tbl.save();
          me.unlockTableAjax(table);
        };
        OB.Dal.get(OB.Model.Table, table.id, successCallbackUnlockTables, errorCallback);
      },
      action: function(keyboard, txt) {
        var currentTable, me;
        me = this;
        currentTable = keyboard.receipt.get('restaurantTable');
        if (currentTable) {
          me.unlockTable(me, currentTable);
        }
        keyboard.receipt.trigger('scan');
      }
    }
  });

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_Transfer_Table",
    command: 'line:transferCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        keyboard.doShowPopup({
          popup: "receiptPropertiesDialog",
          args: {
            message: txt,
            keyboard: keyboard
          }
        });
        keyboard.receipt.trigger('scan');
      }
    }
  });

}).call(this);
