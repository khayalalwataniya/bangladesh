enyo.kind
  name: "TSRR.Tables.UI.LeftToolbarImpl"
  kind: "OB.UI.MultiColumn.Toolbar"
  showMenu: true
  showWindowsMenu: true

  buttons: [
    kind: "OB.UI.ToolbarButton"
    name: "btnHome"
    disabled: false
    i18nLabel: "TSRR_BackLabel"
    stepCount: 0
    span: 4
    tap: ->
      OB.POS.navigate "retail.pointofsale"
  ,
    kind: "OB.UI.ToolbarButton"
    name: "btnCancel"
    disabled: false
    i18nLabel: "OBMOBC_LblCancel"
    stepCount: 0
    span: 4
    tap: ->
      OB.POS.navigate "retail.pointofsale"
  ,
    kind: "OB.UI.ToolbarButton"
    name: "btnDone"
    disabled: false
    i18nLabel: "OBPOS_LblDone"
    stepCount: 0
    span: 4
    tap: ->
      OB.POS.navigate "/"
  ]

enyo.kind
  name: "TSRR.Tables.UI.RightToolbarImpl"
  kind: "OB.UI.MultiColumn.Toolbar"
  buttons: [
    kind: "OB.UI.ToolbarButton"
    name: "btnRestaurant"
    span: 12
    disabled: true
    i18nLabel: "TSRR_LblRestaurants"
  ]

# Main Tables UI
enyo.kind
  name: 'TSRR.Tables.UI.Tables'
  kind: 'OB.UI.WindowView'
  windowmodel: OB.Model.TablesWindow
  tag: 'tsrrSection'
  events:
    onShowPopup: ''
  published:
    orderList: null
    order: null
  handlers:
    onChangeBusinessPartner: 'changeBusinessPartner'
    onSelectSection: 'selectSection'
    onSelectTable: 'selectTable'
    onHideThisPopup: 'hideThisPopup'
  components: [
    # Top Bar
    classes: "row"
    components: [
      classes: "span6"
      kind: "TSRR.Tables.UI.LeftToolbarImpl"
      name: "leftToolbar"
    ,
      classes: "span6"
      kind: "TSRR.Tables.UI.RightToolbarImpl"
      name: "rightToolbar"
    ]
  ,
    classes: 'row'
    components: [
      classes: 'span10'
      components: [
        style: 'margin: 5px;'
        components: [
          name: 'caption'
          kind: 'OB.UI.Button'
          classes: 'btnkeyboard btnkeyboard-inactive '
          style: 'color: white; text-align: left; padding: 20px;'
          disabled: yes
          content: 'Please choose a section'
        ,
          # hidden stuff
          classes: 'row'
          name: 'modalcustomer'
          kind: 'OB.UI.ModalBusinessPartners'
        ]
      ]
    ,
      classes: 'span2'
      components: [
        style: 'margin: 5px'
        components: [
          name: 'sectionMenu'
          kind: 'TSRR.Tables.SectionMenu'
        ]
      ]
    ]
  ,
    # Tables
    classes: 'row'
    name: 'tables'
    components: []
  ]

  initComponents: ->
    @inherited arguments

  init: ->
    @inherited arguments
    if (window.localStorage.getItem 'currentSection')?
      @loadTablesFromSection new OB.Model.Section JSON.parse window.localStorage.getItem 'currentSection'

  selectSection: (inSender, inEvent) ->
    currentSection = inEvent.originator.model
    window.localStorage.setItem 'currentSection', JSON.stringify currentSection
    @loadTablesFromSection currentSection

  loadTablesFromSection: (tsrrSection) ->
    @$.caption.setContent tsrrSection.get 'name'
    criteria =
      tsrrSection: tsrrSection.id
    OB.Dal.find OB.Model.Table, criteria, @loadTables, @dalError, @

  loadTables: (tables, me) ->
    me.$.tables.destroyClientControls()
    me.loadTable.call me, table for table in tables.models
    me.$.tables.render()

  dalError: (tx, error) ->
    OB.UTIL.showError "OBDAL error: #{error}"

  loadTable: (table) ->
    @$.tables.createComponent
      kind: 'TSRR.Tables.TableItem'
      model: table

  selectTable: (inSender, inEvent) ->
    TSRR.Tables.Config.currentTable = inEvent.originator.model
    me = @
    me.currentTable = inEvent.originator.model
    if me.currentTable.bookingInfoList and me.currentTable.bookingInfoList.length > 0
      bi = me.currentTable.bookingInfoList.at 0
      TSRR.Tables.Config.currentOrderId = bi.get('salesOrder')
      OB.POS.navigate 'retail.pointofsale'
    else
#      me.doShowPopup popup: 'modalcustomer'
      #debugger
      me.doShowPopup
        popup: "modalcustomer"
        args:
          order: TSRR.Tables.Config.MyOrderList.current
          action: (dialog) ->
            console.log 'inside modal customer'
            return
#          owner: inSender.owner
#          order: TSRR.Tables.Config.MyOrderList.current

    return

  changeBusinessPartner: (inSender, inEvent) ->
    @currentBusinessPartner = inEvent.businessPartner
    @currentTable.setBusinessPartnerAndCreateOrder @currentBusinessPartner if @currentTable

  hideThisPopup: (inSender, inEvent) ->
    OB.info 'hiding table window'
    OB.POS.navigate 'retail.pointofsale'

  destroy: ->
    @inherited arguments

# Register the Menu Item
OB.POS.registerWindow
  windowClass: TSRR.Tables.UI.Tables
  route: 'retail.restaurantmode'
  menuPosition: 1
  online: true
  menuI18NLabel: "TSRR_LblRestaurants"
  permission: 'OBPOS_print.receipt'
