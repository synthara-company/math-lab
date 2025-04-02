import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ChevronDown, Sliders, Eye, EyeOff, ChevronRight, Info, Zap, MousePointer, Grid3x3, Download, X, Move, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculusVisualizationProps {
  width: number;
  height: number;
}

interface FunctionConfig {
  amplitude: number;
  frequency: number;
  phase: number;
}

interface AnimationConfig {
  enabled: boolean;
  speed: number;
  parameter: 'amplitude' | 'frequency' | 'phase';
}

const CalculusVisualization: React.FC<CalculusVisualizationProps> = ({ width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedFunction, setSelectedFunction] = useState<string>('sin');
  const [showDerivative, setShowDerivative] = useState<boolean>(true);
  const [showSecondDerivative, setShowSecondDerivative] = useState<boolean>(false);
  const [showTangentLine, setShowTangentLine] = useState<boolean>(false);
  const [showArea, setShowArea] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showPoints, setShowPoints] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [config, setConfig] = useState<FunctionConfig>({
    amplitude: 1,
    frequency: 1,
    phase: 0,
  });
  const [animation, setAnimation] = useState<AnimationConfig>({
    enabled: false,
    speed: 0.05,
    parameter: 'phase'
  });
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number; derivative: number } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const handleTouchStart = () => {
    setIsTouching(true);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Animation frame request ID for cleanup
  const animationRef = useRef<number | null>(null);

  const functions = {
    sin: (x: number) => config.amplitude * Math.sin(config.frequency * x + config.phase),
    cos: (x: number) => config.amplitude * Math.cos(config.frequency * x + config.phase),
    tan: (x: number) => config.amplitude * Math.tan(config.frequency * x + config.phase) / 3,
    quadratic: (x: number) => config.amplitude * (x * x) / 4,
    cubic: (x: number) => config.amplitude * (x * x * x) / 8,
    exponential: (x: number) => config.amplitude * Math.exp(config.frequency * x / 2) / 2,
    log: (x: number) => config.amplitude * Math.log(Math.abs(x) + 1) * Math.sign(x),
    polynomial: (x: number) => config.amplitude * (x*x*x*x - 3*x*x) / 10,
  };

  const derivatives = {
    sin: (x: number) => config.amplitude * config.frequency * Math.cos(config.frequency * x + config.phase),
    cos: (x: number) => -config.amplitude * config.frequency * Math.sin(config.frequency * x + config.phase),
    tan: (x: number) => config.amplitude * config.frequency * (1 / Math.cos(config.frequency * x + config.phase)**2) / 3,
    quadratic: (x: number) => config.amplitude * x / 2,
    cubic: (x: number) => config.amplitude * (x * x) / 2.67,
    exponential: (x: number) => config.amplitude * config.frequency * Math.exp(config.frequency * x / 2) / 4,
    log: (x: number) => config.amplitude / (Math.abs(x) + 1),
    polynomial: (x: number) => config.amplitude * (4*x*x*x - 6*x) / 10,
  };

  const secondDerivatives = {
    sin: (x: number) => -config.amplitude * config.frequency * config.frequency * Math.sin(config.frequency * x + config.phase),
    cos: (x: number) => -config.amplitude * config.frequency * config.frequency * Math.cos(config.frequency * x + config.phase),
    tan: (x: number) => 2 * config.amplitude * config.frequency * config.frequency * Math.tan(config.frequency * x + config.phase) / Math.cos(config.frequency * x + config.phase)**2 / 3,
    quadratic: (x: number) => config.amplitude / 2,
    cubic: (x: number) => config.amplitude * x / 1.33,
    exponential: (x: number) => config.amplitude * config.frequency * config.frequency * Math.exp(config.frequency * x / 2) / 8,
    log: (x: number) => -config.amplitude / ((Math.abs(x) + 1) * (Math.abs(x) + 1)),
    polynomial: (x: number) => config.amplitude * (12*x*x - 6) / 10,
  };

  const functionLabels = {
    sin: 'Sine',
    cos: 'Cosine',
    tan: 'Tangent',
    quadratic: 'Quadratic',
    cubic: 'Cubic',
    exponential: 'Exponential',
    log: 'Logarithmic',
    polynomial: 'Polynomial',
  };

  const functionEquations = {
    sin: `f(x) = ${config.amplitude.toFixed(1)} · sin(${config.frequency.toFixed(1)}x + ${config.phase.toFixed(1)})`,
    cos: `f(x) = ${config.amplitude.toFixed(1)} · cos(${config.frequency.toFixed(1)}x + ${config.phase.toFixed(1)})`,
    tan: `f(x) = ${config.amplitude.toFixed(1)} · tan(${config.frequency.toFixed(1)}x + ${config.phase.toFixed(1)}) / 3`,
    quadratic: `f(x) = ${config.amplitude.toFixed(1)} · x² / 4`,
    cubic: `f(x) = ${config.amplitude.toFixed(1)} · x³ / 8`,
    exponential: `f(x) = ${config.amplitude.toFixed(1)} · e^(${config.frequency.toFixed(1)}x / 2) / 2`,
    log: `f(x) = ${config.amplitude.toFixed(1)} · ln(|x| + 1) · sgn(x)`,
    polynomial: `f(x) = ${config.amplitude.toFixed(1)} · (x⁴ - 3x²) / 10`,
  };

  // Reset all settings to default
  const resetSettings = () => {
    setIsResetting(true);
    setTimeout(() => setIsResetting(false), 1000);
    
    setConfig({
      amplitude: 1,
      frequency: 1,
      phase: 0,
    });
    setAnimation({
      enabled: false,
      speed: 0.05,
      parameter: 'phase'
    });
    setShowDerivative(true);
    setShowSecondDerivative(false);
    setShowTangentLine(false);
    setShowArea(false);
    setShowGrid(true);
    setShowPoints(false);
    setSelectedFunction('sin');
  };

  // Animation loop
  useEffect(() => {
    if (animation.enabled) {
      const animate = () => {
        setConfig(prevConfig => {
          let newValue = prevConfig[animation.parameter] + animation.speed;
          
          // Loop phase between -π and π
          if (animation.parameter === 'phase') {
            if (newValue > Math.PI) newValue = -Math.PI;
            if (newValue < -Math.PI) newValue = Math.PI;
          }
          
          return {
            ...prevConfig,
            [animation.parameter]: newValue
          };
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [animation]);

  // Rendering the visualization
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([-3, 3])
      .range([innerHeight, 0]);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', darkMode ? '#111827' : 'white')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add grid
    if (showGrid) {
      svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .attr('stroke', darkMode ? '#4b5563' : '#d1d5db')
        .call(d3.axisBottom(xScale)
          .tickSize(innerHeight)
          .tickFormat(() => '')
        );

      svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .attr('stroke', darkMode ? '#4b5563' : '#d1d5db')
        .call(d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
        );
    }

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight/2})`)
      .call(d3.axisBottom(xScale))
      .attr('color', darkMode ? '#9ca3af' : '#6b7280');

    svg.append('g')
      .attr('transform', `translate(${innerWidth/2},0)`)
      .call(d3.axisLeft(yScale))
      .attr('color', darkMode ? '#9ca3af' : '#6b7280');

    // Create line generator
    const line = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Generate points
    const points = d3.range(-5, 5.1, 0.1).map(x => [x, functions[selectedFunction](x)]);
    const derivativePoints = d3.range(-5, 5.1, 0.1).map(x => [x, derivatives[selectedFunction](x)]);
    const secondDerivativePoints = d3.range(-5, 5.1, 0.1).map(x => [x, secondDerivatives[selectedFunction](x)]);

    // Draw main function
    svg.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', darkMode ? '#818cf8' : '#4F46E5')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Draw derivative
    if (showDerivative) {
      svg.append('path')
        .datum(derivativePoints)
        .attr('fill', 'none')
        .attr('stroke', darkMode ? '#34d399' : '#10B981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('d', line);
    }

    // Draw second derivative
    if (showSecondDerivative) {
      svg.append('path')
        .datum(secondDerivativePoints)
        .attr('fill', 'none')
        .attr('stroke', darkMode ? '#f87171' : '#ef4444')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '2,2')
        .attr('d', line);
    }

    // Draw area under curve
    if (showArea) {
      const area = d3.area<[number, number]>()
        .x(d => xScale(d[0]))
        .y0(yScale(0))
        .y1(d => yScale(d[1]))
        .curve(d3.curveMonotoneX);

      svg.append('path')
        .datum(points)
        .attr('fill', darkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(79, 70, 229, 0.1)')
        .attr('stroke', 'none')
        .attr('d', area);
    }

    // Add points
    if (showPoints) {
      svg.selectAll('circle.function-points')
        .data(points.filter((_, i) => i % 10 === 0))
        .enter()
        .append('circle')
        .attr('class', 'function-points')
        .attr('cx', d => xScale(d[0]))
        .attr('cy', d => yScale(d[1]))
        .attr('r', 3)
        .attr('fill', darkMode ? '#818cf8' : '#4F46E5');

      if (showDerivative) {
        svg.selectAll('circle.derivative-points')
          .data(derivativePoints.filter((_, i) => i % 10 === 0))
          .enter()
          .append('circle')
          .attr('class', 'derivative-points')
          .attr('cx', d => xScale(d[0]))
          .attr('cy', d => yScale(d[1]))
          .attr('r', 2)
          .attr('fill', darkMode ? '#34d399' : '#10B981');
      }
    }

    // Add interactive overlay
    const overlay = svg.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    // Add tangent line and point
    const interactionGroup = svg.append('g');
    
    overlay.on('mousemove', (event) => {
      const [x] = d3.pointer(event);
      const xValue = xScale.invert(x);
      const yValue = functions[selectedFunction](xValue);
      const derivValue = derivatives[selectedFunction](xValue);
      
      setCurrentPoint({ 
        x: xValue, 
        y: yValue, 
        derivative: derivValue 
      });

      interactionGroup.selectAll('*').remove();

      // Add point marker
      interactionGroup.append('circle')
        .attr('cx', xScale(xValue))
        .attr('cy', yScale(yValue))
        .attr('r', 4)
        .attr('fill', darkMode ? '#f472b6' : '#ec4899')
        .attr('stroke', darkMode ? 'white' : 'black')
        .attr('stroke-width', 1);

      // Add vertical/horizontal guide lines
      interactionGroup.append('line')
        .attr('x1', xScale(xValue))
        .attr('y1', yScale(0))
        .attr('x2', xScale(xValue))
        .attr('y2', yScale(yValue))
        .attr('stroke', darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');

      interactionGroup.append('line')
        .attr('x1', xScale(0))
        .attr('y1', yScale(yValue))
        .attr('x2', xScale(xValue))
        .attr('y2', yScale(yValue))
        .attr('stroke', darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');

      if (showTangentLine) {
        const x1 = xValue - 2;
        const x2 = xValue + 2;
        const y1 = yValue - (2 * derivValue);
        const y2 = yValue + (2 * derivValue);

        interactionGroup.append('line')
          .attr('x1', xScale(x1))
          .attr('y1', yScale(y1))
          .attr('x2', xScale(x2))
          .attr('y2', yScale(y2))
          .attr('stroke', darkMode ? '#f472b6' : '#ec4899')
          .attr('stroke-width', 1.5);
      }
    });

    // Add function equation
    svg.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', darkMode ? 'white' : 'black')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '12px')
      .text(functionEquations[selectedFunction]);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth - 140}, 10)`);

    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 5)
      .attr('x2', 20)
      .attr('y2', 5)
      .attr('stroke', darkMode ? '#818cf8' : '#4F46E5')
      .attr('stroke-width', 3);

    legend.append('text')
      .attr('x', 25)
      .attr('y', 9)
      .attr('fill', darkMode ? 'white' : 'black')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px')
      .text('Function');

    if (showDerivative) {
      legend.append('line')
        .attr('x1', 0)
        .attr('y1', 25)
        .attr('x2', 20)
        .attr('y2', 25)
        .attr('stroke', darkMode ? '#34d399' : '#10B981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      legend.append('text')
        .attr('x', 25)
        .attr('y', 29)
        .attr('fill', darkMode ? 'white' : 'black')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .text('First Derivative');
    }

    if (showSecondDerivative) {
      legend.append('line')
        .attr('x1', 0)
        .attr('y1', 45)
        .attr('x2', 20)
        .attr('y2', 45)
        .attr('stroke', darkMode ? '#f87171' : '#ef4444')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '2,2');

      legend.append('text')
        .attr('x', 25)
        .attr('y', 49)
        .attr('fill', darkMode ? 'white' : 'black')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .text('Second Derivative');
    }

  }, [selectedFunction, showDerivative, showSecondDerivative, showGrid, showPoints, showTangentLine, showArea, config, darkMode]);

  // Export the graph as SVG
  const exportSVG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `calculus_${selectedFunction}_visualization.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div 
      className={`relative ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile instruction badge */}
      <div className="absolute top-2 left-2 sm:hidden z-10">
        <div className={`
          px-2 py-1 rounded-full text-xs 
          transition-opacity duration-300
          ${isTouching ? 'opacity-0' : 'opacity-100'}
          bg-black/20 backdrop-blur-sm text-white
        `}>
          Drag to explore
        </div>
      </div>

      {/* Floating controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} shadow-md`}
        >
          <Info className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} shadow-md`}
        >
          {darkMode ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
        <button 
          onClick={resetSettings}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} shadow-md`}
        >
          <motion.div
            animate={{ rotate: isResetting ? 360 : 0 }}
            transition={{ duration: 1 }}
          >
            <RotateCw className="h-5 w-5" />
          </motion.div>
        </button>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-16 right-4 z-10 w-64 p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Interactive Guide</h3>
              <button onClick={() => setIsInfoOpen(false)} className="p-1 rounded-full hover:bg-gray-700/50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm space-y-2">
              <p>Hover over the graph to see point values and tangent lines.</p>
              <p>Toggle different views using the control panel.</p>
              <p>Adjust function parameters in the settings.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel - Controls */}
          <div className={`w-full lg:w-80 flex-shrink-0 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-xl shadow-md`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Function Explorer</h2>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-lg ${isSettingsOpen ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')}`}
              >
                <Sliders className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Function Type</label>
                <div className="relative">
                  <select 
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value as keyof typeof functions)}
                    className={`w-full px-4 py-2 pr-8 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    {Object.entries(functionLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label} Function</option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Display Options</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setShowDerivative(!showDerivative)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${showDerivative ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')}`}
                  >
                    <Move className="h-4 w-4" />
                    Derivative
                  </button>
                  <button 
                    onClick={() => setShowSecondDerivative(!showSecondDerivative)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${showSecondDerivative ? (darkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')}`}
                  >
                    <Move className="h-4 w-4" />
                    2nd Deriv.
                  </button>
                  <button 
                    onClick={() => setShowTangentLine(!showTangentLine)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${showTangentLine ? (darkMode ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-800') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')}`}
                  >
                    <MousePointer className="h-4 w-4" />
                    Tangent
                  </button>
                  <button 
                    onClick={() => setShowArea(!showArea)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${showArea ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                    Area
                  </button>
                  <button 
                    onClick={() => setShowGrid(!showGrid)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${showGrid ? (darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                    Grid
                  </button>
                  <button 
                    onClick={() => setShowPoints(!showPoints)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${showPoints ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')}`}
                  >
                    <Move className="h-4 w-4" />
                    Points
                  </button>
                </div>
              </div>

              {/* Current point info */}
              {currentPoint && (
                <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm mb-1">Current Point:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>x: {currentPoint.x.toFixed(2)}</div>
                    <div>y: {currentPoint.y.toFixed(2)}</div>
                    <div>f'(x): {currentPoint.derivative.toFixed(2)}</div>
                    <div>Slope: {currentPoint.derivative.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings panel */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mt-4 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}
                >
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Function Parameters</h3>
                      <button 
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className={`text-xs flex items-center gap-1 ${darkMode ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-800'}`}
                      >
                        Advanced {isAdvancedOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={`block text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amplitude</label>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{config.amplitude.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={config.amplitude}
                            onChange={(e) => setConfig({ ...config, amplitude: parseFloat(e.target.value) })}
                            className="flex-1"
                          />
                          <button 
                            onClick={() => setAnimation({ 
                              enabled: !animation.enabled || animation.parameter !== 'amplitude', 
                              speed: animation.speed, 
                              parameter: 'amplitude' 
                            })}
                            className={`p-1 rounded ${animation.enabled && animation.parameter === 'amplitude' ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500') : (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300')}`}
                          >
                            <Zap className={`h-3 w-3 ${animation.enabled && animation.parameter === 'amplitude' ? 'text-white' : (darkMode ? 'text-gray-300' : 'text-gray-600')}`} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={`block text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Frequency</label>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{config.frequency.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={config.frequency}
                            onChange={(e) => setConfig({ ...config, frequency: parseFloat(e.target.value) })}
                            className="flex-1"
                          />
                          <button 
                            onClick={() => setAnimation({ 
                              enabled: !animation.enabled || animation.parameter !== 'frequency', 
                              speed: animation.speed, 
                              parameter: 'frequency' 
                            })}
                            className={`p-1 rounded ${animation.enabled && animation.parameter === 'frequency' ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500') : (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300')}`}
                          >
                            <Zap className={`h-3 w-3 ${animation.enabled && animation.parameter === 'frequency' ? 'text-white' : (darkMode ? 'text-gray-300' : 'text-gray-600')}`} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={`block text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phase</label>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{config.phase.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="-3.14"
                            max="3.14"
                            step="0.1"
                            value={config.phase}
                            onChange={(e) => setConfig({ ...config, phase: parseFloat(e.target.value) })}
                            className="flex-1"
                          />
                          <button 
                            onClick={() => setAnimation({ 
                              enabled: !animation.enabled || animation.parameter !== 'phase', 
                              speed: animation.speed, 
                              parameter: 'phase' 
                            })}
                            className={`p-1 rounded ${animation.enabled && animation.parameter === 'phase' ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500') : (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300')}`}
                          >
                            <Zap className={`h-3 w-3 ${animation.enabled && animation.parameter === 'phase' ? 'text-white' : (darkMode ? 'text-gray-300' : 'text-gray-600')}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isAdvancedOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                      >
                        <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Animation Settings</h4>
                        <div className="space-y-3">
                          <div>
                            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Speed</label>
                            <input
                              type="range"
                              min="0.01"
                              max="0.2"
                              step="0.01"
                              value={animation.speed}
                              onChange={(e) => setAnimation({ 
                                ...animation, 
                                speed: parseFloat(e.target.value) 
                              })}
                              className="w-full"
                            />
                            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {animation.speed.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Parameter</label>
                            <select
                              value={animation.parameter}
                              onChange={(e) => setAnimation({
                                ...animation,
                                parameter: e.target.value as 'amplitude' | 'frequency' | 'phase'
                              })}
                              className={`w-full text-xs px-2 py-1 rounded border ${
                                darkMode 
                                  ? 'bg-gray-600 border-gray-500 text-gray-100' 
                                  : 'bg-white border-gray-300 text-gray-700'
                              }`}
                            >
                              <option value="amplitude">Amplitude</option>
                              <option value="frequency">Frequency</option>
                              <option value="phase">Phase</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={exportSVG}
              className={`w-full mt-4 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-400'} text-white transition-colors`}
            >
              <Download className="h-4 w-4" />
              Export SVG
            </button>
          </div>

          {/* Right panel - Graph */}
          <div className="flex-1">
            <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
              <svg ref={svgRef} className="w-full h-full"></svg>
              
              {/* Equation display */}
              <div className={`absolute bottom-4 left-4 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700/90 text-white' : 'bg-white/90 text-gray-800'} shadow-sm text-sm font-mono`}>
                {functionEquations[selectedFunction]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculusVisualization;
