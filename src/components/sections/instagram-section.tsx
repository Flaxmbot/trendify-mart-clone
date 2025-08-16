import Image from 'next/image';
import Link from 'next/link';
import { Instagram as InstagramIcon } from 'lucide-react';

const WaveDivider = ({ className }: { className?: string }) => (
  <div className={`leading-[0px] ${className}`}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-auto w-full">
      <path
        d="M1440 60L0 60 0 55.2754C240 47.9079 480 34.3644 720 34.3644C960 34.3644 1200 47.9079 1440 55.2754L1440 60z"
        fill="#212121"
        opacity="0.1"
      ></path>
      <path
        d="M1440 60L0 60 0 44.5508C240 40.8672 480 32.1332 720 32.1332C960 32.1332 1200 40.8672 1440 44.5508L1440 60z"
        fill="#212121"
        opacity="0.1"
      ></path>
      <path
        d="M1440 60L0 60 0 33.8262C240 28.1432 480 20.3068 720 20.3068C960 20.3068 1200 28.1432 1440 33.8262L1440 60z"
        fill="#212121"
      ></path>
    </svg>
  </div>
);

const instagramPosts = [
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/social-1-variant-5-image_1-29.png?",
    alt: "Fashion lifestyle post on Instagram 1",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/social-1-variant-5-image_2-30.png?",
    alt: "Fashion lifestyle post on Instagram 2",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/social-1-variant-5-image_1-29.png?",
    alt: "Fashion lifestyle post on Instagram 3",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/social-1-variant-5-image_2-30.png?",
    alt: "Fashion lifestyle post on Instagram 4",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/social-1-variant-5-image_1-29.png?",
    alt: "Fashion lifestyle post on Instagram 5",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/social-1-variant-5-image_2-30.png?",
    alt: "Fashion lifestyle post on Instagram 6",
  },
];

const InstagramSection = () => {
  return (
    <section className="bg-[#fff0f5]">
      <WaveDivider className="transform -scale-y-100" />
      <div className="container mx-auto px-4 py-16 text-center sm:py-24">
        <h5 className="font-heading text-sm font-medium uppercase tracking-[0.1em] text-black">
          INSTAGRAM
        </h5>
        <h2 className="mt-4 font-heading text-4xl font-bold uppercase text-black sm:text-5xl">
          FOLLOW THE TREND
        </h2>
        <Link
          href="https://trendifymartclothing.com/#"
          className="font-primary mt-4 inline-block text-base text-black underline"
        >
          @trendifymart.clothing
        </Link>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {instagramPosts.map((post, index) => (
            <Link
              href="https://trendifymartclothing.com/"
              key={index}
              className="group relative block aspect-square overflow-hidden"
            >
              <Image
                src={post.src}
                alt={post.alt}
                width={500}
                height={500}
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <InstagramIcon className="h-8 w-8 text-white" />
                <p className="mt-2 text-lg text-white">@trendifymart.clothing</p>
                <button className="mt-4 rounded-full border border-white px-6 py-2 text-xs font-semibold uppercase text-white transition-colors hover:bg-white hover:text-black">
                  FOLLOW US
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <WaveDivider />
    </section>
  );
};

export default InstagramSection;