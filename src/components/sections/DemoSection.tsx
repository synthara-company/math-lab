import React, { useEffect, useRef } from 'react';
import { Settings, Share2, Info, ChevronDown, Smartphone } from 'lucide-react';
import CalculusVisualization from '../CalculusVisualization';

interface DemoSectionProps {
  showDemo: boolean;
}

const DemoSection: React.FC<DemoSectionProps> = ({ showDemo }) => {
  const demoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (showDemo && demoRef.current) {
      demoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDemo]);

  const demoFeatures = [
    { 
      title: "Interactive Functions",
      description: "Explore various mathematical functions with adjustable parameters",
      icon: <Settings className="h-5 w-5 text-indigo-600" />
    },
    { 
      title: "Real-time Derivatives",
      description: "Visualize derivatives and tangent lines as you move across the graph",
      icon: <Info className="h-5 w-5 text-teal-600" />
    },
    { 
      title: "Customization",
      description: "Adjust amplitude, frequency, and phase to understand their effects",
      icon: <Share2 className="h-5 w-5 text-purple-600" />
    }
  ];

  if (!showDemo) return null;

  return (
    <section ref={demoRef} id="demo-section" className="relative mb-20">
      {/* Mobile Orientation Hint - Shows briefly on mobile */}
      <div className="sm:hidden absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center touch-hint">
        <div className="text-center text-white px-6 py-4 rounded-lg">
          <div className="mb-3 flex justify-center">
            <Smartphone className="h-6 w-6 rotate-90 animate-[rotate_2s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm">Rotate your phone for better experience</p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-800">Synthara Interactive Visualization</h2>
            <p className="text-gray-600">Experience mathematics through Synthara's dynamic visualization engine.</p>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white">
          <CalculusVisualization width={800} height={500} />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoFeatures.map((item, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
