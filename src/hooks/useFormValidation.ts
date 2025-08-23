import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const useFormValidation = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>
) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = useCallback((data: T): ValidationResult => {
    try {
      schema.parse(data);
      setErrors([]);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        setErrors(validationErrors);
        return { isValid: false, errors: validationErrors };
      }
      return { isValid: false, errors: [{ field: 'general', message: 'Validation failed' }] };
    }
  }, [schema]);

  const validateField = useCallback((field: string, value: any): boolean => {
    try {
      // Create a partial schema for the specific field
      const fieldSchema = z.object({ [field]: schema.shape[field as keyof T] });
      fieldSchema.parse({ [field]: value });
      
      // Remove field error if it exists
      setErrors(prev => prev.filter(err => err.field !== field));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === field);
        if (fieldError) {
          setErrors(prev => [
            ...prev.filter(err => err.field !== field),
            { field, message: fieldError.message }
          ]);
        }
      }
      return false;
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return errors.find(err => err.field === field)?.message;
  }, [errors]);

  const hasErrors = errors.length > 0;

  return {
    validate,
    validateField,
    clearErrors,
    getFieldError,
    errors,
    hasErrors,
  };
};

// Common validation schemas
export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  primaryNeeds: z.array(z.string()).min(1, 'Please select at least one primary need'),
  householdSize: z.number().min(1, 'Household size must be at least 1').max(20, 'Household size cannot exceed 20'),
  income: z.number().min(0, 'Income cannot be negative'),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  filters: z.object({
    income: z.number().optional(),
    location: z.string().optional(),
    age: z.number().optional(),
  }).optional(),
});

export const applicationSchema = z.object({
  programId: z.string().min(1, 'Program ID is required'),
  status: z.enum(['saved', 'started', 'submitted', 'approved', 'denied']),
  notes: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

// Type exports
export type UserProfile = z.infer<typeof userProfileSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type Application = z.infer<typeof applicationSchema>;