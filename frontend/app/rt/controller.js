import Controller from '@ember/controller'
import { computed } from '@ember/object'

import ENV from 'customer-center/config/environment'

export default Controller.extend({
  queryParams: [{ page: { type: 'number' }, page_size: { type: 'number' } }],
  headers: computed(function() {
    return [
      {
        type: 'sort',
        title: 'rt.ticket.effectiveid',
        attr: 'effectiveid'
      },
      {
        type: 'search',
        title: 'rt.ticket.subject',
        attr: 'subject'
      },
      {
        type: 'sort',
        title: 'rt.ticket.status',
        attr: 'status',
        customFilter: this._sortStatus
      },
      {
        type: 'sort',
        title: 'rt.ticket.updated',
        attr: 'updated',
        customFilter: this._sortDate
      },
      {
        type: 'sort',
        title: 'rt.ticket.created',
        attr: 'created',
        customFilter: this._sortDate
      },
      {
        type: 'search',
        title: 'rt.ticket.creator',
        attr: 'creator',
        customFilter: this._searchUser
      },
      {
        type: 'search',
        title: 'rt.ticket.owner',
        attr: 'owner',
        customFilter: this._searchUser
      }
    ]
  }),

  init() {
    this._super(...arguments)
    this.set('pageSizes', ENV.APP.rt.pageSizes)
  },

  pageSize: computed('page_size', function() {
    return this.page_size || 10
  }),

  actions: {
    loadPage(page) {
      this.set('page', page)
    },
    setPageSize(page_size) {
      this.setProperties({ page: 1, page_size })
    }
  },

  _searchUser(data, search) {
    return data.filter(model =>
      model
        .get(
          search.attr +
            (model.get(search.attr + '.fullName') ? '.fullName' : '.username')
        )
        .toLowerCase()
        .includes(search.term.trim().toLowerCase())
    )
  },

  _sortStatus(data, { order, attr }) {
    const states = ['new', 'open', 'stalled', 'resolved', 'rejected', 'deleted']
    return data.toArray().sort((a, b) => {
      if (order === 'asc') {
        return (
          states.findIndex(s => s === a.get(attr)) -
          states.findIndex(s => s === b.get(attr))
        )
      } else if (order === 'desc') {
        return (
          states.findIndex(s => s === b.get(attr)) -
          states.findIndex(s => s === a.get(attr))
        )
      }
    })
  },

  _sortDate(data, { order, attr }) {
    return data.toArray().sort((a, b) => {
      if (order === 'asc') {
        return a.get(attr) - b.get(attr)
      } else if (order === 'desc') {
        return b.get(attr) - a.get(attr)
      }
    })
  }
})
