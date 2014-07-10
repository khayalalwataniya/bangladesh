(function() {
  var Attribute, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Attribute = (function(_super) {
    __extends(Attribute, _super);

    function Attribute() {
      _ref = Attribute.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Attribute.prototype.modelName = "Attribute";

    Attribute.prototype.tableName = "m_attribute";

    Attribute.prototype.entityName = "Attribute";

    Attribute.prototype.source = "org.openbravo.model.common.plm.Attribute";

    Attribute.prototype.dataLimit = 300;

    return Attribute;

  })(OB.Data.ExtensibleModel);

  Attribute.addProperties([
    {
      name: "id",
      column: "m_attribute_id",
      primaryKey: true,
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
      name: "mandatory",
      column: "ismandatory",
      type: "TEXT"
    }, {
      name: "instanceAttribute",
      column: "isinstanceattribute",
      type: "TEXT"
    }, {
      name: "list",
      column: "islist",
      type: "TEXT"
    }, {
      name: '_identifier',
      column: '_identifier',
      filter: true,
      type: 'TEXT'
    }
  ]);

  OB.Data.Registry.registerModel(Attribute);

}).call(this);
