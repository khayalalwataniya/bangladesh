(function() {
  var allPrinters, allProducts, assignVar, printersAndProducts, productInfoGetter, productsAndPrinters, requests, uniquePrinterAndProductGenerator;

  window.keyboard = '';

  uniquePrinterAndProductGenerator = function(callback, lines) {
    var description, i, j, prodQtyDesc, qty, tempProducts, uniquePrinters;
    callback(lines);
    qty = void 0;
    description = void 0;
    uniquePrinters = allPrinters.filter(function(elem, pos) {
      return allPrinters.indexOf(elem) === pos;
    });
    window.arr = productsAndPrinters;
    j = 0;
    while (j < uniquePrinters.length) {
      prodQtyDesc = new Array();
      tempProducts = new Array();
      i = 0;
      while (i < productsAndPrinters.length) {
        if (($.inArray(uniquePrinters[j], productsAndPrinters[i][1][0])) >= 0) {
          prodQtyDesc.push(productsAndPrinters[i]);
        }
        i++;
      }
      printersAndProducts[j] = [];
      printersAndProducts[j][0] = uniquePrinters[j];
      printersAndProducts[j][1] = prodQtyDesc;
      j++;
    }
    return printersAndProducts;
  };

  assignVar = function(requests, lines) {
    var data, i, j, result, tempPrinters, _results;
    tempPrinters = [];
    i = 0;
    _results = [];
    while (i < requests.length) {
      result = JSON.parse(requests[i].xhr.responseText);
      data = result.response.data[0];
      if (data) {
        tempPrinters = data.printerProperty.split(" ");
        j = 0;
        while (j < tempPrinters.length) {
          allPrinters.push(tempPrinters[j]);
          j++;
        }
        productsAndPrinters[i] = [];
        productsAndPrinters[i][0] = data.printCode;
        productsAndPrinters[i][1] = [tempPrinters];
        productsAndPrinters[i][2] = lines.models[i].attributes.qty;
        productsAndPrinters[i][3] = lines.models[i].attributes.description;
      }
      _results.push(i++);
    }
    return _results;
  };

  productInfoGetter = function(lines) {
    var ajaxRequest, i;
    i = 0;
    while (i < lines.length) {
      ajaxRequest = new enyo.Ajax({
        url: "../../org.openbravo.mobile.core.service.jsonrest/" + "com.tasawr.retail.restaurant.data.OrderLineService" + "/" + encodeURI(JSON.stringify({
          product: lines.models[i].attributes.product.id
        })),
        cacheBust: false,
        sync: true,
        method: "GET",
        handleAs: "json",
        contentType: "application/json;charset=utf-8",
        success: function(inSender, inResponse) {
          return {
            fail: function(inSender, inResponse) {
              return console.log("failed");
            }
          };
        }
      });
      ajaxRequest.go().response("success").error("fail");
      requests.push(ajaxRequest);
      i++;
    }
    $.when.apply(undefined, requests).then(assignVar(requests, lines));
    return requests.length = 0;
  };

  printersAndProducts = [];

  allPrinters = [];

  allProducts = [];

  productsAndPrinters = [];

  requests = [];

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "orderPopup",
    label: "Orders",
    classButtonActive: "btnactive-blue"
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
      kind: "Scroller",
      maxHeight: "225px",
      style: "background-color: #ffffff;",
      thumb: true,
      horizontal: "hidden",
      components: [
        {
          name: "attributes"
        }
      ]
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
      lines = this.args.keyboard.receipt.attributes.lines;
      sendToPrinter = uniquePrinterAndProductGenerator(productInfoGetter, lines);
      templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendOrderTemplate);
      OB.POS.hwserver.print(templatereceipt, {
        order: sendToPrinter
      });
      OB.UTIL.showSuccess("Orders sent to printers successfully");
      return this.hide();
    },
    cancelButton: function(keyboard, inEvent) {
      return this.doShowPopup({
        popup: "TSRR.UI.CancelOrderReasonPopup",
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
      window.keyboard = keyboard;
      return keyboard.doShowPopup({
        popup: "TSRR.UI.SendCancelOrderPopup",
        args: {
          message: "",
          keyboard: keyboard
        }
      });
    }
  });

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("orderPopup", new TSRR.UI.OrderButton());

  OB.UI.WindowView.registerPopup("OB.OBPOSPointOfSale.UI.PointOfSale", {
    kind: "TSRR.UI.SendCancelOrderPopup",
    name: "TSRR.UI.SendCancelOrderPopup"
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
      message: ''
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
          classes: "onyx-sample-result",
          content: "No input entered yet."
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
      lines = window.keyboard.receipt.attributes.lines;
      sendToPrinter = uniquePrinterAndProductGenerator(productInfoGetter, lines);
      templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelOrderTemplate);
      OB.POS.hwserver.print(templatereceipt, {
        orderCancelModel: {
          sendToPrinter: sendToPrinter,
          message: this.message
        }
      });
      OB.UTIL.showSuccess("Orders sent to printers successfully");
      return this.hide();
    },
    cancelButtonPressed: function(inSender, inEvent) {
      window.ins = inSender;
      window.ine = inEvent;
      window.ths = this;
      console.log('cancel button was pressed');
      return this.hide();
    },
    init: function(model) {
      window.model = model;
      this.inherited(arguments);
      return console.log(model);
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
      return this.setContent("Ok");
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
      return this.setContent("Cancel");
    }
  });

  OB.UI.WindowView.registerPopup("OB.OBPOSPointOfSale.UI.PointOfSale", {
    kind: "TSRR.UI.CancelOrderReasonPopup",
    name: "TSRR.UI.CancelOrderReasonPopup"
  });

}).call(this);
