// Database connectivity and functionality test
import { query, healthCheck, closePool } from '../lib/database-connection'
import { userService } from '../lib/user-service'
import { DatabaseService } from '../lib/postgres-database-service'

async function runTests() {
  console.log('🧪 Starting PostgreSQL Database Tests...\n')

  try {
    // Test 1: Database Health Check
    console.log('📋 Test 1: Database Health Check')
    const isHealthy = await healthCheck()
    console.log(`✅ Database health: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`)

    if (!isHealthy) {
      throw new Error('Database health check failed')
    }

    // Test 2: Connection Test
    console.log('\n📋 Test 2: Connection Test')
    const result = await query('SELECT current_database(), current_user, version()')
    console.log('✅ Connected to database:', result.rows[0].current_database)
    console.log('✅ Current user:', result.rows[0].current_user)
    console.log('✅ PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1])

    // Test 3: Table Existence Check
    console.log('\n📋 Test 3: Table Existence Check')
    const tables = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    console.log(`✅ Found ${tables.rows.length} tables:`)
    tables.rows.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.table_name}`)
    })

    // Test 4: Create Test User
    console.log('\n📋 Test 4: Create Test User')
    const testEmail = `test_${Date.now()}@example.com`
    const testPassword = 'testPassword123'

    const testUser = await userService.createUser({
      email: testEmail,
      password: testPassword,
      name: 'Test User'
    })
    console.log('✅ Test user created:', { id: testUser.id, email: testUser.email, name: testUser.name })

    // Test 5: Find User by Email
    console.log('\n📋 Test 5: Find User by Email')
    const foundUser = await userService.findUserByEmail(testEmail)
    console.log('✅ User found:', foundUser ? { id: foundUser.id, email: foundUser.email } : 'NOT FOUND')

    // Test 6: Materialized Views Check
    console.log('\n📋 Test 6: Materialized Views Check')
    const views = await query(`
      SELECT matviewname
      FROM pg_matviews
      WHERE schemaname = 'public'
      ORDER BY matviewname
    `)
    console.log(`✅ Found ${views.rows.length} materialized views:`)
    views.rows.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.matviewname}`)
    })

    // Test 7: Triggers Check
    console.log('\n📋 Test 7: Triggers Check')
    const triggers = await query(`
      SELECT trigger_name, event_object_table
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY trigger_name
    `)
    console.log(`✅ Found ${triggers.rows.length} triggers (showing first 10):`)
    triggers.rows.slice(0, 10).forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.trigger_name} on ${row.event_object_table}`)
    })

    // Test 8: Functions Check
    console.log('\n📋 Test 8: Custom Functions Check')
    const functions = await query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      ORDER BY routine_name
    `)
    console.log(`✅ Found ${functions.rows.length} custom functions:`)
    functions.rows.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.routine_name}`)
    })

    // Test 9: Clean up test user
    console.log('\n📋 Test 9: Clean Up Test Data')
    await userService.deleteUser(testUser.id)
    console.log('✅ Test user deleted')

    // Test 10: Performance Test
    console.log('\n📋 Test 10: Query Performance Test')
    const startTime = Date.now()
    await query('SELECT COUNT(*) FROM creative_economy_data')
    const endTime = Date.now()
    console.log(`✅ Query executed in ${endTime - startTime}ms`)

    console.log('\n🎉 All tests passed successfully!\n')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  } finally {
    await closePool()
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error during testing:', error)
  process.exit(1)
})