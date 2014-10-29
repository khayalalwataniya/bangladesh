#lineStatusChangePossible = (line, newStatus)->
#
#      currentStatus = localStorage.getItem line.cid
#
#      if currentStatus is 'Not sent' and newStatus is 'send'
#          return true
#      else if currentStatus is 'sent' and newStatus is 'hold' or 'cancel'
#          return true
#      else if currentStatus is 'held' and newStatus is 'cancelled' or 'fired'
#          return true
#      else if currentStatus is 'cancelled' and newStatus is 'send'
#          return true
#      else
#        return false
#
