(function() {
  enyo.kind({
    name: "TSRR.Main.UI.LockButton",
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
          OB.UTIL.showWarning('could not post Table API');
          return console.log(arguments);
        }
      });
      table;
    },
    lockTable: function(me, table) {
      var errorCallback, successCallbackTables;
      errorCallback = function(tx, error) {
        OB.error(tx);
        OB.error(error);
      };
      successCallbackTables = function(tbl) {
        console.info('inside TSRR.Main.UI.UnLockButton successCallbackTables');
        console.info(tbl);
        tbl.set('locked', true);
        tbl.set('locker', OB.POS.modelterminal.usermodel.get('id'));
        tbl.save();
        me.lockTableAjax(table);
        tbl.trigger('sync');
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
  });

  enyo.kind({
    name: "TSRR.Main.UI.UnLockButton",
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
          OB.UTIL.showWarning('could not post Table API');
          return console.log(arguments);
        }
      });
      table;
    },
    unlockTable: function(me, table) {
      var errorCallback, successCallbackUnlockTables;
      errorCallback = function(tx, error) {
        OB.error(tx);
        OB.error(error);
      };
      successCallbackUnlockTables = function(tbl) {
        console.info('inside TSRR.Main.UI.UnLockButton successCallbackTables');
        console.info(tbl.get('tsrrSection'));
        tbl.set('locked', false);
        tbl.set('locker', OB.POS.modelterminal.usermodel.get('id'));
        tbl.save();
        me.unlockTableAjax(table);
        tbl.trigger('sync');
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
  });

  enyo.kind({
    name: "TSRR.Main.UI.TransferButton",
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
  });

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("lockCommand", new TSRR.Main.UI.LockButton());

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("unlockCommand", new TSRR.Main.UI.UnLockButton());

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("transferCommand", new TSRR.Main.UI.TransferButton());

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    label: "Transfer Table",
    classButtonActive: "btnactive-blue",
    command: 'transferCommand'
  });

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    label: "Lock Table",
    classButtonActive: "btnactive-blue",
    command: 'lockCommand'
  });

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    label: "UnLock Table",
    classButtonActive: "btnactive-blue",
    command: 'unlockCommand'
  });

}).call(this);
