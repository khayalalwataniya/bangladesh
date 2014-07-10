(function() {
  enyo.kind({
    name: "TSRR.Main.UI.LockButton",
    stateless: true,
    lockTable: function(tableId) {
      var data;
      data = {
        data: [
          {
            _entityName: "TSRR_Table",
            id: tableId,
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
          return console.info(resp);
        },
        error: function() {
          OB.UTIL.showWarning('could not post Table API');
          return console.log(arguments);
        }
      });
    },
    action: function(keyboard, txt) {
      var criteria, me;
      me = this;
      criteria = {
        orderidlocal: keyboard.receipt.get('id')
      };
      OB.Dal.find(OB.Model.BookingInfo, criteria, (function(bookingsFound) {
        var bi, tableId;
        console.log('dal resp');
        console.log(bookingsFound);
        if (bookingsFound && bookingsFound.length > 0) {
          bi = bookingsFound.at(0);
          tableId = bi.get('restaurantTable');
          if (OB.POS.modelterminal.get("connectedToERP")) {
            me.lockTable(tableId);
          }
          return OB.UTIL.showSuccess('[DONE] table with ID: "' + tableId + '" has been locked succussfully');
        } else {
          OB.UTIL.showWarning('no booking found with');
          return console.log(criteria);
        }
      }), function() {
        return console.log(arguments);
      });
      keyboard.receipt.trigger('scan');
    }
  });

  enyo.kind({
    name: "TSRR.Main.UI.UnLockButton",
    stateless: true,
    unlockTable: function(tableId) {
      var data;
      data = {
        data: [
          {
            _entityName: "TSRR_Table",
            id: tableId,
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
          return console.info(resp);
        },
        error: function() {
          OB.UTIL.showWarning('could not post Table API');
          return console.log(arguments);
        }
      });
    },
    action: function(keyboard, txt) {
      var criteria, me;
      me = this;
      criteria = {
        orderidlocal: keyboard.receipt.get('id')
      };
      OB.Dal.find(OB.Model.BookingInfo, criteria, (function(bookingsFound) {
        var bi, tableId;
        console.log('dal resp');
        console.log(bookingsFound);
        if (bookingsFound && bookingsFound.length > 0) {
          bi = bookingsFound.at(0);
          tableId = bi.get('restaurantTable');
          if (OB.POS.modelterminal.get("connectedToERP")) {
            me.unlockTable(tableId);
          }
          return OB.UTIL.showSuccess('[DONE] table with ID: "' + tableId + '" has been locked succussfully');
        } else {
          OB.UTIL.showWarning('no booking found with');
          return console.log(criteria);
        }
      }), function() {
        return console.log(arguments);
      });
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
