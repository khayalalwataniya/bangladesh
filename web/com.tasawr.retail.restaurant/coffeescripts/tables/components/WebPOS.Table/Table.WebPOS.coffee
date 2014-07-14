enyo.kind
  name: 'TSRR.Tables.WebPOSComponent'
  kind: 'OB.UI.Button'
  classes: 'btnlink btnlink-toolbar webpos-table empty'
  components: [
    name: 'label'
    classes: 'label'
    content: ''
    tag: 'h4'
  ,
    tag: 'div'
    classes: 'btn-icon icon'
  ,
    name: 'amount'
    classes: 'text important amount'
    content: ''
    allowHtml: true
    tag: 'p'
  ,
    name: 'chairs'
    classes: 'text chairs'
    content: ''
    allowHtml: true
    tag: 'p'
  ,
    name: 'orderCount'
    classes: 'text orderCount'
    content: ''
    allowHtml: true
    tag: 'p'
  ,
    name: 'locker'
    classes: 'text locker hidden'
    content: ''
    tag: 'p'
  ,
    kind: "Group"
    tag: null
    defaultKind: "onyx.IconButton"
    components: [
      {
        name: 'lockIcon'
        src: "../../web/com.tasawr.retail.restaurant/images/unlock.png"
      }
      {
        name: 'bookingIcon'
        src: "../../web/com.tasawr.retail.restaurant/images/waiter-w.png"
      }
      {
        name: 'smokingIcon'
        src: "../../web/com.tasawr.retail.restaurant/images/no_smoking.png"
      }
    ]
  ]

  published:
    isEmpty: yes
    currentOrder: null

  create: ->
    @inherited arguments

  setLocker: (locker) ->
    @$.locker.setContent locker
    @$.lockIcon.setSrc '../../web/com.tasawr.retail.restaurant/images/lock.png'

  setChairs: (chairs) ->
    @$.chairs.setContent 'Chairs: <span class="badge">' + chairs + '</span>'

  setOrderCount: (orderCount) ->
    @$.orderCount.setContent 'Orders: <span class="badge">' + orderCount + '</span>'

  setLabel: (label) ->
    @$.label.setContent label

  setAmount: (amount) ->
    @$.amount.setContent( OB.POS.modelterminal.get('currency')._identifier + ' <span class="badge">' + amount.toFixed(2) + '</span> ')
    @$.bookingIcon.setSrc('../../web/com.tasawr.retail.restaurant/images/waiter.png') unless amount is 0

  setSmoking: (smoking) ->
    @$.smokingIcon.setSrc('../../web/com.tasawr.retail.restaurant/images/smoking.png') if smoking is 'Smoking'

  isEmptyChanged: (inOldValue) ->
    if @isEmpty
      @addClass 'empty'
    else
      @removeClass 'empty'


enyo.kind
  name: 'TSRR.Buttons.Attributes'
  kind: 'OB.UI.Button'
  classes: 'empty enyo-tool-decorator btnselect'
  components: [
    name: 'Attribute'
  ]

  create: ->
    @inherited arguments
    @$.Attribute.setContent @model


  tap: (inSender, inEvent) ->
    console.info @model
    console.info @attribs.attributeName
    localStorage.setItem 'productAttribute_' + @attribs.attributeName, @model.trim() if @attribs.attributeName
    _.each @parent.children, (child) ->
      child.removeClass 'attribute'
      child.addClass 'empty'

    if @getClassAttribute().match(/empty/).length > 0
      @removeClass 'empty'
      @addClass 'attribute'
