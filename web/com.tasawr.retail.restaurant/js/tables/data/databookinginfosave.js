(function() {
  var OB;

  OB = window.OB || {};

  OB.DATA = window.OB.DATA || {};

  OB.DATA.BookingInfoSave = function(model) {
    this.context = model;
    this.bookingInfo = model.get("bookingInfo");
    this.bookingInfo.on("bookingInfoSaved", (function() {
      var bookingInfoId, bookingInfoList, bookingInfoListToChange, bookingInfoToSave, isNew, me;
      me = this;
      bookingInfoList = void 0;
      bookingInfoId = this.bookingInfo.get("id");
      isNew = false;
      bookingInfoToSave = new OB.Model.ChangedBookingInfo();
      bookingInfoListToChange = void 0;
      bookingInfoToSave.set("isbeingprocessed", "N");
      if (bookingInfoId) {
        this.bookingInfo.set("posTerminal", OB.POS.modelterminal.get("terminal").id);
        bookingInfoToSave.set("json", JSON.stringify(this.bookingInfo.serializeToJSON()));
        bookingInfoToSave.set("tsrr_booking_info_id", this.bookingInfo.get("id"));
      } else {
        isNew = true;
      }
      OB.Dal.save(this.bookingInfo, (function() {
        var criteria, errorCallback, successCallbackBPs;
        errorCallback = function(tx, error) {
          OB.error(tx);
        };
        successCallbackBPs = function(dataBIs) {
          var error, success;
          if (dataBIs.length === 0) {
            OB.Dal.get(OB.Model.BookingInfo, me.bookingInfo.get("id"), (success = function(dataBIs) {
              dataBIs.set("bId", me.bookingInfo.get("id"));
              OB.Dal.save(dataBIs, (function() {}), function(tx) {
                OB.error(tx);
              });
            }), error = function(tx) {
              OB.error(tx);
            });
          }
        };
        criteria = {};
        criteria._whereClause = "where tsrr_booking_info_id = '" + me.bookingInfo.get("id") + "'";
        criteria.params = [];
        OB.Dal.find(OB.Model.BookingInfo, criteria, successCallbackBPs, errorCallback);
        if (isNew) {
          me.bookingInfo.set("posTerminal", OB.POS.modelterminal.get("terminal").id);
          bookingInfoToSave.set("json", JSON.stringify(me.bookingInfo.serializeToJSON()));
          bookingInfoToSave.set("tsrr_booking_info_id", me.bookingInfo.get("id"));
        }
        if (OB.POS.modelterminal.get("connectedToERP")) {
          bookingInfoToSave.set("isbeingprocessed", "Y");
        }
        OB.Dal.save(bookingInfoToSave, (function() {
          var List, successCallback;
          bookingInfoToSave.set("json", me.bookingInfo.serializeToJSON());
          if (OB.POS.modelterminal.get("connectedToERP") === false) {
            OB.UTIL.showSuccess(OB.I18N.getLabel("OBPOS_bookingInfoChnSavedSuccessfullyLocally", [me.bookingInfo.get("_identifier")]));
          }
          if (OB.POS.modelterminal.get("connectedToERP")) {
            successCallback = void 0;
            errorCallback = void 0;
            List = void 0;
            successCallback = function() {
              OB.UTIL.showSuccess(OB.I18N.getLabel("OBPOS_bookingInfoSaved", [me.bookingInfo.get("_identifier")]));
            };
            bookingInfoListToChange = new OB.Collection.ChangedBookingInfoList();
            bookingInfoListToChange.add(bookingInfoToSave);
            OB.UTIL.processBookingInfo(bookingInfoListToChange, successCallback, null);
          }
        }), function() {
          OB.UTIL.showError(OB.I18N.getLabel("OBPOS_errorSavingBookingInfoChn", [me.bookingInfo.get("_identifier")]));
        });
      }), function() {
        OB.error(arguments);
        OB.UTIL.showError(OB.I18N.getLabel("OBPOS_errorSavingBookingInfoLocally", [me.bookingInfo.get("_identifier")]));
      });
    }), this);
  };

}).call(this);
