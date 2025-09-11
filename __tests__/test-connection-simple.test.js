const path = require('path')
const fs = require('fs')

const projectRoot = path.join(__dirname, '..')
const scriptPath = path.join(projectRoot, 'scripts', 'test-connection-simple.js')

describe('test-connection-simple script', () => {
  test('exists and can be required', () => {
    expect(fs.existsSync(scriptPath)).toBe(true)
    
    // Test that the script can be required without executing
    const { testConnection } = require(scriptPath)
    expect(typeof testConnection).toBe('function')
  })

  test('has proper structure and exports', () => {
    const content = fs.readFileSync(scriptPath, 'utf8')
    
    // Check for key components
    expect(content).toMatch(/async function testConnection/)
    expect(content).toMatch(/Testing Supabase Connection/)
    expect(content).toMatch(/require\.main === module/)
    expect(content).toMatch(/module\.exports/)
  })
})

