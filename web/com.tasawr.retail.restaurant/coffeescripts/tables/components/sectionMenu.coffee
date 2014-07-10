# Section Menu Item
enyo.kind
  name: 'TSRR.Tables.SectionMenuItem'
  kind: 'OB.UI.MenuAction'
  #route:
  #permission:
  events:
    onSelectSection: ''

  initComponents: ->
    @label = @model.get 'name'
    @inherited arguments

  tap: (inSender, inEvent) ->
    yes if @disabled
    # Manual dropdown menu closure
    @parent.hide()
    # Sending the event to the components above this one
    @bubble 'onSelectSection'

# Section Menu
enyo.kind
  name: 'TSRR.Tables.SectionMenu'
  icon: 'btn-icon btn-icon-menu'
  components: [
    kind: 'onyx.MenuDecorator'
    name: 'btnContextMenu'
    components: [
      kind: 'OB.UI.ButtonContextMenu'
      name: 'toolbarButton'
    ,
      kind: 'onyx.Menu'
      classes: 'dropdown'
      name: 'menu'
      maxHeight: 600
      scrolling: false
      floating: true
    ]
  ]

  onButtonTap: ->
    @$.toolbarButton.removeClass 'btn-over' if @$.toolbarButton.hasClass 'btn-over'

  initComponents: ->
    @inherited arguments

  init: (model) ->
    @inherited arguments
    @model = model
    @model.sections.on 'reset', @renderAll, @

  dalError: (tx, error) =>
    OB.UTIL.showError "OBDAL error: #{error}"

  renderAll: (sections) ->
    @renderOne section for section in sections.models

  renderOne: (section) ->
    @$.menu.createComponent
      kind: 'TSRR.Tables.SectionMenuItem'
      model: section

  destory: ->
    @model.sections.off 'reset'
    @inherited arguments
