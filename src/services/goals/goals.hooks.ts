import { authenticate } from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'

const setTimestamps = async (context: HookContext) => {
  const now = new Date().toISOString()
  
  if (context.type === 'before') {
    if (context.method === 'create') {
      context.data.createdAt = now
      context.data.updatedAt = now
    } else if (context.method === 'update' || context.method === 'patch') {
      context.data.updatedAt = now
    }
  }
  
  return context
}

export const goalsHooks = {
  around: {
    all: [authenticate('jwt')]
  },
  before: {
    all: [],
    find: [],
    get: [],
    create: [setTimestamps],
    update: [setTimestamps],
    patch: [setTimestamps],
    remove: []
  },
  after: {
    all: []
  },
  error: {
    all: []
  }
}
