(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "orderPopup",
    i18nLabel: "TSRR_BtnSendAllOrderLabel",
    classButtonActive: "btnactive-blue",
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        keyboard.doShowPopup({
          popup: "TSRR_UI_SendCancelOrderPopup",
          args: {
            message: "",
            keyboard: keyboard
          }
        });
      }
    }
  });

  enyo.kind({
    name: "TSRR.UI.SendCancelOrderPopup",
    kind: "OB.UI.ModalAction",
    i18nHeader: "TSRR_SendCancelOrderPopupHeaderMessage",
    handlers: {
      onSendButton: "sendButton",
      onCancelButton: "cancelButton"
    },
    events: {
      onShowPopup: ""
    },
    bodyContent: {
      i18nContent: 'TSRR_SendCancelOrderPopupBodyMessage'
    },
    bodyButtons: {
      components: [
        {
          kind: "TSRR.UI.DialogSendButton",
          name: "sendButton"
        }, {
          kind: "TSRR.UI.DialogCancelButton",
          name: "cancelButton"
        }
      ]
    },
    loadValue: function(mProperty) {
      return this.waterfall("onLoadValue", {
        model: this.model,
        modelProperty: mProperty
      });
    },
    sendButton: function(inSender, inEvent) {
      var lines, sendToPrinter, templatereceipt;
      this.hide();
      debugger;
      OB.UI.printingUtils.prepareReceipt(this.args.keyboard);
      lines = this.args.keyboard.receipt.attributes.lines;
      sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, lines);
      templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendOrderTemplate);
      OB.UI.printingUtils.printLineOrReceipt(this.args.keyboard, templatereceipt, sendToPrinter);
      _.each(lines.models, function(model) {
        return enyo.Signals.send("onTransmission", {
          message: 'sent',
          cid: model.cid
        });
      });
      return OB.UTIL.showSuccess("Orders sent to printers successfully");
    },
    cancelButton: function(keyboard, inEvent) {
      this.hide();
      return this.doShowPopup({
        popup: "TSRR_UI_CancelOrderReasonPopup",
        args: {
          message: "",
          keyboard: keyboard
        }
      });
    },
    executeOnHide: function() {
      return console.log('executeOnHide');
    },
    executeOnShow: function() {
      return console.log('executeOnShow');
    },
    applyChanges: function(inSender, inEvent) {
      this.waterfall("onApplyChange", {});
      return true;
    },
    init: function(model) {
      return this.model = model;
    },
    initComponents: function() {
      return this.inherited(arguments);
    }
  });

  enyo.kind({
    name: "TSRR.UI.DialogSendButton",
    kind: "OB.UI.ModalDialogButton",
    style: "color: black; background-color: white;",
    isDefaultAction: true,
    events: {
      onHideThisPopup: "",
      onSendButton: ""
    },
    tap: function(inSender, inEvent) {
      return this.doSendButton();
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent("Send");
    }
  });

  enyo.kind({
    name: "TSRR.UI.DialogCancelButton",
    kind: "OB.UI.ModalDialogButton",
    style: "color: black; background-color: white;",
    isDefaultAction: true,
    events: {
      onHideThisPopup: "",
      onCancelButton: ""
    },
    tap: function() {
      return this.doCancelButton();
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent("Cancel");
    }
  });

  enyo.kind({
    name: "TSRR.UI.OrderButton",
    stateless: true,
    action: function(keyboard, txt) {
      return keyboard.doShowPopup({
        popup: "TSRR_UI_SendCancelOrderPopup",
        args: {
          message: "",
          keyboard: keyboard
        }
      });
    }
  });

  OB.UI.WindowView.registerPopup("OB.OBPOSPointOfSale.UI.PointOfSale", {
    kind: "TSRR.UI.SendCancelOrderPopup",
    name: "TSRR_UI_SendCancelOrderPopup"
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
      var lines, sendToPrinter, templatereceipt;
      this.inherited(arguments);
      this.message = inSender.getControls()[0].getControls()[0].getControls()[0].getValue();
      lines = TSRR.Tables.Config.currentOrder.get('lines');
      sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, lines);
      templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelOrderTemplate);
      OB.POS.hwserver.print(templatereceipt, {
        order: sendToPrinter,
        message: this.message,
        receiptNo: this.parent.model.get('order').get('documentNo'),
        tableNo: this.parent.model.get('order').get('restaurantTable').name,
        sectionNo: JSON.parse(localStorage.getItem('currentSection')).name,
        guestNo: this.parent.model.get('order').get('numberOfGuests'),
        user: this.parent.model.get('order').get('salesRepresentative$_identifier')
      });
      _.each(lines.models, function(model) {
        return enyo.Signals.send("onTransmission", {
          message: 'cancelled',
          cid: model.cid
        });
      });
      OB.UTIL.showSuccess("Order cancelled");
      this.parent.$.TSRR_UI_SendCancelOrderPopup.hide();
      return this.hide();
    },
    cancelButtonPressed: function(inSender, inEvent) {
      this.parent.$.TSRR_UI_SendCancelOrderPopup.hide();
      return this.hide();
    },
    init: function(model) {
      this.inherited(arguments);
      return window.model = model;
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
