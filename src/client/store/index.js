import SubX from 'subx'
import fetch from '../components/fetch'
import _ from 'lodash'

const url = window.rc.server + '/skill/olc/olc'
const store = SubX.create({
  botInfo: window.rc.botInfo,
  olcs: [],
  fetchingUser: false,
  loading: false,
  async list () {
    store.fetchingUser = true
    let res = await fetch.post(url, {
      action: 'list'
    })
    store.fetchingUser = false
    if (res && res.result) {
      store.olcs = res.result
      return true
    }
    return false
  },
  async add (olc) {
    let res = await fetch.post(url, {
      action: 'add',
      update: olc
    })
    if (res && res.result) {
      store.olcs.unshift(res.result)
      return true
    }
    return false
  },
  async del (id) {
    let res = await fetch.post(url, {
      action: 'del',
      id
    })
    if (res && res.result) {
      store.olcs = store.olcs.filter(d => d.id !== id)
      return true
    }
    return false
  },
  async update (id, update) {
    let res = await fetch.post(url, {
      action: 'update',
      id,
      update
    })
    if (res && res.result) {
      let inst = _.find(store.olcs, d => d.id === id)
      Object.assign(inst, update)
      return true
    }
    return false
  },
  async getUser () {
    store.fetchingUser = true
    await fetch.post(window.rc.server + '/api/action', {
      action: 'get-user'
    }, {
      handleErr: () => {
        console.log('fetch user error')
        window.location.href = window.rc.redirect
      }
    })
    store.fetchingUser = false
  }
})

export default store
