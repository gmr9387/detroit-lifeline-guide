import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storageUtils } from '../localStorage'
import { UserProfile, Application } from '@/types'

describe('storageUtils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('User Profile Management', () => {
    it('should save and retrieve user profile', () => {
      const mockProfile: UserProfile = {
        id: 'test-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        householdSize: 2,
        hasChildren: true,
        income: '30k-45k',
        zipCode: '12345',
        primaryNeeds: ['housing', 'employment'],
        language: 'english',
        completedAt: '2024-01-01T00:00:00.000Z',
      }

      storageUtils.saveUserProfile(mockProfile)
      const retrievedProfile = storageUtils.getUserProfile()

      expect(retrievedProfile).toEqual(mockProfile)
      expect(localStorage.setItem).toHaveBeenCalledWith('userProfile', JSON.stringify(mockProfile))
      expect(localStorage.getItem).toHaveBeenCalledWith('userProfile')
    })

    it('should return null when no user profile exists', () => {
      const profile = storageUtils.getUserProfile()
      expect(profile).toBeNull()
    })

    it('should clear user profile', () => {
      const mockProfile: UserProfile = {
        id: 'test-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        householdSize: 2,
        hasChildren: true,
        income: '30k-45k',
        zipCode: '12345',
        primaryNeeds: ['housing'],
        language: 'english',
        completedAt: '2024-01-01T00:00:00.000Z',
      }

      storageUtils.saveUserProfile(mockProfile)
      storageUtils.clearUserProfile()

      const profile = storageUtils.getUserProfile()
      expect(profile).toBeNull()
      expect(localStorage.removeItem).toHaveBeenCalledWith('userProfile')
    })
  })

  describe('Applications Management', () => {
    it('should save and retrieve applications', () => {
      const mockApplications: Application[] = [
        {
          id: 'app-1',
          programId: 'program-1',
          status: 'started',
          appliedAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'app-2',
          programId: 'program-2',
          status: 'submitted',
          appliedAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]

      storageUtils.saveApplications(mockApplications)
      const retrievedApplications = storageUtils.getApplications()

      expect(retrievedApplications).toEqual(mockApplications)
    })

    it('should return empty array when no applications exist', () => {
      const applications = storageUtils.getApplications()
      expect(applications).toEqual([])
    })

    it('should add new application', () => {
      const existingApplications: Application[] = [
        {
          id: 'app-1',
          programId: 'program-1',
          status: 'started',
          appliedAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      const newApplication: Application = {
        id: 'app-2',
        programId: 'program-2',
        status: 'submitted',
        appliedAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      }

      storageUtils.saveApplications(existingApplications)
      storageUtils.addApplication(newApplication)

      const applications = storageUtils.getApplications()
      expect(applications).toHaveLength(2)
      expect(applications).toContainEqual(newApplication)
    })

    it('should update existing application', () => {
      const applications: Application[] = [
        {
          id: 'app-1',
          programId: 'program-1',
          status: 'started',
          appliedAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      storageUtils.saveApplications(applications)

      const updatedApplication: Application = {
        id: 'app-1',
        programId: 'program-1',
        status: 'submitted',
        appliedAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      }

      storageUtils.updateApplication(updatedApplication)

      const retrievedApplications = storageUtils.getApplications()
      expect(retrievedApplications).toHaveLength(1)
      expect(retrievedApplications[0]).toEqual(updatedApplication)
    })
  })

  describe('Favorites Management', () => {
    it('should save and retrieve favorites', () => {
      const mockFavorites = ['program-1', 'program-2', 'program-3']

      storageUtils.saveFavorites(mockFavorites)
      const retrievedFavorites = storageUtils.getFavorites()

      expect(retrievedFavorites).toEqual(mockFavorites)
    })

    it('should return empty array when no favorites exist', () => {
      const favorites = storageUtils.getFavorites()
      expect(favorites).toEqual([])
    })

    it('should add program to favorites', () => {
      const existingFavorites = ['program-1', 'program-2']
      storageUtils.saveFavorites(existingFavorites)

      storageUtils.addToFavorites('program-3')

      const favorites = storageUtils.getFavorites()
      expect(favorites).toContain('program-3')
      expect(favorites).toHaveLength(3)
    })

    it('should remove program from favorites', () => {
      const existingFavorites = ['program-1', 'program-2', 'program-3']
      storageUtils.saveFavorites(existingFavorites)

      storageUtils.removeFromFavorites('program-2')

      const favorites = storageUtils.getFavorites()
      expect(favorites).not.toContain('program-2')
      expect(favorites).toHaveLength(2)
    })

    it('should not add duplicate favorites', () => {
      const existingFavorites = ['program-1', 'program-2']
      storageUtils.saveFavorites(existingFavorites)

      storageUtils.addToFavorites('program-1')

      const favorites = storageUtils.getFavorites()
      expect(favorites).toHaveLength(2)
      expect(favorites.filter(f => f === 'program-1')).toHaveLength(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid JSON in localStorage', () => {
      // Mock localStorage to return invalid JSON
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-json')

      const profile = storageUtils.getUserProfile()
      const applications = storageUtils.getApplications()
      const favorites = storageUtils.getFavorites()

      expect(profile).toBeNull()
      expect(applications).toEqual([])
      expect(favorites).toEqual([])
    })

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const mockProfile: UserProfile = {
        id: 'test-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        householdSize: 2,
        hasChildren: true,
        income: '30k-45k',
        zipCode: '12345',
        primaryNeeds: ['housing'],
        language: 'english',
        completedAt: '2024-01-01T00:00:00.000Z',
      }

      // Should not throw an error
      expect(() => storageUtils.saveUserProfile(mockProfile)).not.toThrow()
    })
  })
})