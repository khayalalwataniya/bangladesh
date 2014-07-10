(function() {
  var addLineComponentToAnotherOrder, findAnotherOrder, findAnotherOrderComponent, findLineComponent, findLineContainingOrder, findLineContainingOrderComponent, tsrrNewOrder;

  enyo.kind({
    name: "TSRR.UI.OrderLineView",
    kind: "OB.UI.SelectButton",
    published: {
      line: null
    },
    components: [
      {
        name: "product",
        attributes: {
          style: "float: left; width: 40%;"
        }
      }, {
        name: "price",
        attributes: {
          style: "float: right; width: 15%; text-align: right;"
        }
      }, {
        style: "clear: both;"
      }
    ],
    init: function() {
      return this.inherited(arguments);
    },
    initComponents: function() {
      return this.inherited(arguments);
    },
    create: function() {
      var me;
      this.inherited(arguments);
      me = this;
      if (me.model !== null && me.model !== void 0) {
        me.setLine(me.model);
        me.$.product.setContent(me.model.attributes.product.attributes._identifier);
        return me.$.price.setContent(me.model.attributes.price);
      }
    },
    lineChanged: function() {
      return OB.info('line has changed');
    },
    render: function() {
      return OB.info('line rendered');
    },
    tap: function(inSender, inEvent) {
      var me;
      me = this;
      _.each(this.parent.parent.parent.parent.$.order1.$.lines.$, function(elem) {
        return elem.applyStyle('background-color', 'white');
      });
      _.each(this.parent.parent.parent.parent.$.order2.$.lines.$, function(elem) {
        return elem.applyStyle('background-color', 'white');
      });
      this.applyStyle('background-color', 'green');
      this.$.product.addClass('selected-line');
      return me.parent.parent.parent.parent.setSelectedLine(me.model);
    }
  });

  enyo.kind({
    name: "TSRR.UI.OrderLinesView",
    published: {
      orderLines: null
    },
    create: function() {
      return this.inherited(arguments);
    },
    orderLinesChanged: function() {
      var line, me;
      OB.info('order line changed, creating Components');
      me = this;
      return line = me.createComponent({
        kind: "TSRR.UI.OrderLineView",
        model: me.orderLines
      });
    }
  });

  enyo.kind({
    name: "TSRR.UI.SingleOrderView",
    kind: "enyo.Scroller",
    maxHeight: "1000px",
    published: {
      singleOrder: null
    },
    style: "float: left; width: 35%; text-align: right;",
    components: [
      {
        name: "lines",
        kind: "TSRR.UI.OrderLinesView"
      }
    ],
    create: function() {
      return this.inherited(arguments);
    },
    singleOrderChanged: function() {
      var me;
      OB.info('single order changed');
      me = this;
      return enyo.forEach(me.singleOrder.attributes.lines.models, function(lines) {
        return me.$.lines.setOrderLines(lines);
      });
    }
  });

  enyo.kind({
    name: "TSRR.UI.SplitOrderView",
    classes: "row-fluid cleafix",
    fromOrder: "",
    toOrder: "",
    components: [
      {
        kind: "TSRR.UI.SingleOrderView",
        name: "order1",
        classes: "span5 rmargin"
      }, {
        kind: "onyx.Button",
        name: "Switch",
        content: "Switch Order",
        classes: "onyx-affirmative span2",
        style: "margin-top: 100px;width: 115px;",
        ontap: 'buttonTapped'
      }, {
        kind: "TSRR.UI.SingleOrderView",
        name: "order2",
        classes: "span5 lmargin"
      }
    ],
    published: {
      orders: null,
      selectedLine: null
    },
    handlers: {
      onSplitOrderOkButton: "splitOrderOkPressed"
    },
    buttonTapped: function(inSender, inEvent) {
      var line, me;
      me = this;
      line = me.getSelectedLine();
      OB.info('button was tapped again');
      return addLineComponentToAnotherOrder(line, me);
    },
    splitOrderOkPressed: function(inSender, inEvent) {
      var me, ordersOnPopup;
      me = this;
      OB.info("CALLING SplitOrderOkPressed");
      ordersOnPopup = inSender.parent.getOrders();
      _.each(ordersOnPopup.models, function(order) {
        order.calculateGross();
        return order.save();
      });
      return inSender.parent.hide();
    },
    create: function() {
      return this.inherited(arguments);
    },
    ordersChanged: function() {
      var i, me, newOrder;
      this.inherited(arguments);
      OB.info('main order(containing two single orders) has been changed');
      me = this;
      if (me.orders.models.length === 1) {
        newOrder = tsrrNewOrder();
        this.orders.add(newOrder);
        me.$.order1.setSingleOrder(me.orders.models[0]);
        me.$.order2.setSingleOrder(newOrder);
        TSRR.Main.order2 = newOrder;
        return TSRR.Main.order1 = me.orders.models[0];
      } else {
        i = 1;
        return enyo.forEach(me.orders.models, function(model) {
          if (1 === i) {
            TSRR.Main.order1 = model;
            me.$.order1.setSingleOrder(model);
          } else {
            TSRR.Main.order2 = model;
            me.$.order2.setSingleOrder(model);
          }
          return i++;
        });
      }
    },
    selectedLineChange: function() {
      return OB.info('selected line has been changed');
    }
  });

  addLineComponentToAnotherOrder = function(line, orderComponents) {
    var anotherOrderComponent, containingOrderComponent, lineComponent;
    anotherOrderComponent = findAnotherOrderComponent(line, orderComponents);
    containingOrderComponent = findLineContainingOrderComponent(line, orderComponents);
    lineComponent = findLineComponent(line, containingOrderComponent);
    anotherOrderComponent.singleOrder.attributes.lines.add(lineComponent.model);
    containingOrderComponent.singleOrder.attributes.lines.remove(lineComponent.model);
    anotherOrderComponent.$.lines.destroyComponents();
    containingOrderComponent.$.lines.destroyComponents();
    orderComponents.ordersChanged();
    anotherOrderComponent.singleOrderChanged();
    anotherOrderComponent.render();
    containingOrderComponent.singleOrderChanged();
    return containingOrderComponent.render();
  };

  findLineContainingOrder = function(line, bothOrders) {
    var containingOrder;
    containingOrder = null;
    _.each(bothOrders, function(orderOb) {
      return _.each(orderOb.attributes.lines._byCid, function(orderLine) {
        if (line.cid === orderLine.cid) {
          return containingOrder = orderOb;
        }
      });
    });
    return containingOrder;
  };

  findAnotherOrder = function(containingOrder, bothOrders) {
    var anotherOrder;
    anotherOrder = null;
    _.each(bothOrders, function(orderOb) {
      if (containingOrder !== orderOb) {
        return anotherOrder = orderOb;
      }
    });
    return anotherOrder;
  };

  findLineContainingOrderComponent = function(line, bothComponents) {
    var containingComponent, containingOrder;
    containingComponent = null;
    containingOrder = findLineContainingOrder(line, bothComponents.getOrders()._byCid);
    _.each(bothComponents.$, function(orderComponent) {
      if (orderComponent.singleOrder === containingOrder) {
        return containingComponent = orderComponent;
      }
    });
    return containingComponent;
  };

  findAnotherOrderComponent = function(line, bothComponents) {
    var anotherComponent, anotherOrder, containingOrder;
    anotherComponent = null;
    containingOrder = findLineContainingOrder(line, bothComponents.getOrders()._byCid);
    anotherOrder = findAnotherOrder(containingOrder, bothComponents.getOrders()._byCid);
    _.each(bothComponents.$, function(orderComponent) {
      if (orderComponent.singleOrder === anotherOrder) {
        return anotherComponent = orderComponent;
      }
    });
    return anotherComponent;
  };

  findLineComponent = function(line, containingOrderComponent) {
    var lineComponent;
    lineComponent = null;
    _.each(containingOrderComponent.$.lines.children, function(lineButton) {
      if (lineButton.model === line) {
        return lineComponent = lineButton;
      }
    });
    return lineComponent;
  };

  tsrrNewOrder = function() {
    var documentseq, documentseqstr, order;
    order = new OB.Model.Order();
    order.set("client", OB.POS.modelterminal.get("terminal").client);
    order.set("organization", OB.POS.modelterminal.get("terminal").organization);
    order.set("createdBy", OB.POS.modelterminal.get("orgUserId"));
    order.set("updatedBy", OB.POS.modelterminal.get("orgUserId"));
    order.set("documentType", OB.POS.modelterminal.get("terminal").terminalType.documentType);
    order.set("orderType", 0);
    order.set("generateInvoice", false);
    order.set("isQuotation", false);
    order.set("oldId", null);
    order.set("session", OB.POS.modelterminal.get("session"));
    order.set("priceList", OB.POS.modelterminal.get("terminal").priceList);
    order.set("priceIncludesTax", OB.POS.modelterminal.get("pricelist").priceIncludesTax);
    order.set("generateInvoice", OB.POS.modelterminal.get("terminal").terminalType.generateInvoice);
    order.set("currency", OB.POS.modelterminal.get("terminal").currency);
    order.set("currency" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("terminal")["currency" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER]);
    order.set("warehouse", OB.POS.modelterminal.get("terminal").warehouse);
    order.set("salesRepresentative", OB.POS.modelterminal.get("context").user.id);
    order.set("salesRepresentative" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("context").user._identifier);
    order.set("posTerminal", OB.POS.modelterminal.get("terminal").id);
    order.set("posTerminal" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("terminal")._identifier);
    order.set("orderDate", new Date());
    order.set("isPaid", false);
    order.set("paidOnCredit", false);
    order.set("isLayaway", false);
    order.set("taxes", null);
    documentseq = OB.POS.modelterminal.get("documentsequence") + 1;
    documentseqstr = OB.UTIL.padNumber(documentseq, 7);
    OB.POS.modelterminal.set("documentsequence", documentseq);
    order.set("documentNo", OB.POS.modelterminal.get("terminal").docNoPrefix + "/" + documentseqstr);
    order.set("bp", OB.POS.modelterminal.get("businessPartner"));
    order.set("print", true);
    order.set("sendEmail", false);
    return order.set("openDrawer", false);
  };

}).call(this);
