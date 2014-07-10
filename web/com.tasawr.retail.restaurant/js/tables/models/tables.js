(function() {
  var Table, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Table = (function(_super) {
    var errorCallback, successCallback;

    __extends(Table, _super);

    function Table() {
      _ref = Table.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Table.prototype.modelName = "Table";

    Table.prototype.tableName = "tsrr_table";

    Table.prototype.entityName = "TSRR_Table";

    Table.prototype.url = '../../org.openbravo.service.json.jsonrest/TSRR_Table';

    Table.prototype.source = "com.tasawr.retail.restaurant.data.Table";

    Table.prototype.dataLimit = 300;

    Table.prototype._id = 'modeltable';

    Table.prototype.initialize = function(attributes) {
      var tableId;
      tableId = void 0;
      if (attributes && attributes.id && attributes.json) {
        tableId = attributes.id;
        attributes = JSON.parse(attributes.json);
        attributes.id = tableId;
      }
      if (attributes && attributes.tsrrSection) {
        this.set("undo", attributes.undo);
        if (attributes.id) {
          this.set("id", attributes.id);
        }
        if (attributes.tsrrSection) {
          this.set("tsrrSection", attributes.tsrrSection);
        }
        if (attributes.name) {
          this.set("name", attributes.name);
        }
        if (attributes.chairs) {
          this.set("chairs", attributes.chairs);
        }
        if (attributes.smokingType) {
          this.set("smokingType", attributes.smokingType);
        }
        if (attributes.locked) {
          this.set("locked", attributes.locked);
        }
        if (attributes.locker) {
          this.set("locker", attributes.locker);
        }
        _.each(_.keys(attributes), (function(key) {
          if (!this.has(key)) {
            this.set(key, attributes[key]);
          }
        }), this);
      } else {
        this.clearTableAttributes();
      }
    };

    Table.prototype.clear = function() {
      this.clearTableAttributes();
      this.trigger("change");
      this.trigger("clear");
    };

    Table.prototype.clearTableAttributes = function() {
      this.set("id", null);
      this.set("name", null);
      this.set("chairs", null);
      this.set("smokingType", null);
      this.set("locked", null);
      this.set("locker", null);
      return this.set("tsrrSection", null);
    };

    Table.prototype.save = function() {
      var me, undoCopy, _ref1;
      me = this;
      undoCopy = void 0;
      if (this.attributes.json) {
        delete this.attributes.json;
      }
      undoCopy = this.get("undo");
      this.unset("undo");
      this.set('tsrrSection', (_ref1 = this.get('tsrrSection')) != null ? _ref1.id : void 0);
      this.set('name', this.get('name'));
      this.set('chairs', this.get('chairs'));
      this.set('smokingType', this.get('smokingType'));
      this.set('locked', this.get('locked'));
      this.set('locker', this.get('locker'));
      if (!OB.POS.modelterminal.get("preventOrderSave")) {
        OB.Dal.save(this, (function() {
          return me.trigger("sync");
        }), function() {
          console.error(arguments);
        });
      }
      this.set("undo", undoCopy);
    };

    Table.prototype.postToOrderAPI = function(salesOrder) {
      var me, now, orderData;
      me = this;
      now = new Date();
      orderData = {
        data: [
          {
            "_entityName": "Order",
            "modelorder": salesOrder.id,
            "documentType": OB.POS.modelterminal.attributes.terminal.terminalType.documentType,
            "transactionDocument": OB.POS.modelterminal.attributes.terminal.terminalType.documentType,
            "orderDate": OB.I18N.formatDate(now),
            "accountingDate": OB.I18N.formatDate(now),
            "businessPartner": OB.POS.modelterminal.attributes.businessPartner.id,
            "partnerAddress": OB.POS.modelterminal.attributes.businessPartner.attributes.locId,
            "currency": OB.POS.modelterminal.attributes.currency.id,
            "paymentTerms": OB.POS.modelterminal.attributes.terminal.defaultbp_paymentterm,
            "warehouse": OB.POS.modelterminal.attributes.terminal.warehouse,
            "priceList": OB.POS.modelterminal.attributes.terminal.priceList,
            "documentStatus": "DR",
            "organization": OB.POS.modelterminal.attributes.businessPartner.attributes.organization,
            "session": OB.POS.modelterminal.get("session")
          }
        ]
      };
      OB.info('posting to salesOrder api');
      OB.info(orderData);
      return $.ajax("../../org.openbravo.service.json.jsonrest/Order", {
        data: JSON.stringify(orderData),
        type: "POST",
        processData: false,
        contentType: "application/json",
        success: function(rsp) {
          OB.info('salesOrder posted successfully with ID: ');
          TSRR.Tables.Config.currentRemoteOrderId = arguments[0].response.data[0].id;
          return me.postToBookingAPI(me, salesOrder, TSRR.Tables.Config.currentRemoteOrderId);
        },
        error: function() {
          console.error('could not post salesOrder');
          return console.log(arguments);
        }
      });
    };

    Table.prototype.postToBookingAPI = function(restaurantTable, localOrder, currentRemoteOrderId) {
      var data;
      data = {
        data: [
          {
            _entityName: "TSRR_BookingInfo",
            restaurantTable: restaurantTable.id,
            businessPartner: OB.POS.modelterminal.attributes.businessPartner.id,
            salesOrder: currentRemoteOrderId,
            orderidlocal: localOrder.id
          }
        ]
      };
      OB.info('posting to booking info api');
      OB.info(data);
      return $.ajax("../../org.openbravo.service.json.jsonrest/TSRR_BookingInfo", {
        data: JSON.stringify(data),
        type: "POST",
        processData: false,
        contentType: "application/json",
        success: function(resp) {
          var bId, bi;
          bId = arguments[0].response.data[0].id;
          OB.info('bookingInfo posted successfully with BID: ' + bId);
          console.log(arguments);
          bi = new OB.Model.BookingInfo();
          bi.set('businessPartner', OB.POS.modelterminal.attributes.businessPartner);
          bi.set('salesOrder', localOrder);
          bi.set('orderidlocal', currentRemoteOrderId);
          bi.set('restaurantTable', restaurantTable);
          bi.set('ebid', bId);
          bi.set('id', bId);
          return bi.save();
        },
        error: function() {
          console.error('could not post BookingInfo');
          return console.log(arguments);
        }
      });
    };

    successCallback = function(model) {
      return console.info(arguments);
    };

    errorCallback = function(tx, error) {
      return console.error(arguments);
    };

    Table.prototype.clearWith = function(_table) {
      var me, undf;
      me = this;
      undf = void 0;
      if (_table === null) {
        this.set("id", null);
        this.set("name", null);
        this.set("chairs", null);
        this.set("smokingType", null);
        this.set("locked", null);
        this.set("locker", null);
        this.set("tsrrSection", null);
      } else {
        _.each(_.keys(_table.attributes), function(key) {
          if (_table.get(key) !== undf) {
            if (_table.get(key) === null) {
              me.set(key, null);
            } else if (_table.get(key).at) {
              me.get(key).reset();
              _table.get(key).forEach(function(elem) {
                me.get(key).add(elem);
              });
            } else {
              me.set(key, _table.get(key));
            }
          }
        });
      }
      this.set("isEditable", _table.get("isEditable"));
      this.trigger("change");
      this.trigger("clear");
    };

    Table.prototype.setBusinessPartnerAndCreateOrder = function(businessPartner) {
      var bi, me, orderList, salesOrder;
      OB.info('CREATING... order and booking');
      me = this;
      orderList = new OB.Collection.OrderList();
      salesOrder = orderList.newOrder();
      salesOrder.set('bp', businessPartner);
      salesOrder.set('restaurantTable', me);
      salesOrder.save();
      bi = new OB.Model.BookingInfo();
      bi.set('businessPartner', businessPartner);
      bi.set('salesOrder', salesOrder);
      bi.set('orderidlocal', salesOrder.id);
      bi.set('ebid', salesOrder.id);
      bi.set('restaurantTable', me);
      bi.save();
      TSRR.Tables.Config.currentOrderId = salesOrder.get('id');
      TSRR.Tables.Config.currentOrder = salesOrder;
      TSRR.Tables.Config.currentTable = me;
      TSRR.Tables.Config.currentBookingInfo = bi;
      return salesOrder;
    };

    Table.prototype.loadByJSON = function(obj) {
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

    Table.prototype.serializeToJSON = function() {
      return JSON.parse(JSON.stringify(this.toJSON()));
    };

    return Table;

  })(OB.Data.ExtensibleModel);

  Table.addProperties([
    {
      name: "id",
      column: "tsrr_table_id",
      primaryKey: true,
      type: "TEXT"
    }, {
      name: "tsrrSection",
      column: "tsrr_section_id",
      type: "TEXT"
    }, {
      name: "name",
      column: "name",
      type: "TEXT"
    }, {
      name: "chairs",
      column: "chairs",
      type: "NUMERIC"
    }, {
      name: "smokingType",
      column: "smokingType",
      type: "TEXT"
    }, {
      name: "locked",
      column: "locked",
      type: "TEXT"
    }, {
      name: "locker",
      column: "locker",
      type: "TEXT"
    }, {
      name: "_identifier",
      column: "_identifier",
      type: "TEXT"
    }
  ]);

  OB.Data.Registry.registerModel(Table);

}).call(this);
