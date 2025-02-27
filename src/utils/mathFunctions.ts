/**
 * Mathematical utility functions for calculus visualization
 */

// Function to calculate derivative of a function at a point
export const derivative = (func: (x: number) => number, x: number, h: number = 0.0001): number => {
  return (func(x + h) - func(x)) / h;
};

// Function to calculate definite integral using trapezoidal rule
export const integrate = (
  func: (x: number) => number, 
  a: number, 
  b: number, 
  n: number = 1000
): number => {
  const dx = (b - a) / n;
  let sum = 0.5 * (func(a) + func(b));
  
  for (let i = 1; i < n; i++) {
    const x = a + i * dx;
    sum += func(x);
  }
  
  return sum * dx;
};

// Generate points for a function
export const generateFunctionPoints = (
  func: (x: number) => number, 
  xMin: number, 
  xMax: number, 
  steps: number = 200
): [number[], number[]] => {
  const xValues: number[] = [];
  const yValues: number[] = [];
  const step = (xMax - xMin) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step;
    xValues.push(x);
    yValues.push(func(x));
  }
  
  return [xValues, yValues];
};

// Generate derivative points
export const generateDerivativePoints = (
  func: (x: number) => number, 
  xMin: number, 
  xMax: number, 
  steps: number = 200
): [number[], number[]] => {
  const xValues: number[] = [];
  const yValues: number[] = [];
  const step = (xMax - xMin) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step;
    xValues.push(x);
    yValues.push(derivative(func, x));
  }
  
  return [xValues, yValues];
};

// Generate integral points
export const generateIntegralPoints = (
  func: (x: number) => number, 
  xMin: number, 
  xMax: number, 
  steps: number = 200
): [number[], number[]] => {
  const xValues: number[] = [];
  const yValues: number[] = [];
  const step = (xMax - xMin) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step;
    // Calculate integral from xMin to current x
    yValues.push(integrate(func, xMin, x, 100));
    xValues.push(x);
  }
  
  return [xValues, yValues];
};

// Sample functions
export const sampleFunctions = {
  sine: (x: number) => Math.sin(x),
  cosine: (x: number) => Math.cos(x),
  polynomial: (x: number) => 0.1 * Math.pow(x, 3) - 0.5 * Math.pow(x, 2) + x,
  exponential: (x: number) => Math.exp(x / 3) * Math.sin(x),
  logistic: (x: number) => 1 / (1 + Math.exp(-x)),
};

// Generate gradient colors based on derivative values
export const generateGradientColors = (
  derivativeValues: number[], 
  minColor: [number, number, number] = [0, 0, 255], 
  maxColor: [number, number, number] = [255, 0, 0]
): string[] => {
  // Find min and max values
  const min = Math.min(...derivativeValues);
  const max = Math.max(...derivativeValues);
  const range = max - min;
  
  return derivativeValues.map(value => {
    // Normalize value between 0 and 1
    const normalizedValue = (value - min) / range;
    
    // Interpolate between colors
    const r = Math.round(minColor[0] + normalizedValue * (maxColor[0] - minColor[0]));
    const g = Math.round(minColor[1] + normalizedValue * (maxColor[1] - minColor[1]));
    const b = Math.round(minColor[2] + normalizedValue * (maxColor[2] - minColor[2]));
    
    return `rgb(${r}, ${g}, ${b})`;
  });
};