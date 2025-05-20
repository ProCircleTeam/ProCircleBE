// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { goalsHooks } from './goals.hooks'

import {
  goalsDataValidator,
  goalsPatchValidator,
  goalsQueryValidator,
  goalsResolver,
  goalsExternalResolver,
  goalsDataResolver,
  goalsPatchResolver,
  goalsQueryResolver
} from './goals.schema'

import type { Application } from '../../declarations'
import { GoalsService, getOptions } from './goals.class'
import { goalsPath, goalsMethods } from './goals.shared'

export * from './goals.class'
export * from './goals.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const goals = (app: Application) => {
  // Register our service on the Feathers application
  app.use(goalsPath, new GoalsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: goalsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(goalsPath).hooks(goalsHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [goalsPath]: GoalsService
  }
}
