import { authenticate } from '@feathersjs/authentication'
import { KnexService } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { User } from './users.schema'
import bcrypt from 'bcrypt'

export const userPath = 'users'

export class UserService extends KnexService<User> {
  //@ts-ignore
  async create(data: Partial<User>, params?: any) {
    // Hash password before storing
    const { password, ...rest } = data
    if (!password) throw new Error('Password is required')
    const hash = await bcrypt.hash(password, 10)

    // Assign a random, unassigned code_name
    const knex = this.Model // Knex instance
    const codeNameRow = await knex('code_names')
      .where({ assigned: false })
      .orderByRaw('RANDOM()')
      .first()
    if (!codeNameRow) {
      throw new Error('No available code names')
    }
    await knex('code_names').where({ id: codeNameRow.id }).update({ assigned: true })
    return super.create({ ...rest, password: hash, code_name_id: codeNameRow.id }, params)
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

  // Get our initialized service 
  const service = app.service(userPath)

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
