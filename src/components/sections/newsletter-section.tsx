'use client';

import React from 'react';

const NewsletterSection = () => {
  return (
    <section className="bg-[#e0e8f0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-lg">
            <div
              className="h-full w-full bg-gray-300"
              role="img"
              aria-label="A desk with a notebook that says 'Contact us!', a vintage phone, and other office supplies."
            ></div>
          </div>
          <div className="text-left">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Subscribe to our emails
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              Be the first to know about new collections and exclusive offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-8">
              <div className="flex w-full max-w-md rounded-full border border-gray-300 bg-white p-1 shadow-sm focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 focus-within:ring-offset-[#e0e8f0]">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full flex-auto border-0 bg-transparent px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-full bg-[#27a598] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#208a7e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27a598]"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;