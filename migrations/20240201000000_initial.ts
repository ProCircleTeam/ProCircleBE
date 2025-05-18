import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('email').unique().notNullable()
    table.string('password').notNullable()
    table.string('name').notNullable()
    table.integer('code_name_id').unsigned().references('id').inTable('code_names').unique().onDelete('SET NULL')
    table.timestamps(true, true)
  })

  await knex.schema.createTable('weekly_goals', (table) => {
    table.increments('id')
    table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
    table.string('title').notNullable()
    table.text('description')
    table.date('weekStart').notNullable()
    table.boolean('completed').defaultTo(false)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('weekly_goals')
  await knex.schema.dropTable('users')
}
