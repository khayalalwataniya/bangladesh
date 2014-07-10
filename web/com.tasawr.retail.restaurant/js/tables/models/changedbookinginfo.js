(function() {
  var ChangedBookingInfo, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ChangedBookingInfo = (function(_super) {
    __extends(ChangedBookingInfo, _super);

    function ChangedBookingInfo() {
      _ref = ChangedBookingInfo.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ChangedBookingInfo.prototype.modelName = "ChangedBookingInfo";

    ChangedBookingInfo.prototype.tableName = "tsrr_changedbookinginfo";

    ChangedBookingInfo.prototype.entityName = "";

    ChangedBookingInfo.prototype.source = "";

    ChangedBookingInfo.prototype.local = true;

    ChangedBookingInfo.prototype.properties = ["id", "json", "tsrr_booking_info_id", "isbeingprocessed"];

    ChangedBookingInfo.prototype.propertyMap = {
      id: "changedbookinginfo_id",
      json: "json",
      tsrr_booking_info_id: "tsrr_booking_info_id",
      isbeingprocessed: "isbeingprocessed"
    };

    ChangedBookingInfo.prototype.createStatement = "CREATE TABLE IF NOT EXISTS tsrr_changedbookinginfo (changedbookinginfo_id TEXT PRIMARY KEY, json TEXT, tsrr_booking_info_id TEXT, isbeingprocessed TEXT)";

    ChangedBookingInfo.prototype.dropStatement = "DROP TABLE IF EXISTS tsrr_changedbookinginfo";

    ChangedBookingInfo.prototype.insertStatement = "INSERT INTO tsrr_changedbookinginfo(changedbookinginfo_id, json, tsrr_booking_info_id, isbeingprocessed) VALUES (?,?,?,?)";

    return ChangedBookingInfo;

  })(Backbone.Model);

  OB.Data.Registry.registerModel(ChangedBookingInfo);

}).call(this);
