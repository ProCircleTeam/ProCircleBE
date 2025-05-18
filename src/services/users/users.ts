import { authenticate } from '@feathersjs/authentication'
import { KnexService } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { User } from './users.schema'
import bcrypt from 'bcrypt'

export const userPath = '/v1/users'

export class UserService extends KnexService<User> {
  //@ts-ignore
  async create(data: Partial<User>, params?: any) {
    // --- Validation ---
    const email = data.email?.toLowerCase()
    if (!email) return Promise.reject(new Error('Email is required'))
    if (!data.password) return Promise.reject(new Error('Password is required'))
    if (!data.name) return Promise.reject(new Error('Name is required'))

    const knex = this.Model
    const existing = await knex('users').where({ email }).first()
    if (existing) return Promise.reject(new Error('Email already exists'))

    // --- Hash password ---
    const hash = await bcrypt.hash(data.password, 10)

    // --- Assign code name ---
    const codeNameRow = await knex('code_names').where({ assigned: false }).orderByRaw('RANDOM()').first()
    if (!codeNameRow) return Promise.reject(new Error('No available code names'))
    await knex('code_names').where({ id: codeNameRow.id }).update({ assigned: true })

    // --- Save user ---
    const user = await super.create({
      email,
      password: hash,
      name: data.name,
      code_name_id: codeNameRow.id
    }, params)

    // --- Prepare response ---
    const { password: _pw, code_name_id, ...userRest } = user
    return { ...userRest, code_name: codeNameRow.name }
  }
}

export const users = (app: Application) => {
  const userService = new UserService({
    id: 'id',
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'users'
  })

  app.use(userPath, userService)
  app.use('users', userService) // Register for internal reference

  // Get our initialized service
  const service = app.service('users')

  service.hooks({
    around: {
      all: [],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    }
  })
}
