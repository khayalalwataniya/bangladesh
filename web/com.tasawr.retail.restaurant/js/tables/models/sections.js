(function() {
  var Printprodcode, Section, _ref, _ref1,
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

    Section.prototype.url = '../../org.openbravo.service.json.jsonrest/TSRR_Section';

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

  Printprodcode = (function(_super) {
    __extends(Printprodcode, _super);

    function Printprodcode() {
      _ref1 = Printprodcode.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Printprodcode.prototype.modelName = "Printprodcode";

    Printprodcode.prototype.tableName = "tsrr_printprodcode";

    Printprodcode.prototype.entityName = "TSRR_Printprodcode";

    Printprodcode.prototype.url = '../../org.openbravo.service.json.jsonrest/TSRR_Printprodcode';

    Printprodcode.prototype.source = "com.tasawr.retail.restaurant.data.Printprodcode";

    Printprodcode.prototype.dataLimit = 300;

    return Printprodcode;

  })(OB.Data.ExtensibleModel);

  Printprodcode.addProperties([
    {
      name: "id",
      column: "tsrr_printprodcode_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "pOSTerminal",
      column: "obpos_applications_id",
      type: "TEXT"
    }, {
      name: "product",
      column: "m_product_id",
      type: "TEXT"
    }, {
      name: "printCode",
      column: "print_code",
      type: "TEXT"
    }, {
      name: "printerProperty",
      column: "printer_property",
      type: "TEXT"
    }
  ]);

  OB.Data.Registry.registerModel(Printprodcode);

}).call(this);
