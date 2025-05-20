// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('goals', table => {
    table.increments('id')
    table.string('text').notNullable()
    table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
    table.timestamps(true, true)  // This adds createdAt and updatedAt columns with defaults
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('goals')
}
