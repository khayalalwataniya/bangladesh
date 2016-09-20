(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TSRR.Main.Model.GenericModelForPrinter = (function(_super) {
    __extends(GenericModelForPrinter, _super);

    function GenericModelForPrinter() {
      _ref = GenericModelForPrinter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GenericModelForPrinter.prototype.order = null;

    GenericModelForPrinter.prototype.message = null;

    GenericModelForPrinter.prototype.printCode = null;

    GenericModelForPrinter.prototype.printerProperty = null;

    GenericModelForPrinter.prototype.productQty = null;

    GenericModelForPrinter.prototype.description = null;

    return GenericModelForPrinter;

  })(Backbone.Model);

}).call(this);
