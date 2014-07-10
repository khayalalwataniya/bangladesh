(function() {
  var TablesWindow, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TablesWindow = (function(_super) {
    __extends(TablesWindow, _super);

    function TablesWindow() {
      this.dalError = __bind(this.dalError, this);
      this.handleSections = __bind(this.handleSections, this);
      _ref = TablesWindow.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TablesWindow.prototype.models = [OB.Model.Section, OB.Model.Table, OB.Model.BookingInfo];

    TablesWindow.prototype.init = function() {
      this.sections = new OB.Collection.SectionList();
      return OB.Dal.find(OB.Model.Section, null, this.handleSections, this.dalError);
    };

    TablesWindow.prototype.handleSections = function(sections) {
      return this.sections.reset(sections.models);
    };

    TablesWindow.prototype.dalError = function(tx, error) {
      return OB.UTIL.showError("OBDAL error: " + error);
    };

    return TablesWindow;

  })(OB.Model.WindowModel);

  OB.Model.TablesWindow = TablesWindow;

}).call(this);
