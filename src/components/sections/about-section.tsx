import React from 'react';

const AboutSection = () => {
  return (
    <section 
      id="about" 
      className="bg-[#e0e8f0] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
          Welcome to TrendifyMart — your destination for bold, fresh, and wearable fashion.
        </h2>
        <p className="text-lg text-black/90 leading-relaxed max-w-3xl mb-10">
          At TrendifyMart, we don’t just follow trends — we set them. Our mission is simple: to make cutting-edge style accessible to everyone. Whether you’re dressing up, dressing down, or creating your own vibe, our collections are designed to elevate your look with zero compromise on comfort or quality.
        </p>
        <a 
          href="#" 
          className="inline-block bg-[#a9bcf5] text-black font-semibold text-base md:text-lg py-4 px-12 rounded-full transition-colors duration-300 ease-in-out hover:bg-[#97aee3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a9bcf5] focus:ring-offset-[#e0e8f0]"
        >
          Trend with us. Only at TrendifyMart.
        </a>
      </div>
    </section>
  );
};

export default AboutSection;