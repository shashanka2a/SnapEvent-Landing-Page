const path = require('path')
const fs = require('fs')

const projectRoot = path.join(__dirname, '..')
const scriptPath = path.join(projectRoot, 'scripts', 'push-database.js')

describe('push-database script', () => {
  test('exists and can be required', () => {
    expect(fs.existsSync(scriptPath)).toBe(true)
    
    // Test that the script can be required without executing
    const { setupDatabase } = require(scriptPath)
    expect(typeof setupDatabase).toBe('function')
  })

  test('has proper structure and exports', () => {
    const content = fs.readFileSync(scriptPath, 'utf8')
    
    // Check for key components
    expect(content).toMatch(/async function setupDatabase/)
    expect(content).toMatch(/Setting up Supabase database for SnapEvent/)
    expect(content).toMatch(/require\.main === module/)
    expect(content).toMatch(/module\.exports/)
  })
})

