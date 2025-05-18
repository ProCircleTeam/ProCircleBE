// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import { users } from './users/users'
import { weeklyGoals } from './weekly-goals/weekly-goals'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(users)
  app.configure(weeklyGoals)
}
