import React from 'react';
import CalculusVisualization from './components/CalculusVisualization';
import { Github } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Calculus Visualization</h1>
          <p className="mt-2 opacity-90">Interactive visualization of functions, derivatives, and integrals</p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          <section>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Interactive Calculus Explorer</h2>
              <p className="mb-6 text-gray-700">
                This visualization demonstrates the relationship between a function, its derivative (rate of change), 
                and its integral (accumulated area). The color gradient represents the intensity of the derivative, 
                showing how quickly the function is changing at each point.
              </p>
              
              <div className="mb-8">
                <CalculusVisualization width={800} height={500} />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-2">How to use this visualization:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Select different functions from the settings menu (gear icon)</li>
                  <li>Toggle the derivative and integral curves</li>
                  <li>Adjust the x-axis range to zoom in or out</li>
                  <li>Observe how the color gradient changes with the rate of change</li>
                  <li>Notice how the derivative is steepest where the function changes most rapidly</li>
                  <li>See how the integral accumulates the area under the curve</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">About Derivatives</h2>
              <p className="text-gray-700">
                The derivative f'(x) represents the rate of change of a function at any given point. 
                Geometrically, it's the slope of the tangent line to the function at that point. 
                Areas where the function changes rapidly have larger derivative values, shown by 
                more intense colors in the visualization.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">About Integrals</h2>
              <p className="text-gray-700">
                The integral ∫f(x)dx represents the accumulated area under the curve from a starting 
                point. It's the inverse operation of differentiation. In the visualization, you can 
                see how the integral curve grows as it accumulates area, with its slope matching the 
                original function's value at each point.
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Calculus Visualization</p>
            <div className="flex items-center mt-4 md:mt-0">
              <a href="https://github.com" className="text-white hover:text-blue-300 flex items-center" target="_blank" rel="noopener noreferrer">
                <Github size={20} className="mr-2" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;