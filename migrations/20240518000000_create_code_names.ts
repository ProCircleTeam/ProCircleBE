import type { Knex } from 'knex'

const codeNames = [
  "Apex", "Vanguard", "Pinnacle", "Catalyst", "Maverick", "Luminary", "Titan", "Paragon", "Summit", "Maestro", "Oracle", "Innovator", "Trailblazer", "Virtuoso", "Pathfinder","Crusader", "Strategist", "Jetstream", "Quantum", "Paramount", "Beacon", "Visionary", "Chief", "Achiever", "Scholar","Mentor", "Victory", "Sage", "Captain", "Nobel", "Champion", "Commander", "Architect", "Pioneer", "Gladiator","Legacy", "Advisor", "Laureate", "Supreme", "Sterling", "Guardian", "Brilliance", "Everest", "Ironclad", "Ambassador","FirstClass", "Starfire", "Knight", "Innovex", "Velocity", "Falcon", "EagleEye", "Barrister", "Patriot", "Virtue","Prestige", "President", "SageOne", "ApexOne", "Polestar", "LionHeart", "Honor", "Magnate", "Prime", "Director","Delegate", "Heroic", "Zephyr", "Achievo", "Lumina", "Titanus", "AlphaCore", "Excel", "Empire", "Stormer","Redline", "VanguardX", "Everwise", "Astoria", "Stratos", "CommanderX", "Chancellor", "Tycoon", "Ambition", "Hyperion","Omicron", "Genesis", "Aristocrat", "Riser", "Orbiter", "Radiant", "Blazer", "Zenith", "Baron", "Trailstar","Olympus", "Headliner", "Iconic", "Monarch", "Futureproof"
]

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('code_names', (table) => {
    table.increments('id')
    table.string('name').unique().notNullable()
    table.boolean('assigned').defaultTo(false)
    table.timestamps(true, true)
  })

  // Insert all code names
  await knex('code_names').insert(codeNames.map(name => ({ name })))
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('code_names')
}
