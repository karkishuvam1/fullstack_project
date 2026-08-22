import React from 'react';

const Testimonials = () => {
  return (
    <section className="py-20 bg-black text-white px-8 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-xs uppercase tracking-widest text-yellow-500">Driving Experience</h2>
        <p className="text-2xl md:text-3xl font-light italic text-neutral-200">
          "Driving a Lamborghini is not just operating a motor vehicle—it is a visceral symphony of emotion, engineering, and raw power."
        </p>
        <span className="block text-sm text-neutral-500 uppercase tracking-wider font-bold">
          — Official Test Drive Review
        </span>
      </div>
    </section>
  );
};

export default Testimonials;