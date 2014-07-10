(function() {
  enyo.kind({
    name: "TSRR.UI.ModalReceiptsSplit",
    kind: "OB.UI.Modal",
    topPosition: "125px",
    published: {
      receiptsList: null
    },
    i18nHeader: "OBPOS_LblAssignReceipt",
    body: {
      kind: "TSRR.UI.ListReceiptsSplit",
      name: "listreceiptssplit"
    },
    receiptsListChanged: function(oldValue) {
      console.error('rec changed');
      this.$.body.$.listreceiptssplit.setReceiptsList(this.parent.model.attributes.orderList);
    },
    executeOnShow: function() {
      return this.$.body.$.listreceiptssplit.setReceiptsList(this.parent.model.attributes.orderList);
    }
  });

  enyo.kind({
    name: "TSRR.UI.ListReceiptsSplit",
    classes: "row-fluid",
    published: {
      receiptsList: null
    },
    events: {
      onChangeCurrentOrder: ""
    },
    components: [
      {
        classes: "span12",
        components: [
          {
            components: [
              {
                name: "receiptslistitemprintersplit",
                kind: "OB.UI.ScrollableTable",
                scrollAreaMaxHeight: "400px",
                renderLine: "TSRR.UI.ListReceiptLineSplit",
                renderEmpty: "OB.UI.RenderEmpty"
              }
            ]
          }, {
            kind: "TSRR.UI.ListRecieptOkButton"
          }, {
            kind: "TSRR.UI.ListRecieptCancelButton"
          }
        ]
      }
    ],
    receiptsListChanged: function(oldValue) {
      this.$.receiptslistitemprintersplit.setCollection(this.receiptsList);
    }
  });

  enyo.kind({
    name: "TSRR.UI.ListReceiptLineSplit",
    kind: "OB.UI.SelectButton",
    published: {
      receiptsList: null
    },
    events: {
      onHideThisPopup: ""
    },
    tap: function() {
      this.inherited(arguments);
      this.doHideThisPopup();
    },
    components: [
      {
        name: "line",
        style: "line-height: 23px; width: 100%;",
        components: [
          {
            kind: 'TSRR.UI.ListReceiptLine'
          }, {
            style: "float: left; width: 25%",
            name: "orderNo"
          }
        ]
      }
    ],
    create: function() {
      this.inherited(arguments);
      this.$.orderNo.setContent(this.model.get("documentNo"));
    }
  });

  OB.UI.WindowView.registerPopup("OB.OBPOSPointOfSale.UI.PointOfSale", {
    kind: "TSRR.UI.ModalReceiptsSplit",
    name: "TSRR_UI_ModalReceiptsSplit"
  });

  enyo.kind({
    name: "TSRR.UI.ListReceiptLine",
    kind: "OB.UI.CheckboxButton",
    classes: "modal-dialog-btn-check",
    events: {
      onHideThisPopup: ""
    },
    tap: function() {
      this.inherited(arguments);
      this.parent.parent.model.set("checked", !this.parent.parent.model.get("checked"));
    },
    create: function() {
      this.inherited(arguments);
      if (this.parent.parent.model.get('checked')) {
        this.addClass("active");
      } else {
        this.removeClass("active");
      }
    }
  });

  enyo.kind({
    name: "TSRR.UI.ListRecieptOkButton",
    kind: "OB.UI.ModalDialogButton",
    style: "color: black; background-color: green;",
    isDefaultAction: true,
    events: {
      onListRecieptOkButton: ""
    },
    tap: function(inSender, inEvent) {
      var splitReciepts;
      console.error('ok button pressed');
      splitReciepts = jQuery.extend({}, this.parent.parent.getReceiptsList());
      _.each(splitReciepts.models, function(order) {
        if (order.get('checked')) {
          return console.error('present');
        } else {
          return splitReciepts.remove(order);
        }
      });
      this.parent.parent.parent.parent.hide();
      return this.parent.parent.parent.parent.parent.doShowPopup({
        popup: "TSRR_UI_SplitOrderPopup",
        args: {
          model: splitReciepts
        }
      });
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent("Ok");
    }
  });

  enyo.kind({
    name: "TSRR.UI.ListRecieptCancelButton",
    kind: "OB.UI.ModalDialogButton",
    style: "color: black; background-color: green;",
    isDefaultAction: true,
    events: {
      onListRecieptOkButton: ""
    },
    tap: function(inSender, inEvent) {
      return this.doListRecieptCancelButton();
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent("Cancel");
    }
  });

}).call(this);
