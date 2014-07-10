(function() {
  var BookingInfo, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BookingInfo = (function(_super) {
    __extends(BookingInfo, _super);

    function BookingInfo() {
      _ref = BookingInfo.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BookingInfo.prototype.modelName = "BookingInfo";

    BookingInfo.prototype.tableName = "tsrr_booking_info";

    BookingInfo.prototype.entityName = "TSRR_BookingInfo";

    BookingInfo.prototype.url = '../../org.openbravo.service.json.jsonrest/TSRR_BookingInfo';

    BookingInfo.prototype.source = "com.tasawr.retail.restaurant.data.BookingInfo";

    BookingInfo.prototype.dataLimit = 300;

    BookingInfo.prototype._id = 'modelbookinginfo';

    BookingInfo.prototype.initialize = function(attributes) {
      var bookinginfoId;
      bookinginfoId = void 0;
      if (attributes && attributes.id && attributes.json) {
        bookinginfoId = attributes.id;
        attributes = JSON.parse(attributes.json);
        attributes.id = bookinginfoId;
      }
      if (attributes && attributes.salesOrder) {
        this.set("undo", attributes.undo);
        if (attributes.id) {
          this.set("id", attributes.id);
        }
        if (attributes.restaurantTable) {
          this.set("restaurantTable", attributes.restaurantTable);
        }
        if (attributes.salesOrder) {
          this.set("salesOrder", attributes.salesOrder);
        }
        if (attributes.businessPartner) {
          this.set("businessPartner", attributes.businessPartner);
        }
        if (attributes.orderidlocal) {
          this.set("orderidlocal", attributes.orderidlocal);
        }
        if (attributes.ebid) {
          this.set("ebid", attributes.ebid);
        }
        _.each(_.keys(attributes), (function(key) {
          if (!this.has(key)) {
            this.set(key, attributes[key]);
          }
        }), this);
      } else {
        this.clearBookingInfoAttributes();
      }
    };

    BookingInfo.prototype.clear = function() {
      this.clearBookingInfoAttributes();
      this.trigger("change");
      this.trigger("clear");
    };

    BookingInfo.prototype.clearBookingInfoAttributes = function() {
      this.set("id", null);
      this.set("restaurantTable", null);
      this.set("salesOrder", null);
      this.set("businessPartner", null);
      this.set("orderidlocal", null);
      return this.set("ebid", null);
    };

    BookingInfo.prototype.save = function() {
      var me, undoCopy, _ref1, _ref2, _ref3;
      me = this;
      undoCopy = void 0;
      if (this.attributes.json) {
        delete this.attributes.json;
      }
      undoCopy = this.get("undo");
      this.unset("undo");
      this.set('restaurantTable', (_ref1 = this.get('restaurantTable')) != null ? _ref1.id : void 0);
      this.set('businessPartner', (_ref2 = this.get('businessPartner')) != null ? _ref2.id : void 0);
      this.set('salesOrder', (_ref3 = this.get('salesOrder')) != null ? _ref3.id : void 0);
      this.set('orderidlocal', this.get('orderidlocal'));
      this.set('ebid', this.get('ebid'));
      if (!OB.POS.modelterminal.get("preventOrderSave")) {
        OB.Dal.save(this, (function() {
          return me.trigger("sync");
        }), function() {
          console.error(arguments);
        });
      }
      this.set("undo", undoCopy);
    };

    BookingInfo.prototype.clearWith = function(_bookingInfo) {
      var me, undf;
      me = this;
      undf = void 0;
      if (_bookingInfo === null) {
        this.set("id", null);
        this.set("restaurantTable", null);
        this.set("salesOrder", null);
        this.set("businessPartner", null);
        this.set("orderidlocal", null);
        this.set("ebid", null);
      } else {
        _.each(_.keys(_bookingInfo.attributes), function(key) {
          if (_bookingInfo.get(key) !== undf) {
            if (_bookingInfo.get(key) === null) {
              me.set(key, null);
            } else if (_bookingInfo.get(key).at) {
              me.get(key).reset();
              _bookingInfo.get(key).forEach(function(elem) {
                me.get(key).add(elem);
              });
            } else {
              me.set(key, _bookingInfo.get(key));
            }
          }
        });
      }
      this.set("isEditable", _bookingInfo.get("isEditable"));
      this.trigger("change");
      this.trigger("clear");
    };

    BookingInfo.prototype.loadByJSON = function(obj) {
      var me, undf;
      me = this;
      undf = void 0;
      _.each(_.keys(me.attributes), function(key) {
        if (obj[key] !== undf) {
          if (obj[key] === null) {
            me.set(key, null);
          } else {
            me.set(key, obj[key]);
          }
        }
      });
    };

    BookingInfo.prototype.serializeToJSON = function() {
      return JSON.parse(JSON.stringify(this.toJSON()));
    };

    return BookingInfo;

  })(OB.Data.ExtensibleModel);

  BookingInfo.addProperties([
    {
      name: "id",
      column: "tsrr_booking_info_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "restaurantTable",
      column: "tsrr_table_id",
      type: "TEXT"
    }, {
      name: "businessPartner",
      column: "c_bpartner_id",
      type: "TEXT"
    }, {
      name: "salesOrder",
      column: "c_order_id",
      type: "TEXT"
    }, {
      name: "orderidlocal",
      column: "orderidlocal",
      type: "TEXT"
    }, {
      name: "ebid",
      column: "ebid",
      type: "TEXT"
    }, {
      name: "_identifier",
      column: "_identifier",
      type: "TEXT"
    }
  ]);

  OB.Data.Registry.registerModel(BookingInfo);

}).call(this);
