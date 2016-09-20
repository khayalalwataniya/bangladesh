(function() {
  enyo.kind({
    name: "OB.UI.SalesOrder",
    kind: "OB.UI.SmallButton",
    classes: "btnlink btnlink-small btnlink-gray",
    style: "float:left; margin:7px; height:27px; padding: 4px 15px 7px 15px;",
    published: {
      order: null
    },
    events: {
      onShowPopup: ""
    },
    tap: function() {
      if (!this.disabled) {
        this.doShowPopup({
          popup: "modalsalesorder"
        });
      }
    },
    init: function(model) {
      if (!OB.POS.modelterminal.hasPermission(this.permission)) {
        this.parent.parent.parent.hide();
      } else {
        if (!OB.POS.modelterminal.hasPermission(this.permissionOption)) {
          this.parent.parent.parent.hide();
        }
      }
      this.setOrder(model.get("order"));
    },
    renderSalesOrder: function(newSalesOrder) {
      this.setContent(newSalesOrder);
    },
    orderChanged: function(oldValue) {
      if (this.order.get("documentNo")) {
        this.renderSalesOrder(this.order.get("documentNo"));
      } else {
        this.renderSalesOrder("");
      }
    }
  });

}).call(this);
