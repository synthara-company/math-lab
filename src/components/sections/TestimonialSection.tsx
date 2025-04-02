import React from 'react';

const TestimonialSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-4">Early Access Feedback</h2>
      <p className="text-gray-600 text-center mb-12">What our beta testers are saying about Synthara</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 rounded-full p-2 mr-4">
              <span className="text-xs text-indigo-600 font-medium">BETA</span>
            </div>
            <p className="italic">"The interactive visualizations are exactly what I needed to grasp complex calculus concepts."</p>
          </div>
          <p className="font-semibold">- Early Access Participant, Mathematics Student</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 rounded-full p-2 mr-4">
              <span className="text-xs text-indigo-600 font-medium">BETA</span>
            </div>
            <p className="italic">"Looking forward to using this with my students when it launches."</p>
          </div>
          <p className="font-semibold">- Beta Program Educator</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">Synthara is currently in beta. Join our waitlist to be notified when we launch!</p>
      </div>
    </section>
  );
};

export default TestimonialSection;
