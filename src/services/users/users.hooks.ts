import { hooks as schemaHooks } from '@feathersjs/schema';
import { userDataValidator } from './users.schema'
import { authenticate } from '@feathersjs/authentication'


export const userHooks = {
  around: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [ schemaHooks.validateData(userDataValidator)],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt'),],
    remove: [authenticate('jwt')]
  }
}
