#!/usr/bin/env ts-node

/**
 * Data Migration Helper: Supabase to PostgreSQL
 *
 * This script helps export data from Supabase and import to PostgreSQL
 */

import { createClient } from '@supabase/supabase-js'
import { query } from '../lib/database-connection'
import fs from 'fs'
import path from 'path'

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Tables to migrate
const TABLES_TO_MIGRATE = [
  'creative_economy_data',
  'investment_realization_ranking',
  'employment_absorption_ranking',
  'project_count_ranking',
  'investment_attachment_ranking',
  'labor_ranking',
  'ranking_analysis_data',
  'investment_analysis_data',
  'workforce_analysis_data',
  'regional_analysis_data',
  'pdki_jabar_data',
  'patent_registration_data'
]

class DataMigrationHelper {
  private supabase: any

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  // Export data from Supabase
  async exportDataFromSupabase(tableName: string): Promise<any[]> {
    console.log(`📥 Exporting data from Supabase table: ${tableName}`)

    try {
      // Supabase has a limit of 1000 rows per request, so we need to paginate
      let allData: any[] = []
      let from = 0
      const pageSize = 1000
      let hasMore = true

      while (hasMore) {
        const { data, error } = await this.supabase
          .from(tableName)
          .select('*')
          .range(from, from + pageSize - 1)

        if (error) {
          console.error(`❌ Error exporting ${tableName}:`, error)
          throw error
        }

        if (data && data.length > 0) {
          allData = [...allData, ...data]
          from += pageSize
          console.log(`   ✓ Exported ${allData.length} rows...`)

          // If we got less than pageSize, we've reached the end
          if (data.length < pageSize) {
            hasMore = false
          }
        } else {
          hasMore = false
        }
      }

      console.log(`✅ Exported ${allData.length} rows from ${tableName}`)
      return allData
    } catch (error) {
      console.error(`❌ Fatal error exporting ${tableName}:`, error)
      throw error
    }
  }

  // Save data to JSON file
  saveDataToFile(data: any[], tableName: string): void {
    const exportDir = path.join(process.cwd(), 'data-exports')
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true })
    }

    const filePath = path.join(exportDir, `${tableName}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`💾 Saved ${data.length} rows to ${filePath}`)
  }

  // Import data to PostgreSQL
  async importDataToPostgres(tableName: string, data: any[]): Promise<void> {
    if (data.length === 0) {
      console.log(`⚠️  No data to import for ${tableName}`)
      return
    }

    console.log(`📤 Importing ${data.length} rows into PostgreSQL table: ${tableName}`)

    try {
      // Get column names from the first row
      const columns = Object.keys(data[0]).filter(key => key !== 'id') // Exclude auto-increment ID
      const columnList = columns.join(', ')
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ')

      // Process data in batches for better performance
      const batchSize = 100
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize)

        for (const row of batch) {
          const values = columns.map(col => row[col])
          await query(
            `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
            values
          )
        }

        console.log(`   ✓ Imported ${Math.min(i + batchSize, data.length)}/${data.length} rows...`)
      }

      console.log(`✅ Imported ${data.length} rows into ${tableName}`)
    } catch (error) {
      console.error(`❌ Error importing ${tableName}:`, error)
      throw error
    }
  }

  // Migrate a single table
  async migrateTable(tableName: string, skipExport: boolean = false): Promise<void> {
    try {
      let data: any[] = []

      if (!skipExport) {
        // Export from Supabase
        data = await this.exportDataFromSupabase(tableName)

        // Save to file for backup
        this.saveDataToFile(data, tableName)
      } else {
        // Load from file
        const filePath = path.join(process.cwd(), 'data-exports', `${tableName}.json`)
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8')
          data = JSON.parse(fileContent)
          console.log(`📂 Loaded ${data.length} rows from ${filePath}`)
        } else {
          console.log(`⚠️  No export file found for ${tableName}`)
          return
        }
      }

      // Import to PostgreSQL
      await this.importDataToPostgres(tableName, data)

      console.log(`🎉 Successfully migrated ${tableName}\n`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${tableName}:`, error)
      throw error
    }
  }

  // Migrate all tables
  async migrateAllTables(options: { skipExport?: boolean, tables?: string[] } = {}): Promise<void> {
    const { skipExport = false, tables } = options

    console.log('🚀 Starting data migration from Supabase to PostgreSQL\n')

    const tablesToMigrate = tables || TABLES_TO_MIGRATE

    for (const tableName of tablesToMigrate) {
      await this.migrateTable(tableName, skipExport)
    }

    console.log('🎉 Data migration completed successfully!')
  }

  // Verify migration integrity
  async verifyMigration(): Promise<void> {
    console.log('🔍 Verifying migration integrity...\n')

    for (const tableName of TABLES_TO_MIGRATE) {
      try {
        // Check PostgreSQL count
        const pgResult = await query(`SELECT COUNT(*) as count FROM ${tableName}`)
        const pgCount = parseInt(pgResult.rows[0].count)

        console.log(`✅ ${tableName}: ${pgCount} rows in PostgreSQL`)
      } catch (error) {
        console.error(`❌ Error verifying ${tableName}:`, error)
      }
    }

    console.log('\n✅ Verification completed')
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  const tables = args.slice(1)

  const migrationHelper = new DataMigrationHelper()

  try {
    switch (command) {
      case 'export':
        console.log('📥 Exporting data from Supabase...')
        for (const tableName of tables.length > 0 ? tables : TABLES_TO_MIGRATE) {
          const data = await migrationHelper.exportDataFromSupabase(tableName)
          migrationHelper.saveDataToFile(data, tableName)
        }
        break

      case 'import':
        console.log('📤 Importing data to PostgreSQL...')
        await migrationHelper.migrateAllTables({ skipExport: true, tables: tables.length > 0 ? tables : undefined })
        break

      case 'migrate':
        await migrationHelper.migrateAllTables({ tables: tables.length > 0 ? tables : undefined })
        await migrationHelper.verifyMigration()
        break

      case 'verify':
        await migrationHelper.verifyMigration()
        break

      default:
        console.log(`
Usage: npm run migrate [command] [tables...]

Commands:
  export [tables...]     - Export data from Supabase to JSON files
  import [tables...]     - Import data from JSON files to PostgreSQL
  migrate [tables...]    - Full migration (export + import + verify)
  verify                - Verify migration integrity

Examples:
  npm run migrate migrate                    # Migrate all tables
  npm run migrate migrate creative_economy_data  # Migrate specific table
  npm run migrate export                    # Export all tables
  npm run migrate import                    # Import all tables
  npm run migrate verify                    # Verify migration
        `)
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { DataMigrationHelper }