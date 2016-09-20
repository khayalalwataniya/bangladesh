(function() {
  var __slice = [].slice;

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "sendOrder",
    i18nLabel: "TSRR_BtnSendAllOrderLabel",
    classButtonActive: "btnactive-blue",
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        var lines, promises;
        OB.UI.printingUtils.prepareReceipt(keyboard);
        lines = OB.UI.printingUtils.filterAlreadySent(keyboard.receipt.attributes.lines);
        if (lines._wrapped.length !== 0) {
          TSRR.Main.TempVars.productsAndPrinters = [];
          promises = OB.UI.printingUtils.productInfoGetter2(lines);
          $.when.apply(undefined, promises).then(function() {
            var models, sendToPrinter, templatereceipt;
            models = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            OB.UI.printingUtils.assignVar2(models, lines);
            sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator2();
            templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendOrderTemplate);
            OB.POS.hwserver.print(templatereceipt, {
              order: sendToPrinter,
              receiptNo: keyboard.receipt.get('documentNo'),
              //tableNo: JSON.parse(localStorage.getItem('currentTable')).name,
              //my  add table no into printer
              tableNo: OB.POS.modelterminal.orderList.current.get('bp').get('_identifier'),
              //my
              sectionNo: OB.POS.modelterminal.orderList.current.get('bp').get('locName'), // JSON.parse(localStorage.getItem('currentSection')).name,
              guestNo: OB.POS.modelterminal.orderList.current.get('bp').get('locName'), //keyboard.receipt.get('numberOfGuests'),
              message: 'sent',
              user: keyboard.receipt.get('salesRepresentative$_identifier')
            });
            _.each(lines._wrapped, function(model) {
              model.set('sendstatus', 'sent');
              return model.trigger('change');
            });
            return keyboard.receipt.save();
          });
          OB.UTIL.showSuccess("Orders sent to printers successfully");


          //mykazi

var sqlblockingCustomer = "update c_bpartner set customerBlocking='true' where c_bpartner_id='" + OB.POS.modelterminal.orderList.current.get('bp').get('id') + "'";
          var db = OB.Data.localDB;
          db.transaction(function(tx){
            tx.executeSql(sqlblockingCustomer);
          });
        /*var criteria = {};
        criteria._whereClause = "where c_bpartner_id =='" + OB.POS.modelterminal.orderList.current.get('bp').get('id') + "'";
         OB.Dal.find(OB.Model.BusinessPartner, criteria, function (bps, blocks) {
          console.log(bps);
                    if (bps.length > 0) {

                      console.log("Start " + bps.models[0].get('customerBlocking'));
                      bps.models[0].set('customerBlocking', 'true');
                      console.log("End " + bps.models[0].get('customerBlocking'));
                      //me.bps.set('customerBlocking', true);
                    }

                console.log(bps);
                  });
      OB.Dal.save(OB.Model.BusinessPartner, success, error);*/
         // sqlblockingCustomer = "update c_bpartner set customerBlocking='true' where c_bpartner_id='" + OB.POS.modelterminal.orderList.current.get('bp').get('id') + "'";
         // OB.DATA(sqlblockingCustomer);

          
          
          //console.
          console.log(sqlblockingCustomer);
          //var bCustomer = new OB.Model.BusinessPartner();
          // bCustomer.set('blockingCustomer', true);

        OB.DATA.executeCustomerSave = function (customer, callback) {
          var customersList, customerId = OB.POS.modelterminal.orderList.current.get('bp').get('id'),
          isNew = false,
          bpToSave = new OB.Model.BusinessPartners(),
          bpLocation, bpLocToSave = new OB.Model.BPLocation(),
          customersListToChange;
          console.log(customerId);
    
        
        if (customerId) {
        customer.set('posTerminal', OB.MobileApp.model.get('terminal').id);
        var now = new Date();
        customer.set('updated', OB.I18N.normalizeDate(now));
        customer.set('timezoneOffset', now.getTimezoneOffset());
        customer.set('loaded', OB.I18N.normalizeDate(new Date(customer.get('loaded'))));
        bpToSave.set('json', JSON.stringify(this.customer.serializeEditedToJSON()));
        bpToSave.set('c_bpartner_id', this.customer.get('id'));
        bpToSave.set('customerBlocking', 'true');
        }
        bpToSave.set('isbeingprocessed', 'Y');
      }; 
            

        //OB.Dal.save(bCustomer, success, error);
//OB.POS.modelterminal.orderList.addNewOrder();
//mykazi
          //OB.POS.modelterminal.orderList.addNewOrder();
        } else {
          return OB.UTIL.showSuccess("Nothing more to send");
        }
      }
    }
  });

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "cancelOrderReasonPopup",
    i18nLabel: "TSRR_BtnCancelOrderLabel",
    classButtonActive: "btnactive-blue",
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        keyboard.doShowPopup({
          popup: "TSRR_UI_CancelOrderReasonPopup",
          args: {
            message: "",
            keyboard: keyboard
          }
        });
      }
    }
  });

  enyo.kind({
    kind: "OB.UI.ModalAction",
    name: "TSRR.UI.CancelOrderReasonPopup",
    i18nHeader: "TSRR_CancelReasonHeader",
    handlers: {
      onCancelReasonOkButton: "okButtonPressed",
      onCancelReasonCancelButton: "cancelButtonPressed"
    },
    published: {
      message: '',
      keyboard: null
    },
    bodyContent: {
      components: [
        {
          kind: "onyx.Input",
          placeholder: "Enter reason here",
          onchange: "okButtonPressed",
          classes: "modal-dialog-receipt-properties-text",
          name: "cancelReasonText"
        }, {
          name: "result",
          classes: "onyx-result"
        }
      ]
    },
    bodyButtons: {
      components: [
        {
          kind: "TSRR.UI.CancelReasonOkButton",
          name: "cancelReasonOkButton"
        }, {
          kind: "TSRR.UI.CancelReasonCancelButton",
          name: "cancelReasonCancelButton"
        }
      ]
    },
    okButtonPressed: function(inSender, inEvent) {
      var lines, me, message, promises, receiptNo, tableNo , user;
      this.inherited(arguments);
      me = this;
      message = inSender.getControls()[0].getControls()[0].getControls()[0].getValue();
      receiptNo = this.parent.model.get('order').get('documentNo');
      user = this.parent.model.get('order').get('salesRepresentative$_identifier');
      //my add table no into printer
      tableNo = OB.POS.modelterminal.orderList.current.get('bp').get('_identifier');
      //my
      lines = OB.POS.modelterminal.orderList.modelorder.get('lines');
      lines._wrapped = lines.models;
      TSRR.Main.TempVars.productsAndPrinters = [];
      promises = OB.UI.printingUtils.productInfoGetter2(lines);
      $.when.apply(undefined, promises).then(function() {
        var models, sendToPrinter, templatereceipt;
        models = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        OB.UI.printingUtils.assignVar2(models, lines);
        sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator2();
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelOrderTemplate);
        OB.POS.hwserver.print(templatereceipt, {
          order: sendToPrinter,
          message: message,
          receiptNo: receiptNo,
          //tableNo: JSON.parse(localStorage.getItem('currentTable')).name,
          //my add table no into printer
          tableNo: tableNo,
          //my
          sectionNo: '', //JSON.parse(localStorage.getItem('currentSection')).name,
          guestNo: receiptNo, // TSRR.Tables.Config.MyOrderList.modelorder.get('numberOfGuests') || "0",
          user: user
        });
        _.each(lines._wrapped, function(model) {
          model.set('sendstatus', 'cancelled');
          return model.trigger('change');
        });
        return OB.POS.modelterminal.orderList.modelorder.save();
      });
      this.hide();
      OB.UTIL.showSuccess("Order cancelled");
    },
    cancelButtonPressed: function(inSender, inEvent) {
      this.hide();
    },
    init: function(model) {
      return this.inherited(arguments);
    }
  });

  enyo.kind({
    name: "TSRR.UI.CancelReasonOkButton",
    kind: "OB.UI.ModalDialogButton",
    style: "color: black; background-color: white;",
    isDefaultAction: true,
    events: {
      onCancelReasonOkButton: ""
    },
    tap: function(inSender, inEvent) {
      return this.doCancelReasonOkButton();
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent(OB.I18N.getLabel("OBMOBC_LblOk"));
    }
  });

  enyo.kind({
    name: "TSRR.UI.CancelReasonCancelButton",
    kind: "OB.UI.ModalDialogButton",
    style: "color: black; background-color: white;",
    isDefaultAction: true,
    events: {
      onCancelReasonCancelButton: ""
    },
    tap: function(inSender, inEvent) {
      return this.doCancelReasonCancelButton();
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent(OB.I18N.getLabel("OBMOBC_LblCancel"));
    }
  });

  OB.UI.WindowView.registerPopup("OB.OBPOSPointOfSale.UI.PointOfSale", {
    kind: "TSRR.UI.CancelOrderReasonPopup",
    name: "TSRR_UI_CancelOrderReasonPopup"
  });

}).call(this);
