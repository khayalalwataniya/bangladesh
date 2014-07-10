(function() {
  var Section, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Section = (function(_super) {
    __extends(Section, _super);

    function Section() {
      _ref = Section.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Section.prototype.modelName = "Section";

    Section.prototype.tableName = "tsrr_section";

    Section.prototype.entityName = "TSRR_Section";

    Section.prototype.url = '/openbravo/org.openbravo.service.json.jsonrest/TSRR_Section';

    Section.prototype.source = "com.tasawr.retail.restaurant.data.Section";

    Section.prototype.dataLimit = 300;

    return Section;

  })(OB.Data.ExtensibleModel);

  Section.addProperties([
    {
      name: "id",
      column: "tsrr_section_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "name",
      column: "name",
      type: "TEXT"
    }
  ]);

  OB.Data.Registry.registerModel(Section);

}).call(this);
