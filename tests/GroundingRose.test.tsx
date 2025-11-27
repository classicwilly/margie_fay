import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GroundingRose } from '../src/components/GroundingRose';

// Mock navigator.vibrate
const mockVibrate = vi.fn();
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
});

describe('GroundingRose', () => {
  beforeEach(() => {
    mockVibrate.mockClear();
    // Reset any global flags
    delete (window as any).__E2E_HAPTICS_STUB__;
    // Enable debug logging for test suite to ensure logger forwards to console during assertions
    (window as any).__WONKY_DEBUG__ = true;
  });

  it('renders the grounding rose button', () => {
    render(<GroundingRose />);
    const button = screen.getByRole('button', { name: /grounding rose/i });
    expect(button).toBeInTheDocument();
  });

  it('triggers haptic feedback on click', () => {
    render(<GroundingRose />);
    const button = screen.getByRole('button', { name: /grounding rose/i });

    // Use act to wrap state-updating calls
    act(() => {
      fireEvent.click(button);
    });

    // Vibrate is called synchronously by the component's handler
    expect(mockVibrate).toHaveBeenCalledWith(300);
  });

  it('shows ripple effect on click', () => {
    render(<GroundingRose />);
    const button = screen.getByRole('button', { name: /grounding rose/i });

    fireEvent.click(button);

    // Check for ripple overlay (animate-ping class)
    const ripple = button.querySelector('.animate-ping');
    expect(ripple).toBeInTheDocument();
  });

  it('calls onActivate callback when provided', () => {
    const mockOnActivate = vi.fn();
    render(<GroundingRose onActivate={mockOnActivate} />);
    const button = screen.getByRole('button', { name: /grounding rose/i });

    fireEvent.click(button);

    expect(mockOnActivate).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<GroundingRose className={customClass} />);
    const button = screen.getByRole('button', { name: /grounding rose/i });

    expect(button).toHaveClass(customClass);
  });

  it('handles vibration failure gracefully', () => {
    mockVibrate.mockImplementation(() => {
      throw new Error('Vibration failed');
    });

    // Spy on console.warn
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<GroundingRose />);
    const button = screen.getByRole('button', { name: /grounding rose/i });

    fireEvent.click(button);

    expect(consoleWarnSpy).toHaveBeenCalledWith('Haptics: vibration failed:', expect.any(Error));

    consoleWarnSpy.mockRestore();
  });

  it('handles unsupported vibration API', () => {
    // Mock navigator without vibrate
    const originalNavigator = global.navigator;
    Object.defineProperty(global, 'navigator', {
      value: { ...originalNavigator },
      writable: true,
    });
    delete (global.navigator as any).vibrate;

    // Spy on console.log
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<GroundingRose />);
    const button = screen.getByRole('button', { name: /grounding rose/i });

    fireEvent.click(button);

    expect(consoleLogSpy).toHaveBeenCalledWith('Haptics: vibration not supported, falling back silently');

    consoleLogSpy.mockRestore();

    // Restore navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });
});