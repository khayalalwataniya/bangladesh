#global B,_

OB = window.OB or {}
OB.DATA = window.OB.DATA or {}

OB.DATA.BookingInfoSave = (model) ->
	@context = model
	@bookingInfo = model.get("bookingInfo")
	@bookingInfo.on "bookingInfoSaved", (->
		me = this
		bookingInfoList = undefined
		bookingInfoId = @bookingInfo.get("id")
		isNew = false
		bookingInfoToSave = new OB.Model.ChangedBookingInfo()
		bookingInfoListToChange = undefined
		bookingInfoToSave.set "isbeingprocessed", "N"
		if bookingInfoId
			@bookingInfo.set "posTerminal", OB.POS.modelterminal.get("terminal").id
			bookingInfoToSave.set "json", JSON.stringify(@bookingInfo.serializeToJSON())
			bookingInfoToSave.set "tsrr_booking_info_id", @bookingInfo.get("id")
		else
			isNew = true

		OB.Dal.save @bookingInfo, (->
			errorCallback = (tx, error) ->
				OB.error tx
				return
			successCallbackBPs = (dataBIs) ->
				if dataBIs.length is 0
					OB.Dal.get OB.Model.BookingInfo, me.bookingInfo.get("id"), (success = (dataBIs) ->
						dataBIs.set "bId", me.bookingInfo.get("id")
						OB.Dal.save dataBIs, (->
						), (tx) ->
							OB.error tx
							return

						return
					), error = (tx) ->
						OB.error tx
						return

				return
			criteria = {}
			criteria._whereClause = "where tsrr_booking_info_id = '" + me.bookingInfo.get("id") + "'"
			criteria.params = []
			OB.Dal.find OB.Model.BookingInfo, criteria, successCallbackBPs, errorCallback
			if isNew
				me.bookingInfo.set "posTerminal", OB.POS.modelterminal.get("terminal").id
				bookingInfoToSave.set "json", JSON.stringify(me.bookingInfo.serializeToJSON())
				bookingInfoToSave.set "tsrr_booking_info_id", me.bookingInfo.get("id")
			bookingInfoToSave.set "isbeingprocessed", "Y"  if OB.POS.modelterminal.get("connectedToERP")
			OB.Dal.save bookingInfoToSave, (->
				bookingInfoToSave.set "json", me.bookingInfo.serializeToJSON()
				OB.UTIL.showSuccess OB.I18N.getLabel("OBPOS_bookingInfoChnSavedSuccessfullyLocally",
					[me.bookingInfo.get("_identifier")])  if OB.POS.modelterminal.get("connectedToERP") is false
				if OB.POS.modelterminal.get("connectedToERP")
					successCallback = undefined
					errorCallback = undefined
					List = undefined
					successCallback = ->
						OB.UTIL.showSuccess OB.I18N.getLabel("OBPOS_bookingInfoSaved", [me.bookingInfo.get("_identifier")])
						return

					bookingInfoListToChange = new OB.Collection.ChangedBookingInfoList()
					bookingInfoListToChange.add bookingInfoToSave
					OB.UTIL.processBookingInfo bookingInfoListToChange, successCallback, null
				return
			), ->
				OB.UTIL.showError OB.I18N.getLabel("OBPOS_errorSavingBookingInfoChn", [me.bookingInfo.get("_identifier")])
				return

			return
		), ->
			#error saving BI Location with new values
			OB.error arguments
			OB.UTIL.showError OB.I18N.getLabel("OBPOS_errorSavingBookingInfoLocally", [me.bookingInfo.get("_identifier")])
			return

		return
	), this
	return

