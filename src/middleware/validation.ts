import { NextApiRequest, NextApiResponse } from 'next'

export interface ValidationRule {
  field: string
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'array'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export function withValidation(rules: ValidationRule[]) {
  return function(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const errors: string[] = []
        const body = req.body

        for (const rule of rules) {
          const value = body[rule.field]
          const fieldName = rule.field

          // Check if required field is missing
          if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push(`${fieldName} is required`)
            continue
          }

          // Skip validation if field is not provided and not required
          if (value === undefined || value === null) {
            continue
          }

          // Type validation
          if (rule.type) {
            switch (rule.type) {
              case 'string':
                if (typeof value !== 'string') {
                  errors.push(`${fieldName} must be a string`)
                }
                break
              case 'number':
                if (typeof value !== 'number' || isNaN(value)) {
                  errors.push(`${fieldName} must be a number`)
                }
                break
              case 'boolean':
                if (typeof value !== 'boolean') {
                  errors.push(`${fieldName} must be a boolean`)
                }
                break
              case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (typeof value !== 'string' || !emailPattern.test(value)) {
                  errors.push(`${fieldName} must be a valid email address`)
                }
                break
              case 'date':
                if (typeof value !== 'string' || isNaN(Date.parse(value))) {
                  errors.push(`${fieldName} must be a valid date`)
                }
                break
              case 'array':
                if (!Array.isArray(value)) {
                  errors.push(`${fieldName} must be an array`)
                }
                break
            }
          }

          // String length validation
          if (rule.type === 'string' && typeof value === 'string') {
            if (rule.minLength && value.length < rule.minLength) {
              errors.push(`${fieldName} must be at least ${rule.minLength} characters long`)
            }
            if (rule.maxLength && value.length > rule.maxLength) {
              errors.push(`${fieldName} must be no more than ${rule.maxLength} characters long`)
            }
          }

          // Number range validation
          if (rule.type === 'number' && typeof value === 'number') {
            if (rule.min !== undefined && value < rule.min) {
              errors.push(`${fieldName} must be at least ${rule.min}`)
            }
            if (rule.max !== undefined && value > rule.max) {
              errors.push(`${fieldName} must be no more than ${rule.max}`)
            }
          }

          // Pattern validation
          if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            errors.push(`${fieldName} format is invalid`)
          }

          // Custom validation
          if (rule.custom) {
            const customError = rule.custom(value)
            if (customError) {
              errors.push(customError)
            }
          }
        }

        if (errors.length > 0) {
          return res.status(400).json({
            error: 'Validation failed',
            details: errors
          })
        }

        // If validation passes, call the original handler
        return handler(req, res)

      } catch (error) {
        console.error('Validation middleware error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}

// Common validation rules
export const commonValidations = {
  email: {
    field: 'email',
    required: true,
    type: 'email' as const
  },
  password: {
    field: 'password',
    required: true,
    type: 'string' as const,
    minLength: 6
  },
  firstName: {
    field: 'firstName',
    required: true,
    type: 'string' as const,
    minLength: 1,
    maxLength: 50
  },
  lastName: {
    field: 'lastName',
    required: true,
    type: 'string' as const,
    minLength: 1,
    maxLength: 50
  },
  phone: {
    field: 'phone',
    type: 'string' as const,
    pattern: /^\+?[\d\s\-\(\)]+$/
  }
}


