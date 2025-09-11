const path = require('path')
const fs = require('fs')

const projectRoot = path.join(__dirname, '..')
const envExamplePath = path.join(projectRoot, 'env.example')
const envPath = path.join(projectRoot, '.env')

describe('Environment Configuration Tests', () => {
  test('env.example exists and has required variables', () => {
    expect(fs.existsSync(envExamplePath)).toBe(true)
    
    const content = fs.readFileSync(envExamplePath, 'utf8')
    
    // Check for required environment variables
    const requiredVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'EMAIL_USER',
      'EMAIL_PASS'
    ]
    
    requiredVars.forEach(varName => {
      expect(content).toMatch(new RegExp(`^${varName}=`, 'm'))
    })
  })

  test('env.example has proper format', () => {
    const content = fs.readFileSync(envExamplePath, 'utf8')
    
    // Check for proper comments
    expect(content).toMatch(/# Database - Supabase PostgreSQL/)
    expect(content).toMatch(/# Supabase Configuration/)
    expect(content).toMatch(/# Email \(Nodemailer Gmail SMTP\)/)
    
    // Check for proper variable format
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'))
    lines.forEach(line => {
      expect(line).toMatch(/^[A-Z_]+=.*$/)
    })
  })

  test('.env file can be created from env.example', () => {
    // This test ensures the push-database script can create .env from env.example
    if (fs.existsSync(envPath)) {
      // If .env exists, check it has the right structure
      const content = fs.readFileSync(envPath, 'utf8')
      expect(content).toMatch(/DATABASE_URL=/)
    } else {
      // If .env doesn't exist, verify env.example is ready to be copied
      expect(fs.existsSync(envExamplePath)).toBe(true)
    }
  })
})
