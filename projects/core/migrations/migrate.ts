import {
  Entity,
  type DataProvider,
  IdEntity,
  Fields,
  remult,
  Remult,
} from '../index.js'
import { initDataProvider } from '../server/initDataProvider.js'
import { doTransaction } from '../src/context.js'
import { cast, isOfType } from '../src/isOfType.js'
import type { SqlCommandFactory } from '../src/sql-command.js'
import type { MigrationUtils, Migrations } from './migration-types.js'

export async function migrate(options: {
  migrations: Migrations
  dataProvider:
    | DataProvider
    | Promise<DataProvider>
    | (() => Promise<DataProvider | undefined>)
  migrationsTable?: string
  endConnection?: boolean
}) {
  let migrationTableName =
    options.migrationsTable || '__remult_migrations_version'

  const dataProvider = await initDataProvider(options.dataProvider)

  const prev = remult.dataProvider
  remult.dataProvider = dataProvider
  try {
    @Entity(migrationTableName)
    class VersionInfo extends IdEntity {
      @Fields.number()
      version = -1
    }
    const repo = new Remult(dataProvider).repo(VersionInfo)

    if (dataProvider.ensureSchema) {
      await dataProvider.ensureSchema([repo.metadata])
    }
    let v = await repo.findFirst()
    if (!v) {
      v = repo.create()
      v.version = -1
    }
    const steps = Object.entries(options.migrations).sort(
      ([a], [b]) => parseInt(a) - parseInt(b),
    )

    for (const [stepText, action] of steps) {
      const step = parseInt(stepText)
      if (step < 0)
        throw new Error('Migration step number must be a non-negative integer')
      if (v.version >= step) continue
      console.info('Executing migration step ' + step)
      console.time('Completed migration step ' + step)
      try {
        await doTransaction(remult, async (dp) => {
          const utils: MigrationUtils = {
            sql: async (sql) => {
              await cast<SqlCommandFactory>(dp, 'execute').execute(sql)
            },
          }
          await action(utils)
        })
        console.timeEnd('Completed migration step ' + step)
      } catch (err) {
        console.error('Failed to execute migration step ' + step)
        console.error(err)
        throw err
      }
      v.version = step
      await v.save()
    }
  } finally {
    remult.dataProvider = prev
  }
  if (options.endConnection !== false && isOfType(dataProvider, 'end')) {
    await dataProvider.end()
  }
}
