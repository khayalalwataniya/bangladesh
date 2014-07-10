(function() {
  var findAnotherOrder, findAnotherOrderComponent, findLineComponent, findLineContainingOrder, findLineContainingOrderComponent;

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

}).call(this);
