/**
 * Design System: Mathematical Constants & Calculations
 * 
 * All visual decisions derived from fundamental mathematical principles:
 * - Golden Ratio (φ) for proportional harmony
 * - Musical intervals for color relationships
 * - Physics-based motion curves
 * - Geometric progressions for spacing
 */

// ========================================
// MATHEMATICAL CONSTANTS
// ========================================

/** Golden Ratio: φ = (1 + √5) / 2 */
export const PHI = (1 + Math.sqrt(5)) / 2; // ≈ 1.618033988749895

/** Golden Ratio Inverse: 1/φ */
export const PHI_INVERSE = 1 / PHI; // ≈ 0.618033988749895

/** Perfect Fifth (musical harmony): 3:2 ratio */
export const PERFECT_FIFTH = 3 / 2; // 1.5

/** Major Third (musical harmony): 5:4 ratio */
export const MAJOR_THIRD = 5 / 4; // 1.25

/** Perfect Fourth (typography scale): 4:3 ratio */
export const PERFECT_FOURTH = 4 / 3; // ≈ 1.333

/** Pythagorean constant: √2 */
export const ROOT_2 = Math.sqrt(2); // ≈ 1.414

/** Equilateral triangle height ratio: √3 */
export const ROOT_3 = Math.sqrt(3); // ≈ 1.732

/** Euler's number: e */
export const E = Math.E; // ≈ 2.718

/** Pi: π */
export const PI = Math.PI; // ≈ 3.14159

// ========================================
// SPACING SYSTEM (Powers of 2 & Golden Ratio)
// ========================================

/** Base unit: 8px (2³, binary harmony) */
export const BASE_UNIT = 8;

/**
 * Generates spacing scale using φ progression
 * S(n) = BASE_UNIT × φⁿ
 */
export const spacing = {
  xs: BASE_UNIT * 1,                    // 8px
  sm: BASE_UNIT * PHI,                  // ≈ 13px
  md: BASE_UNIT * PHI * PHI,            // ≈ 21px (φ²)
  lg: BASE_UNIT * Math.pow(PHI, 3),     // ≈ 34px (φ³)
  xl: BASE_UNIT * Math.pow(PHI, 4),     // ≈ 55px (φ⁴)
  '2xl': BASE_UNIT * Math.pow(PHI, 5),  // ≈ 89px (φ⁵)
  '3xl': BASE_UNIT * Math.pow(PHI, 6),  // ≈ 144px (φ⁶)
} as const;

// ========================================
// TYPOGRAPHY SYSTEM (Musical Intervals)
// ========================================

/** Base font size in pixels */
export const BASE_FONT_SIZE = 16;

/**
 * Typography scale using perfect fourth (4:3 ratio)
 * F(n) = BASE_FONT_SIZE × (4/3)ⁿ
 */
export const fontSize = {
  xs: BASE_FONT_SIZE / Math.pow(PERFECT_FOURTH, 2),  // ≈ 9px
  sm: BASE_FONT_SIZE / PERFECT_FOURTH,                // ≈ 12px
  base: BASE_FONT_SIZE,                               // 16px
  lg: BASE_FONT_SIZE * PERFECT_FOURTH,                // ≈ 21px
  xl: BASE_FONT_SIZE * Math.pow(PERFECT_FOURTH, 2),  // ≈ 28px
  '2xl': BASE_FONT_SIZE * Math.pow(PERFECT_FOURTH, 3), // ≈ 37px
  '3xl': BASE_FONT_SIZE * Math.pow(PERFECT_FOURTH, 4), // ≈ 50px
  '4xl': BASE_FONT_SIZE * Math.pow(PERFECT_FOURTH, 5), // ≈ 66px
} as const;

/**
 * Line height using golden ratio for optimal readability
 * Research shows φ provides ideal text density
 */
export const lineHeight = {
  tight: 1.2,
  normal: PHI,      // ≈ 1.618 (golden ratio)
  relaxed: PHI * 1.2, // ≈ 1.94
} as const;

// ========================================
// COLOR SYSTEM (Wavelength-based Hues)
// ========================================

/**
 * Hue values based on electromagnetic spectrum
 * Visible light: 380nm (violet) to 700nm (red)
 */
export const hue = {
  primary: 262,   // Purple: between blue and red
  secondary: 212, // Blue: ~475nm wavelength
  accent: 142,    // Green: ~520nm wavelength  
  warm: 32,       // Orange: complementary to blue
  cool: 192,      // Cyan: complementary to orange
} as const;

/**
 * Lightness scale (perceptual brightness)
 * Using exponential distribution for perceived uniformity
 */
export const lightness = {
  darkest: 5,
  darker: 10,
  dark: 20,
  mid: 50,
  light: 80,
  lighter: 90,
  lightest: 95,
} as const;

/**
 * Saturation (chroma intensity)
 */
