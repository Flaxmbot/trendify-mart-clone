import Image from "next/image";

const images = {
  main: {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/21-5008-5.webp?",
    alt: "Man in a yellow polo shirt against a dark teal background."
  },
  gallery: [
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/50_aee86587-1bf2-481e-9435-bcbd7909d174-6.webp?",
    alt: "Man in a dark polo shirt against a dark teal background."
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/14_8ecb9f54-d64c-4ad6-8433-1b765c48b9c5-7.webp?",
    alt: "Man in a red polo shirt against a dark teal background."
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/27_adede046-31bd-4b12-b79c-665dfb0abfdd-8.webp?",
    alt: "Man in a dark green polo shirt against a dark teal background."
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8eef21f3-4a52-4ae0-bfcf-d495c2edc784-trendifymartclothing-com/assets/images/3_e78e0dc7-7ab7-4851-9330-a200af4f6499-9.webp?",
    alt: "Man in a coral polo shirt against a dark background."
  }]

};

const galleryItemClasses = [
"lg:col-start-4 lg:row-start-1", // Item 0
"lg:col-start-5 lg:row-start-1", // Item 1
"lg:col-start-4 lg:row-start-2", // Item 2
"lg:col-start-5 lg:row-start-2" // Item 3
];

const PremiumPolosGallery = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="font-heading text-[2.75rem] leading-tight uppercase text-black">
            <em>
              <strong>PREMIUM POLOS</strong>
            </em>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 lg:grid-rows-2 gap-4">
          <div className="col-span-2 lg:col-span-3 lg:row-span-2 relative aspect-[3/4]">
            <Image
              src={images.main.src}
              alt={images.main.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 60vw"
              className="object-cover w-full h-full" />

          </div>

          {images.gallery.map((image, index) =>
          <div
            key={index}
            className={`relative aspect-[3/4] ${galleryItemClasses[index]}`}>

              <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1023px) 50vw, 20vw"
              className="object-cover w-full h-full" />

            </div>
          )}
        </div>
      </div>
    </section>);

};

export default PremiumPolosGallery;