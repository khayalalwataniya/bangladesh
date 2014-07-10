(function() {
  enyo.kind({
    name: "TSRR.UI.SplitOrderOkButton",
    kind: "OB.UI.ModalDialogButton",
    events: {
      onApplyChanges: ""
    },
    tap: function() {
      if (this.doApplyChanges()) {
        this.doHideThisPopup();
      }
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent("Ok");
    }
  });

  enyo.kind({
    kind: "OB.UI.ModalAction",
    name: "TSRR.UI.SplitOrderPopup",
    published: {
      orders: null
    },
    handlers: {
      onApplyChanges: "applyChanges",
      onChangeEditMode: "changeEditMode",
      onCheckBoxBehaviorForTicketLine: "checkBoxForTicketLines"
    },
    events: {
      onShowPopup: "",
      onLineChecked: ""
    },
    i18nHeader: "TSRR_SplitOrderPopupHeader",
    bodyContent: {
      kind: "Scroller",
      maxHeight: "225px",
      style: "background-color: #ffffff;",
      components: [
        {
          name: "listOrderLines",
          kind: "TSRR.UI.SplitOrderView",
          args: this.args
        }
      ]
    },
    bodyButtons: {
      components: [
        {
          kind: "TSRR.UI.SplitOrderOkButton",
          name: "okButton"
        }, {
          kind: "OB.UI.CancelDialogButton"
        }
      ]
    },
    init: function(model) {
      var me;
      me = this;
      return this.model = model;
    },
    initComponents: function() {
      return this.inherited(arguments);
    },
    executeOnShow: function() {
      OB.info(this.args);
      this.$.bodyContent.$.listOrderLines.setOrders(this.args.model);
      return this.$.bodyContent.$.listOrderLines.ordersChanged();
    },
    applyChanges: function(inSender, inEvent) {
      var me, ordersOnPopup;
      console.log('SplitOrderPopup ok button clicked');
      me = this;
      ordersOnPopup = me.model.attributes.orderList;
      _.each(ordersOnPopup.models, function(order) {
        order.calculateGross();
        return order.save();
      });
      this.hide();
      return OB.POS.navigate("retail.restaurantmode");
    }
  });

  OB.UI.WindowView.registerPopup("OB.OBPOSPointOfSale.UI.PointOfSale", {
    kind: "TSRR.UI.SplitOrderPopup",
    name: "TSRR_UI_SplitOrderPopup"
  });

  enyo.kind({
    name: "OB.UI.RenderOrderLineEmpty",
    style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc",
    initComponents: function() {
      return this.inherited(arguments);
    }
  });

}).call(this);
