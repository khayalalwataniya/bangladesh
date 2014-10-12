(function() {
  enyo.kind({
    name: "TSRR.UI.ModalReceiptsSplit",
    kind: "OB.UI.Modal",
    header: "",
    published: {
      receiptsInfo: null
    },
    body: {
      kind: "TSRR.UI.ListReceiptsSplit",
      name: "listreceiptssplit"
    },
    receiptsInfoChanged: function(oldValue) {
      var me;
      me = this;
      me.$.header.setContent(OB.I18N.getLabel("OBPOS_LblAssignReceipt"));
      if (this.receiptsInfo) {
        OB.Dal.find(OB.Model.Order, {
          session: me.receiptsInfo.get('session')
        }, (function(data) {
          if (data && data.length > 0) {
            return me.$.body.$.listreceiptssplit.setReceiptsList(data);
          }
        }), function(error) {});
      }
    },
    executeOnShow: function() {
      this.setReceiptsInfo(this.args.receiptsInfo);
    },
    executeOnHide: function() {
      this.receiptsInfo = null;
    }
  });

  enyo.kind({
    name: "TSRR.UI.ListReceiptsSplit",
    classes: "row-fluid",
    published: {
      receiptsList: null
    },
    components: [
      {
        classes: "span12",
        components: [
          {
            style: "border-bottom: 1px solid #cccccc;"
          }, {
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
            style: "color: black;background-color: #d5d5d5;",
            kind: "OB.UI.ModalCancel_CancelButton"
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
    classes: "btnselect",
    components: [
      {
        name: "line",
        style: "line-height: 23px; width: 100%;",
        components: [
          {
            kind: 'TSRR.UI.ListReceiptLine',
            name: 'bp',
            allowHtml: true
          }, {
            style: "float: left; width: 25%",
            name: "orderNo"
          }, {
            style: "clear: both"
          }
        ]
      }
    ],
    create: function() {
      this.inherited(arguments);
      this.$.bp.setContent("<b>" + this.model.get('documentNo') + " - " + this.model.get("bp").get("_identifier") + " - " + this.model.get('lines').length + " line items" + " </b><br/>");
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
      console.log('ok button pressed');
      splitReciepts = jQuery.extend({}, this.parent.parent.getReceiptsList());
      _.each(splitReciepts.models, function(order) {
        if (order.get('checked')) {
          return console.log('present');
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
