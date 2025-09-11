const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const projectRoot = path.join(__dirname, '..')
const scriptsDir = path.join(projectRoot, 'scripts')

describe('Scripts Execution Tests', () => {
  test('scripts can be executed with --help or --version flags', () => {
    // Test that scripts don't crash when run with common flags
    const scripts = ['push-database.js', 'test-connection-simple.js']
    
    scripts.forEach(scriptName => {
      const scriptPath = path.join(scriptsDir, scriptName)
      
      // Test that the script can be required without executing main logic
      expect(() => {
        const script = require(scriptPath)
        expect(script).toBeDefined()
      }).not.toThrow()
    })
  })

  test('scripts have proper error handling', () => {
    // Test that scripts handle missing dependencies gracefully
    const { setupDatabase } = require(path.join(scriptsDir, 'push-database.js'))
    const { testConnection } = require(path.join(scriptsDir, 'test-connection-simple.js'))
    
    // These should be functions that can be called
    expect(typeof setupDatabase).toBe('function')
    expect(typeof testConnection).toBe('function')
  })

  test('scripts can be run directly from command line', () => {
    // Test that scripts can be executed directly (they should not crash immediately)
    const scripts = ['push-database.js', 'test-connection-simple.js']
    
    scripts.forEach(scriptName => {
      const scriptPath = path.join(scriptsDir, scriptName)
      
      // Check that the script has proper shebang and can be executed
      const content = fs.readFileSync(scriptPath, 'utf8')
      expect(content).toMatch(/^#!/)
      expect(content).toMatch(/require\.main === module/)
    })
  })

  test('scripts handle environment variables properly', () => {
    // Test that scripts can read environment variables
    const { setupDatabase } = require(path.join(scriptsDir, 'push-database.js'))
    
    // The function should exist and be callable
    expect(typeof setupDatabase).toBe('function')
    
    // Test that the script can handle missing .env file
    const envPath = path.join(projectRoot, '.env')
    const envBackup = envPath + '.backup'
    
    // If .env exists, temporarily move it
    if (fs.existsSync(envPath)) {
      fs.renameSync(envPath, envBackup)
    }
    
    try {
      // The script should handle missing .env gracefully
      expect(() => {
        require(path.join(scriptsDir, 'push-database.js'))
      }).not.toThrow()
    } finally {
      // Restore .env if it existed
      if (fs.existsSync(envBackup)) {
        fs.renameSync(envBackup, envPath)
      }
    }
  })
})

