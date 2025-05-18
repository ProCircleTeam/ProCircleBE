import { Type } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

export const weeklyGoalSchema = Type.Object(
  {
    id: Type.Number(),
    userId: Type.Number(),
    title: Type.String(),
    description: Type.String(),
    weekStart: Type.String({ format: 'date' }),
    completed: Type.Boolean(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  },
  { $id: 'WeeklyGoal', additionalProperties: false }
)

export type WeeklyGoal = Static<typeof weeklyGoalSchema>
