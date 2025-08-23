import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormValidation, userProfileSchema } from '../useFormValidation'
import { z } from 'zod'

describe('useFormValidation', () => {
  it('should initialize with no errors', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    expect(result.current.errors).toEqual([])
    expect(result.current.hasErrors).toBe(false)
  })

  it('should validate valid data successfully', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      zipCode: '12345',
      primaryNeeds: ['housing'],
      householdSize: 2,
      income: 30000,
    }
    
    act(() => {
      const validationResult = result.current.validate(validData)
      expect(validationResult.isValid).toBe(true)
      expect(validationResult.errors).toEqual([])
    })
    
    expect(result.current.errors).toEqual([])
    expect(result.current.hasErrors).toBe(false)
  })

  it('should detect validation errors', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    const invalidData = {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      phone: '',
      zipCode: '123',
      primaryNeeds: [],
      householdSize: 0,
      income: -1000,
    }
    
    act(() => {
      const validationResult = result.current.validate(invalidData)
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors.length).toBeGreaterThan(0)
    })
    
    expect(result.current.hasErrors).toBe(true)
    expect(result.current.errors.length).toBeGreaterThan(0)
  })

  it('should validate individual fields', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    act(() => {
      const isValid = result.current.validateField('email', 'test@example.com')
      expect(isValid).toBe(true)
    })
    
    expect(result.current.getFieldError('email')).toBeUndefined()
    
    act(() => {
      const isValid = result.current.validateField('email', 'invalid-email')
      expect(isValid).toBe(false)
    })
    
    expect(result.current.getFieldError('email')).toBeDefined()
  })

  it('should clear errors', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    const invalidData = {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      phone: '',
      zipCode: '123',
      primaryNeeds: [],
      householdSize: 0,
      income: -1000,
    }
    
    act(() => {
      result.current.validate(invalidData)
    })
    
    expect(result.current.hasErrors).toBe(true)
    
    act(() => {
      result.current.clearErrors()
    })
    
    expect(result.current.errors).toEqual([])
    expect(result.current.hasErrors).toBe(false)
  })

  it('should handle email validation correctly', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'user+tag@example.org']
    const invalidEmails = ['invalid-email', '@example.com', 'test@', 'test.example.com']
    
    validEmails.forEach(email => {
      act(() => {
        const isValid = result.current.validateField('email', email)
        expect(isValid).toBe(true)
      })
    })
    
    invalidEmails.forEach(email => {
      act(() => {
        const isValid = result.current.validateField('email', email)
        expect(isValid).toBe(false)
      })
    })
  })

  it('should handle ZIP code validation correctly', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    const validZipCodes = ['12345', '12345-6789']
    const invalidZipCodes = ['1234', '123456', 'abcde', '1234a']
    
    validZipCodes.forEach(zipCode => {
      act(() => {
        const isValid = result.current.validateField('zipCode', zipCode)
        expect(isValid).toBe(true)
      })
    })
    
    invalidZipCodes.forEach(zipCode => {
      act(() => {
        const isValid = result.current.validateField('zipCode', zipCode)
        expect(isValid).toBe(false)
      })
    })
  })

  it('should handle household size validation correctly', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    const validSizes = [1, 2, 5, 10, 20]
    const invalidSizes = [0, -1, 21, 100]
    
    validSizes.forEach(size => {
      act(() => {
        const isValid = result.current.validateField('householdSize', size)
        expect(isValid).toBe(true)
      })
    })
    
    invalidSizes.forEach(size => {
      act(() => {
        const isValid = result.current.validateField('householdSize', size)
        expect(isValid).toBe(false)
      })
    })
  })

  it('should handle primary needs validation correctly', () => {
    const { result } = renderHook(() => useFormValidation(userProfileSchema))
    
    act(() => {
      const isValid = result.current.validateField('primaryNeeds', ['housing', 'employment'])
      expect(isValid).toBe(true)
    })
    
    act(() => {
      const isValid = result.current.validateField('primaryNeeds', [])
      expect(isValid).toBe(false)
    })
  })
})