(function() {
  var AttributeValue, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AttributeValue = (function(_super) {
    __extends(AttributeValue, _super);

    function AttributeValue() {
      _ref = AttributeValue.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AttributeValue.prototype.modelName = "AttributeValue";

    AttributeValue.prototype.tableName = "m_attributevalue";

    AttributeValue.prototype.entityName = "AttributeValue";

    AttributeValue.prototype.source = "org.openbravo.model.common.plm.AttributeValue";

    AttributeValue.prototype.dataLimit = 300;

    return AttributeValue;

  })(OB.Data.ExtensibleModel);

  AttributeValue.addProperties([
    {
      name: "id",
      column: "m_attributevalue_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "attribute",
      column: "m_attribute_id",
      type: "TEXT"
    }, {
      name: "searchKey",
      column: "value",
      type: "TEXT"
    }, {
      name: "name",
      column: "name",
      type: "TEXT"
    }, {
      name: "description",
      column: "description",
      type: "TEXT"
    }, {
      name: "tsrrAddprice",
      column: "em_tsrr_addprice",
      type: "TEXT"
    }, {
      name: '_identifier',
      column: '_identifier',
      filter: true,
      type: 'TEXT'
    }
  ]);

  OB.Data.Registry.registerModel(AttributeValue);

}).call(this);
