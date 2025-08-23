import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('We encountered an unexpected error. Please try again or return to the home page.')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Go Home')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    const detailsElement = screen.getByText('Error Details (Development)')
    expect(detailsElement).toBeInTheDocument()
    
    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })

  it('handles retry button click', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)
    
    // Should show the error again since the component still throws
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('handles go home button click', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    const goHomeButton = screen.getByText('Go Home')
    fireEvent.click(goHomeButton)
    
    // Should show the error again since the component still throws
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})