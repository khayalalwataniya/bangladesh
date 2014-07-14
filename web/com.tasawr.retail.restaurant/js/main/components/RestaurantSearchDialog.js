(function() {
  enyo.kind({
    name: "TSRR.Main.UI.LockButton",
    stateless: true,
    lockTable: function(tableId) {
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
        tbl.trigger('sync');
        OB.UTIL.showSuccess('[DONE] table with ID: "' + tbl.id + '" has been locked succussfully');
      };
      OB.Dal.get(OB.Model.Table, tableId, successCallbackTables, errorCallback);
    },
    action: function(keyboard, txt) {
      var currentTable, me;
      me = this;
      currentTable = keyboard.receipt.get('restaurantTable');
      if (currentTable) {
        me.lockTable(currentTable.id);
      }
      keyboard.receipt.trigger('scan');
    }
  });

  enyo.kind({
    name: "TSRR.Main.UI.UnLockButton",
    stateless: true,
    unlockTable: function(tableId) {
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
        tbl.trigger('sync');
        OB.UTIL.showSuccess('[DONE] table with ID: "' + tbl.id + '" has been unlocked succussfully');
      };
      OB.Dal.get(OB.Model.Table, tableId, successCallbackUnlockTables, errorCallback);
    },
    action: function(keyboard, txt) {
      var currentTable, me;
      me = this;
      currentTable = keyboard.receipt.get('restaurantTable');
      if (currentTable) {
        me.unlockTable(currentTable.id);
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
