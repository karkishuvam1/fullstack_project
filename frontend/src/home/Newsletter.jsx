import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-16 bg-neutral-900 text-white px-8">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">
          Stay Connected With Lamborghini
        </h2>
        <p className="text-neutral-400 text-sm">
          Subscribe to receive exclusive news, event invitations, and model reveals.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL"
            className="bg-black border border-neutral-700 px-4 py-3 text-sm flex-1 focus:outline-none focus:border-yellow-500 text-white"
          />
          <button className="bg-yellow-500 text-black px-6 py-3 font-bold uppercase text-sm tracking-widest hover:bg-yellow-400 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;