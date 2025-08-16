import HeroSection from '@/components/sections/hero-section';
import FeaturesBar from '@/components/sections/features-bar';
import PremiumPolosGallery from '@/components/sections/premium-polos-gallery';
import ProductShowcaseBar from '@/components/sections/product-showcase-bar';
import NewArrivals from '@/components/sections/new-arrivals';
import SmartTechPolos from '@/components/sections/smart-tech-polos';
import FeaturedCollection from '@/components/sections/featured-collection';
import InstagramSection from '@/components/sections/instagram-section';
import CustomerReviews from '@/components/sections/customer-reviews';
import AboutSection from '@/components/sections/about-section';
import NewsletterSection from '@/components/sections/newsletter-section';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesBar />
      <PremiumPolosGallery />
      <ProductShowcaseBar />
      <NewArrivals />
      <SmartTechPolos />
      <FeaturedCollection />
      <InstagramSection />
      <CustomerReviews />
      <AboutSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}