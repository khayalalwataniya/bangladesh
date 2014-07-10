(function() {
  var AttributeInstance, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AttributeInstance = (function(_super) {
    __extends(AttributeInstance, _super);

    function AttributeInstance() {
      _ref = AttributeInstance.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AttributeInstance.prototype.modelName = "AttributeInstance";

    AttributeInstance.prototype.tableName = "m_attributeinstance";

    AttributeInstance.prototype.entityName = "AttributeInstance";

    AttributeInstance.prototype.source = "org.openbravo.model.common.plm.AttributeInstance";

    AttributeInstance.prototype.dataLimit = 300;

    return AttributeInstance;

  })(OB.Data.ExtensibleModel);

  AttributeInstance.addProperties([
    {
      name: "id",
      column: "m_attributeinstance_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "attributeSetValue",
      column: "m_attributesetinstance_id",
      type: "TEXT"
    }, {
      name: "attribute",
      column: "m_attribute_id",
      type: "TEXT"
    }, {
      name: "attributeValue",
      column: "m_attributevalue_id",
      type: "TEXT"
    }, {
      name: "searchKey",
      column: "value",
      type: "TEXT"
    }, {
      name: '_identifier',
      column: '_identifier',
      filter: true,
      type: 'TEXT'
    }
  ]);

  OB.Data.Registry.registerModel(AttributeInstance);

}).call(this);
