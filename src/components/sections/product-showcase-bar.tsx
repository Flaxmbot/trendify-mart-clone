import Image from 'next/image';

const poloItem = {
  type: 'item' as const,
  text: 'POLO',
  icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/image-with-text-1-variant-9-image_2-10.png?',
};

const pocketIdentityItem = {
  type: 'item' as const,
  text: 'POCKET IDENTITY',
  icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/download-11.jpg?',
};

const badgeItem = {
  type: 'badge' as const,
  text: '50% OFF',
};

const marqueeSequence = [
  poloItem,
  pocketIdentityItem,
  poloItem,
  pocketIdentityItem,
  badgeItem,
  poloItem,
  pocketIdentityItem,
  poloItem,
  pocketIdentityItem,
];

// This component uses a `marquee` keyframe animation.
// It is assumed this is defined in a global CSS file (like globals.css)
// and configured in tailwind.config.js to be used with `animate-marquee`.
// For this implementation, we use Tailwind's arbitrary value support.
// @keyframes marquee {
//   0% { transform: translateX(0%); }
//   100% { transform: translateX(-50%); }
// }

const ProductShowcaseBar = () => {
  // The sequence is duplicated to create a seamless-looping animation effect
  const animatedItems = [...marqueeSequence, ...marqueeSequence];

  return (
    <section className="bg-white py-4 overflow-hidden" aria-label="Product Showcase">
      <div className="flex animate-[marquee_40s_linear_infinite]">
        {animatedItems.map((item, index) => (
          <div key={index} className="flex-shrink-0 flex items-center mx-10 whitespace-nowrap">
            {item.type === 'item' ? (
              <>
                <h2 className="font-heading font-bold text-5xl text-black uppercase tracking-wider">
                  {item.text}
                </h2>
                <Image
                  src={item.icon}
                  alt={item.text}
                  width={58}
                  height={58}
                  className="ml-6"
                />
              </>
            ) : (
              <div className="bg-red-600 text-white font-heading font-bold text-4xl uppercase tracking-wider px-5 py-3 rounded-lg flex items-center justify-center">
                {item.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcaseBar;