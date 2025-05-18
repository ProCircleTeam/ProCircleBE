import { Type } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

export const userSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String(),
    password: Type.String(),
    name: Type.String(),
    code_name_id: Type.Optional(Type.Number())
  },
  { $id: 'User', additionalProperties: false }
)

export type User = Static<typeof userSchema>
