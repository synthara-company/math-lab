import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-4">Interactive Graphs</h3>
          <p>Manipulate and explore mathematical functions in real-time</p>
        </div>
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-4">Step-by-Step Solutions</h3>
          <p>Follow detailed explanations of calculus concepts</p>
        </div>
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-4">Visual Learning</h3>
          <p>Understand complex concepts through intuitive visualizations</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;