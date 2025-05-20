// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { GoalsService } from './goals.class'

// Main data model schema
export const goalsSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String(),
    userId: Type.Number(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  },
  { $id: 'Goals', additionalProperties: false }
)
export type Goals = Static<typeof goalsSchema>
export const goalsValidator = getValidator(goalsSchema, dataValidator)
export const goalsResolver = resolve<Goals, HookContext<GoalsService>>({})

export const goalsExternalResolver = resolve<Goals, HookContext<GoalsService>>({})

// Schema for creating new entries
export const goalsDataSchema = Type.Pick(goalsSchema, ['text'], {
  $id: 'GoalsData'
})
export type GoalsData = Static<typeof goalsDataSchema>
export const goalsDataValidator = getValidator(goalsDataSchema, dataValidator)
export const goalsDataResolver = resolve<Goals, HookContext<GoalsService>>({
  userId: async (_value, _data, context) => {
    // Set the userId to be the authenticated user's id
    if (context.params.user) {
      return context.params.user.id
    }
    return undefined
  }
})

// Schema for updating existing entries
export const goalsPatchSchema = Type.Partial(goalsSchema, {
  $id: 'GoalsPatch'
})
export type GoalsPatch = Static<typeof goalsPatchSchema>
export const goalsPatchValidator = getValidator(goalsPatchSchema, dataValidator)
export const goalsPatchResolver = resolve<Goals, HookContext<GoalsService>>({})

// Schema for allowed query properties
export const goalsQueryProperties = Type.Pick(goalsSchema, ['id', 'text'])
export const goalsQuerySchema = Type.Intersect(
  [
    querySyntax(goalsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type GoalsQuery = Static<typeof goalsQuerySchema>
export const goalsQueryValidator = getValidator(goalsQuerySchema, queryValidator)
export const goalsQueryResolver = resolve<GoalsQuery, HookContext<GoalsService>>({})
