(function() {
  var AttributeSetInstance, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AttributeSetInstance = (function(_super) {
    __extends(AttributeSetInstance, _super);

    function AttributeSetInstance() {
      _ref = AttributeSetInstance.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AttributeSetInstance.prototype.modelName = "AttributeSetInstance";

    AttributeSetInstance.prototype.tableName = "m_attributesetinstance";

    AttributeSetInstance.prototype.entityName = "AttributeSetInstance";

    AttributeSetInstance.prototype.source = "org.openbravo.model.common.plm.AttributeSetInstance";

    AttributeSetInstance.prototype.dataLimit = 300;

    return AttributeSetInstance;

  })(OB.Data.ExtensibleModel);

  AttributeSetInstance.addProperties([
    {
      name: "id",
      column: "m_attributesetinstance_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "attributeSet",
      column: "m_attributeset_id",
      type: "TEXT"
    }, {
      name: "serialNo",
      column: "serno",
      type: "TEXT"
    }, {
      name: "description",
      column: "description",
      type: "TEXT"
    }, {
      name: "lotName",
      column: "lot",
      type: "TEXT"
    }, {
      name: "lot",
      column: "m_lot_id",
      type: "TEXT"
    }, {
      name: "islocked",
      column: "islocked",
      type: "TEXT"
    }, {
      name: "lockDescription",
      column: "lock_description",
      type: "TEXT"
    }, {
      name: 'expirationDate',
      column: 'guaranteedate',
      type: 'TEXT'
    }, {
      name: '_identifier',
      column: '_identifier',
      filter: true,
      type: 'TEXT'
    }
  ]);

  OB.Data.Registry.registerModel(AttributeSetInstance);

}).call(this);
