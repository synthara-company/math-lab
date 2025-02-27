import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  sampleFunctions, 
  generateFunctionPoints, 
  generateDerivativePoints, 
  generateIntegralPoints,
  generateGradientColors
} from '../utils/mathFunctions';
import { Settings } from 'lucide-react';

interface VisualizationProps {
  width?: number;
  height?: number;
}

const CalculusVisualization: React.FC<VisualizationProps> = ({ 
  width = 800, 
  height = 500 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedFunction, setSelectedFunction] = useState<string>('sine');
  const [showDerivative, setShowDerivative] = useState<boolean>(true);
  const [showIntegral, setShowIntegral] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [xRange, setXRange] = useState<[number, number]>([-10, 10]);
  
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const drawVisualization = () => {
    if (!svgRef.current) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Get the selected function
    const func = sampleFunctions[selectedFunction as keyof typeof sampleFunctions];
    
    // Generate data points
    const [xValues, yValues] = generateFunctionPoints(func, xRange[0], xRange[1]);
    let yMin = Math.min(...yValues);
    let yMax = Math.max(...yValues);
    
    let derivativeYValues: number[] = [];
    if (showDerivative) {
      const [_, dYValues] = generateDerivativePoints(func, xRange[0], xRange[1]);
      derivativeYValues = dYValues;
      yMin = Math.min(yMin, ...dYValues);
      yMax = Math.max(yMax, ...dYValues);
    }
    
    let integralYValues: number[] = [];
    if (showIntegral) {
      const [_, iYValues] = generateIntegralPoints(func, xRange[0], xRange[1]);
      integralYValues = iYValues;
      yMin = Math.min(yMin, ...iYValues);
      yMax = Math.max(yMax, ...iYValues);
    }
    
    // Add some padding to y range
    const yPadding = (yMax - yMin) * 0.1;
    yMin -= yPadding;
    yMax += yPadding;
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([xRange[0], xRange[1]])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text('x');
    
    svg.append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text('y');
    
    // Create line generator
    const line = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveBasis);
    
    // Generate gradient colors based on derivative values
    const gradientColors = generateGradientColors(derivativeYValues);
    
    // Draw original function
    const functionData = xValues.map((x, i) => [x, yValues[i]] as [number, number]);
    
    // Create gradient path for original function
    for (let i = 0; i < functionData.length - 1; i++) {
      svg.append('path')
        .datum([functionData[i], functionData[i + 1]])
        .attr('fill', 'none')
        .attr('stroke', gradientColors[i])
        .attr('stroke-width', 3)
        .attr('d', line);
    }
    
    // Draw derivative if enabled
    if (showDerivative) {
      const derivativeData = xValues.map((x, i) => [x, derivativeYValues[i]] as [number, number]);
      svg.append('path')
        .datum(derivativeData)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 0, 0, 0.7)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('d', line);
      
      // Add legend for derivative
      svg.append('line')
        .attr('x1', innerWidth - 120)
        .attr('y1', 20)
        .attr('x2', innerWidth - 90)
        .attr('y2', 20)
        .attr('stroke', 'rgba(255, 0, 0, 0.7)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
      
      svg.append('text')
        .attr('x', innerWidth - 85)
        .attr('y', 25)
        .text('Derivative f\'(x)')
        .attr('font-size', '12px');
    }
    
    // Draw integral if enabled
    if (showIntegral) {
      const integralData = xValues.map((x, i) => [x, integralYValues[i]] as [number, number]);
      svg.append('path')
        .datum(integralData)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0, 128, 0, 0.7)')
        .attr('stroke-width', 2)
        .attr('d', line);
      
      // Add legend for integral
      svg.append('line')
        .attr('x1', innerWidth - 120)
        .attr('y1', 40)
        .attr('x2', innerWidth - 90)
        .attr('y2', 40)
        .attr('stroke', 'rgba(0, 128, 0, 0.7)')
        .attr('stroke-width', 2);
      
      svg.append('text')
        .attr('x', innerWidth - 85)
        .attr('y', 45)
        .text('Integral ∫f(x)dx')
        .attr('font-size', '12px');
    }
    
    // Add legend for original function
    svg.append('line')
      .attr('x1', innerWidth - 120)
      .attr('y1', 0)
      .attr('x2', innerWidth - 90)
      .attr('y2', 0)
      .attr('stroke', 'blue')
      .attr('stroke-width', 3);
    
    svg.append('text')
      .attr('x', innerWidth - 85)
      .attr('y', 5)
      .text('Function f(x)')
      .attr('font-size', '12px');
    
    // Add title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text(`Calculus Visualization: ${selectedFunction} function`);
  };
  
  useEffect(() => {
    drawVisualization();
  }, [selectedFunction, showDerivative, showIntegral, xRange]);
  
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
      
      {showSettings && (
        <div className="absolute top-12 right-2 bg-white p-4 rounded-lg shadow-lg z-10 w-64">
          <h3 className="text-lg font-semibold mb-3">Settings</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Function:</label>
            <select 
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="sine">Sine</option>
              <option value="cosine">Cosine</option>
              <option value="polynomial">Polynomial</option>
              <option value="exponential">Exponential</option>
              <option value="logistic">Logistic</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">X Range:</label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                value={xRange[0]}
                onChange={(e) => setXRange([Number(e.target.value), xRange[1]])}
                className="w-1/2 p-2 border rounded"
              />
              <input 
                type="number" 
                value={xRange[1]}
                onChange={(e) => setXRange([xRange[0], Number(e.target.value)])}
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={showDerivative}
                onChange={() => setShowDerivative(!showDerivative)}
                className="rounded"
              />
              <span>Show Derivative</span>
            </label>
          </div>
          
          <div className="mb-3">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={showIntegral}
                onChange={() => setShowIntegral(!showIntegral)}
                className="rounded"
              />
              <span>Show Integral</span>
            </label>
          </div>
        </div>
      )}
      
      <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default CalculusVisualization;