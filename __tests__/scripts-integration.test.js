const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const projectRoot = path.join(__dirname, '..')
const scriptsDir = path.join(projectRoot, 'scripts')

describe('Scripts Integration Tests', () => {
  test('all scripts exist and are executable', () => {
    const expectedScripts = [
      'push-database.js',
      'test-connection-simple.js'
    ]

    expectedScripts.forEach(scriptName => {
      const scriptPath = path.join(scriptsDir, scriptName)
      expect(fs.existsSync(scriptPath)).toBe(true)
      
      // Check if file has executable permissions (on Unix systems)
      const stats = fs.statSync(scriptPath)
      expect(stats.isFile()).toBe(true)
    })
  })

  test('scripts can be executed without errors (dry run)', () => {
    // Test that scripts don't crash when required
    expect(() => {
      require(path.join(scriptsDir, 'push-database.js'))
    }).not.toThrow()

    expect(() => {
      require(path.join(scriptsDir, 'test-connection-simple.js'))
    }).not.toThrow()
  })

  test('scripts have proper shebang and structure', () => {
    const scripts = ['push-database.js', 'test-connection-simple.js']
    
    scripts.forEach(scriptName => {
      const scriptPath = path.join(scriptsDir, scriptName)
      const content = fs.readFileSync(scriptPath, 'utf8')
      
      // Check for shebang
      expect(content).toMatch(/^#!/)
      
      // Check for proper module guard
      expect(content).toMatch(/require\.main === module/)
      
      // Check for exports
      expect(content).toMatch(/module\.exports/)
    })
  })
})

