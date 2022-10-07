import { disallow } from 'feathers-hooks-common'
import { historyBundle, historyCreate, historyPurge } from '../../../hooks'
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [disallow('external')],
    find: [],
    get: [historyBundle('answerId', 'history')],
    create: [],
    update: [historyCreate('answerId', 'text')],
    patch: [],
    remove: [historyPurge('answerId')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
