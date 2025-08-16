import React from 'react';

const featuresList = [
    { icon: '🔍', text: 'Compact Design' },
    { icon: '💪', text: 'Durable Material' },
    { icon: '💻', text: 'User-friendly Interface' },
    { icon: '🚀', text: 'Efficient Performance' },
];

const MarqueeContent = ({ uniqueKeyPrefix }: { uniqueKeyPrefix: string }) => (
    <div className="flex-shrink-0 flex items-center min-w-full animate-marquee">
        {featuresList.map((feature, index) => (
            <p key={`${uniqueKeyPrefix}-${index}`} className="flex items-center mx-6 text-base font-medium text-white sm:mx-8">
                <span className="mr-3 text-xl" aria-hidden="true">{feature.icon}</span>
                {feature.text}
            </p>
        ))}
    </div>
);

const FeaturesBar = () => {
  return (
    <section className="w-full overflow-hidden bg-black py-4">
      <div className="flex whitespace-nowrap">
        <MarqueeContent uniqueKeyPrefix="first" />
        <MarqueeContent uniqueKeyPrefix="second" />
      </div>
    </section>
  );
};

export default FeaturesBar;