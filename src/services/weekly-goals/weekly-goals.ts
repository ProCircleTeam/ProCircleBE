import { authenticate } from '@feathersjs/authentication'
import { KnexService } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { WeeklyGoal } from './weekly-goals.schema'

export const weeklyGoalsPath = '/v1/weekly-goals'

export class WeeklyGoalService extends KnexService<WeeklyGoal> {
  //@ts-ignore
  async create(data: WeeklyGoal, params: any) {
    // Ensure goals are associated with authenticated user
    const userId = params.user.id
    return super.create({ ...data, userId }, params)
  }

  //@ts-ignore
  async find(params: any) {
    // Filter goals by authenticated user
    const { user, query = {} } = params
    return super.find({
      ...params,
      query: {
        ...query,
        userId: user.id
      }
    })
  }
}

export const weeklyGoals = (app: Application) => {
  const weeklyGoalService = new WeeklyGoalService({
    id: 'id',
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'weekly_goals'
  })

  app.use(weeklyGoalsPath, weeklyGoalService)
  app.use('weekly-goals', weeklyGoalService) // Register for internal reference

  // Get initialized service
  const service = app.service('weekly-goals')

  service.hooks({
    around: {
      all: [authenticate('jwt')]
    }
  })
}
