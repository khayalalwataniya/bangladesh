(function() {
  var AttributeUse, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AttributeUse = (function(_super) {
    __extends(AttributeUse, _super);

    function AttributeUse() {
      _ref = AttributeUse.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AttributeUse.prototype.modelName = "AttributeUse";

    AttributeUse.prototype.tableName = "m_attributeuse";

    AttributeUse.prototype.entityName = "AttributeUse";

    AttributeUse.prototype.source = "org.openbravo.model.common.plm.AttributeUse";

    AttributeUse.prototype.dataLimit = 300;

    return AttributeUse;

  })(OB.Data.ExtensibleModel);

  AttributeUse.addProperties([
    {
      name: "id",
      column: "m_attributeuse_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "attribute",
      column: "m_attribute_id",
      type: "TEXT"
    }, {
      name: "attributeSet",
      column: "m_attributeset_id",
      type: "TEXT"
    }, {
      name: "sequenceNumber",
      column: "seqno",
      type: "TEXT"
    }, {
      name: '_identifier',
      column: '_identifier',
      filter: true,
      type: 'TEXT'
    }
  ]);

  OB.Data.Registry.registerModel(AttributeUse);

}).call(this);
