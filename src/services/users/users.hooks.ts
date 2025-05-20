import { hooks as schemaHooks } from '@feathersjs/schema';
import { userDataValidator } from './users.schema'
import { authenticate } from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import type { Knex } from 'knex'

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

const assignCodeName = async (context: HookContext) => {
  const { app } = context
  const knex: Knex = app.get('postgresqlClient')

  // Start a transaction since we need to make multiple updates atomically
  await knex.transaction(async (trx) => {
    // Get a random unassigned code name
    const codeName = await trx('code_names')
      .where({ assigned: false })
      .orderByRaw('RANDOM()')
      .first()

    if (!codeName) {
      throw new BadRequest('No code names available')
    }

    // Mark the code name as assigned
    await trx('code_names')
      .where({ id: codeName.id })
      .update({ assigned: true })

    // Assign the code name to the user
    context.data.code_name_id = codeName.id
  })

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
    create: [schemaHooks.validateData(userDataValidator), checkEmailExists, assignCodeName],
    patch: [],
    remove: []
  }
}
