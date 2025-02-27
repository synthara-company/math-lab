# Calculus Visualization

An interactive web application for visualizing calculus concepts, including functions, derivatives, and integrals.

![Calculus Visualization Screenshot](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80)

## Overview

This application provides an intuitive, visual way to understand the relationships between mathematical functions, their derivatives, and their integrals. Using interactive visualizations with color gradients representing rates of change, it helps users develop a deeper understanding of fundamental calculus concepts.

## Features

- **Interactive Function Visualization**: View mathematical functions with color gradients representing the rate of change
- **Multiple Function Types**: Choose from sine, cosine, polynomial, exponential, and logistic functions
- **Derivative and Integral Visualization**: Toggle visibility of derivative and integral curves
- **Customizable View**: Adjust the x-axis range to zoom in or out
- **Color Gradient Mapping**: Colors represent the intensity of the derivative (rate of change)
- **Educational Context**: Includes explanations about derivatives and integrals

## Mathematical Implementation

The application implements several key mathematical concepts:

- **Numerical Differentiation**: Uses the finite difference method to calculate derivatives
- **Numerical Integration**: Implements the trapezoidal rule for calculating definite integrals
- **Color Mapping**: Maps derivative values to a color gradient to visualize rate of change

## Technologies Used

- **React**: Frontend UI framework
- **TypeScript**: Type-safe JavaScript
- **D3.js**: Data visualization library for rendering mathematical curves
- **Tailwind CSS**: Utility-first CSS framework for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bniladridas/calculus_visualization.git
   cd calculus_visualization
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application is deployed on Vercel and can be accessed at: https://calculus-visualization.vercel.app

## Usage Guide

1. **Select a Function**: Use the settings menu (gear icon) to choose from different mathematical functions
2. **Adjust Range**: Change the x-axis range to zoom in or out on specific parts of the function
3. **Toggle Curves**: Show or hide the derivative and integral curves
4. **Observe Relationships**: Notice how:
   - The derivative is steepest where the function changes most rapidly
   - The integral accumulates the area under the curve
   - The color gradient intensity corresponds to the rate of change

## Educational Value

This visualization is particularly useful for:

- Students learning calculus concepts
- Teachers demonstrating the relationships between functions, derivatives, and integrals
- Anyone interested in mathematical visualization and interactive learning

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT

## Acknowledgements

- D3.js for the powerful visualization capabilities
- React and TypeScript for the application framework
- Tailwind CSS for the styling system
