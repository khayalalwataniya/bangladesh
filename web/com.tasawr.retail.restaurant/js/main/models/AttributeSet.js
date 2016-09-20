(function() {
  var AttributeSet, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AttributeSet = (function(_super) {
    __extends(AttributeSet, _super);

    function AttributeSet() {
      _ref = AttributeSet.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AttributeSet.prototype.modelName = "AttributeSet";

    AttributeSet.prototype.tableName = "m_attributeset";

    AttributeSet.prototype.entityName = "AttributeSet";

    AttributeSet.prototype.source = "org.openbravo.model.common.plm.AttributeSet";

    AttributeSet.prototype.dataLimit = 300;

    AttributeSet.prototype.local = true;

    return AttributeSet;

  })(OB.Data.ExtensibleModel);

  AttributeSet.addProperties([
    {
      name: "id",
      column: "m_attributeset_id",
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
      name: "serialNo",
      column: "isserno",
      type: "TEXT"
    }, {
      name: "serialNoControl",
      column: "m_sernoctl_id",
      type: "TEXT"
    }, {
      name: "lot",
      column: "islot",
      type: "TEXT"
    }, {
      name: "lotControl",
      column: "m_lotctl_id",
      type: "TEXT"
    }, {
      name: "expirationDate",
      column: "isguaranteedate",
      type: "TEXT"
    }, {
      name: "guaranteedDays",
      column: "guaranteedays",
      type: "TEXT"
    }, {
      name: "lockedInWarehouse",
      column: "islockable",
      type: "TEXT"
    }, {
      name: "requireAtLeastOneValue",
      column: "isoneattrsetvalrequired",
      type: "TEXT"
    }, {
      name: '_identifier',
      column: '_identifier',
      filter: true,
      type: 'TEXT'
    }
  ]);

  OB.Data.Registry.registerModel(AttributeSet);

}).call(this);