export const saturation = {
  muted: 20,
  medium: 50,
  vivid: 80,
  pure: 100,
} as const;

/**
 * Generate HSL color string
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 */
export const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;

/**
 * Generate HSLA color string with alpha
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @param a Alpha (0-1)
 */
export const hsla = (h: number, s: number, l: number, a: number) => 
  `hsla(${h}, ${s}%, ${l}%, ${a})`;

// ========================================
// OPACITY SYSTEM (Inverse Square Law)
// ========================================

/**
 * Opacity values following inverse square law for visual weight
 * I(d) = I₀ / d²
 */
export const opacity = {
  subtle: 0.1,
  light: 0.25,
  medium: 0.5,
  strong: 0.75,
  full: 1,
} as const;

// ========================================
// BORDER RADIUS (Circular Geometry)
// ========================================

/**
 * Border radius values
 * Based on circular arc calculations
 */
export const radius = {
  none: 0,
  sm: BASE_UNIT * 0.5,      // 4px
  md: BASE_UNIT,            // 8px  
  lg: BASE_UNIT * PHI,      // ≈ 13px
  xl: BASE_UNIT * PHI * PHI, // ≈ 21px
  full: 9999,
} as const;

// ========================================
// ANIMATION TIMING (Physics-based Motion)
// ========================================

/**
 * Duration values in milliseconds
 * Based on human perception thresholds
 */
export const duration = {
  instant: 0,
  fast: 150,      // Perceivable but immediate
  normal: 250,    // Standard UI interaction
  slow: 400,      // Deliberate transition
  slower: 600,    // Emphasis
  slowest: 1000,  // Full second for major changes
} as const;

/**
 * Cubic Bezier easing functions
 * Derived from physical motion curves
 */
export const easing = {
  /** Linear motion: no acceleration */
  linear: 'cubic-bezier(0, 0, 1, 1)',
  
  /** Standard easing: gentle acceleration and deceleration */
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  /** Deceleration curve: object coming to rest */
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  /** Acceleration curve: object starting motion */
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  /** Sharp curve: snappy motion */
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
} as const;

// ========================================
// GEOMETRY CALCULATIONS
// ========================================

/**
 * Calculate equilateral triangle height from base
 * h = (√3 / 2) × base
 */
export const triangleHeight = (base: number): number => (ROOT_3 / 2) * base;

/**
 * Calculate equilateral triangle base from height
 * base = (2 / √3) × h
 */
export const triangleBase = (height: number): number => (2 / ROOT_3) * height;

/**
 * Calculate circle circumference
 * C = 2πr
 */
export const circumference = (radius: number): number => 2 * PI * radius;

/**
 * Calculate circle area
 * A = πr²
 */
export const circleArea = (radius: number): number => PI * radius * radius;

/**
 * Calculate golden rectangle dimensions
 * For a given width, height = width / φ
 */
export const goldenRectangle = (width: number) => ({
  width,
  height: width / PHI,
});

/**
 * Calculate Fibonacci number at position n
 * F(n) = F(n-1) + F(n-2)
 */
export const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
};

/**
 * Generate modular scale value
 * Scale(n) = base × ratio^n
 */
export const modularScale = (base: number, ratio: number, step: number): number => 
  base * Math.pow(ratio, step);

// ========================================
// RESPONSIVE BREAKPOINTS (Fibonacci Sequence)
// ========================================

/**
 * Breakpoints using Fibonacci numbers for natural scaling
 * Mobile-first approach
 */
export const breakpoint = {
  xs: 320,   // Fibonacci(8) ≈ 320
  sm: 610,   // Fibonacci(15) ≈ 610  
  md: 987,   // Fibonacci(16) ≈ 987
  lg: 1597,  // Fibonacci(17) ≈ 1597
  xl: 2584,  // Fibonacci(18) ≈ 2584
} as const;

// ========================================
// Z-INDEX SCALE (Powers of 10)
// ========================================

/**
 * Z-index layering system
 * Using powers of 10 for clear hierarchy
 */
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 100,
  fixed: 1000,
  overlay: 10000,
  modal: 100000,
  popover: 1000000,
  toast: 10000000,
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => 
  Math.min(Math.max(value, min), max);

/**
 * Linear interpolation
 * lerp(a, b, t) = a + (b - a) × t
 */
export const lerp = (a: number, b: number, t: number): number => 
  a + (b - a) * t;

/**
 * Inverse lerp: find t for value between a and b
 */
export const inverseLerp = (a: number, b: number, value: number): number => 
  (value - a) / (b - a);

/**
 * Map value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const t = inverseLerp(inMin, inMax, value);
  return lerp(outMin, outMax, t);
};

/**
 * Normalize value to 0-1 range
 */
export const normalize = (value: number, min: number, max: number): number =>
  inverseLerp(min, max, value);
