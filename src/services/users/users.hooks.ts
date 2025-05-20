import { hooks as schemaHooks } from '@feathersjs/schema';
import { userDataValidator } from './users.schema'
import { authenticate } from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

const checkEmailExists = async (context: HookContext) => {
  const { app, data } = context
  const knex = app.get('postgresqlClient')
  
  const existingUser = await knex('users')
    .where({ email: data.email.toLowerCase() })
    .first()

  if (existingUser) {
    throw new BadRequest('This email is already registered')
  }
  
  return context
}

export const userHooks = {
  around: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [schemaHooks.validateData(userDataValidator)],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },
  before: {
    all: [],
    find: [],
    get: [],
    create: [schemaHooks.validateData(userDataValidator), checkEmailExists],
    patch: [],
    remove: []
  }
}
