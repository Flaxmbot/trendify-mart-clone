import { Star } from "lucide-react";

const reviewData = [
  {
    name: "Hemendra Singh",
    rating: 5,
    text: "what an excellent product , delivery on time",
  },
  {
    name: "Harsh Gupta",
    rating: 4,
    text: "i like it really good product",
  },
  {
    name: "Ansh Singhania",
    rating: 4,
    text: "Mind Blowing quality ,loved with it",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex justify-center items-center gap-1 mb-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({ name, rating, text }: typeof reviewData[0]) => (
  <div className="relative">
    <div className="relative bg-[#fff0f5] rounded-xl shadow-lg p-6 text-center">
      <h3 className="font-heading font-bold text-xl text-black mb-2">{name}</h3>
      <StarRating rating={rating} />
      <p className="font-primary text-sm text-gray-800 px-2">{text}</p>
    </div>
    <div 
        className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fff0f5] rotate-45"
    ></div>
  </div>
);

const CustomerReviews = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-center uppercase tracking-wider mb-16 text-black">
          Customer Review
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {reviewData.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;