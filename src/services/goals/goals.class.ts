// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Goals, GoalsData, GoalsPatch, GoalsQuery } from './goals.schema'

export type { Goals, GoalsData, GoalsPatch, GoalsQuery }

export interface GoalsParams extends KnexAdapterParams<GoalsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class GoalsService<ServiceParams extends Params = GoalsParams> extends KnexService<
  Goals,
  GoalsData,
  GoalsParams,
  GoalsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'goals'
  }
}
