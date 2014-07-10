(function() {
  enyo.kind({
    name: 'TSRR.Tables.TableItem',
    classes: 'span4 table-item',
    amount: 0,
    components: [
      {
        name: 'table',
        kind: 'TSRR.Tables.WebPOSComponent'
      }
    ],
    events: {
      onSelectTable: ''
    },
    create: function() {
      this.inherited(arguments);
      this.model.on('change', this.updateTable, this);
      return this.updateTable();
    },
    initComponents: function() {
      return this.inherited(arguments);
    },
    tap: function(inSender, inEvent) {
      return this.bubble('onSelectTable');
    },
    updateTable: function() {
      var criteria, myTable, tableComponent,
        _this = this;
      myTable = this;
      tableComponent = this.$.table;
      console.log("" + (this.model.get('name')) + " is updated");
      tableComponent.setLabel(this.model.get('name'));
      tableComponent.setChairs(this.model.get('chairs'));
      tableComponent.setSmoking(this.model.get('smokingType'));
      tableComponent.setAmount(myTable.amount);
      if (this.model.get('locked')) {
        console.log('table ' + this.model.get('name') + ' is locked');
        tableComponent.removeClass('empty');
        tableComponent.addClass('locked');
        if (OB.POS.modelterminal.usermodel.get('id') === this.model.get('locker')) {
          tableComponent.setDisabled(false);
          tableComponent.setLocker('locked by me');
        } else {
          tableComponent.setDisabled(true);
          tableComponent.setLocker('locked by others');
        }
      } else {
        console.log('not locked');
      }
      criteria = {
        restaurantTable: this.model.id
      };
      return OB.Dal.find(OB.Model.BookingInfo, criteria, (function(bookingInfos) {
        var bi, localOrderId, _i, _len, _ref, _results;
        if (bookingInfos && bookingInfos.length > 0) {
          tableComponent.setOrderCount(bookingInfos.length);
          _this.model.bookingInfoList = bookingInfos;
          tableComponent.removeClass('empty');
          tableComponent.addClass('active');
          _ref = bookingInfos.models;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            bi = _ref[_i];
            localOrderId = bi.get('salesOrder');
            OB.info('order found in current bookin info with ORDER ID: ' + localOrderId);
            _results.push(OB.Dal.get(OB.Model.Order, localOrderId, (function(localOrder) {
              OB.info('local order found with ID: ' + localOrder.get('id'));
              localOrder.calculateGross();
              myTable.amount += localOrder.getGross();
              OB.info('the amount for above orderID is: ' + myTable.amount);
              return tableComponent.setAmount(myTable.amount);
            }), function() {
              return console.error('something went wrong while fetching booking info for table : ' + _this.model.get('name'));
            }));
          }
          return _results;
        } else {
          tableComponent.setOrderCount(0);
          return OB.info('no booking info found');
        }
      }), function() {
        return console.error('something went wrong while fetching booking info for table : ' + _this.model.get('name'));
      });
    }
  });

  enyo.kind({
    name: 'TSRR.Attributes.AttributeItem',
    classes: 'span-cal empty span6',
    model: null,
    components: [
      {
        style: 'margin: 5px;',
        components: [
          {
            name: "attributeName"
          }, {
            name: "attributeValue"
          }
        ]
      }
    ],
    handlers: {
      onAttributeSelected: 'attributeSelected'
    },
    create: function() {
      var me, x, z;
      this.inherited(arguments);
      if (this.attributeName && this.attributeValues) {
        me = this;
        this.$.attributeName.setContent(this.attributeName);
        x = this.attributeValues.substring(1, this.attributeValues.length - 1);
        z = x.split(",");
        return _.each(z, function(attrVal) {
          return me.$.attributeValue.createComponent({
            kind: "TSRR.Buttons.Attributes",
            model: attrVal,
            attribs: me
          });
        });
      }
    },
    initComponents: function() {
      return this.inherited(arguments);
    },
    attributeSelected: function(inSender, inEvent) {
      return OB.info('attribute selected');
    }
  });

}).call(this);
