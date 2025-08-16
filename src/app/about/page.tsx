import { ArrowRight, Award, Globe, Users, Leaf, Lightbulb, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              ABOUT <span className="text-[#ff6b35]">TRENDIFYMART</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed opacity-90">
              Redefining premium fashion with exceptional polo shirts and t-shirts 
              that blend comfort, style, and sustainability.
            </p>
            <div className="w-24 h-1 bg-[#ff6b35] mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8 text-black">
                Our Story
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  Founded with a vision to revolutionize premium casual wear, TrendifyMart 
                  emerged from a simple belief: that exceptional quality shouldn't compromise style or sustainability.
                </p>
                <p>
                  Our journey began when we recognized the gap in the market for truly premium 
                  polo shirts and t-shirts that could seamlessly transition from casual to sophisticated settings.
                </p>
                <p>
                  Today, we're proud to be at the forefront of sustainable fashion, 
                  creating pieces that our customers treasure for years to come.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#ff6b35]/10 to-black/10 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-24 h-24 text-[#ff6b35] mx-auto mb-6" />
                  <h3 className="font-heading text-2xl font-bold text-black mb-4">Premium Quality</h3>
                  <p className="text-gray-600">
                    Every piece is crafted with meticulous attention to detail and premium materials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-black">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at TrendifyMart
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-[#ff6b35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-[#ff6b35]" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4 text-black">Quality First</h3>
                <p className="text-gray-600 leading-relaxed">
                  We source only the finest materials and employ rigorous quality control 
                  to ensure every garment meets our exceptional standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-[#ff6b35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-10 h-10 text-[#ff6b35]" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4 text-black">Sustainability</h3>
                <p className="text-gray-600 leading-relaxed">
                  Environmental responsibility is at our core. We use eco-friendly materials 
                  and sustainable production processes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-[#ff6b35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-10 h-10 text-[#ff6b35]" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4 text-black">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We continuously push boundaries in design and technology to create 
                  garments that exceed expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              By The Numbers
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Our impact and commitment to excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold font-heading mb-2">50K+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold font-heading mb-2">25+</div>
              <div className="text-gray-300">Countries Served</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold font-heading mb-2">4.9</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold font-heading mb-2">100%</div>
              <div className="text-gray-300">Sustainable Materials</div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story with Visuals */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-black">
              The TrendifyMart Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What sets us apart in the world of premium casual wear
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <h3 className="font-heading text-3xl font-bold mb-6 text-black">
                Crafted with Precision
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Every TrendifyMart piece undergoes a meticulous design and manufacturing process. 
                From initial sketches to final quality checks, we ensure perfection at every step.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Premium organic cotton sourcing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Advanced moisture-wicking technology</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Reinforced stitching for durability</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-32 h-32 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="aspect-square bg-gradient-to-br from-[#ff6b35]/10 to-[#ff6b35]/5 rounded-2xl flex items-center justify-center">
                <Leaf className="w-32 h-32 text-[#ff6b35]" />
              </div>
            </div>
            <div>
              <h3 className="font-heading text-3xl font-bold mb-6 text-black">
                Sustainable Future
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We're committed to reducing our environmental impact while creating beautiful, 
                long-lasting garments that you'll love wearing for years to come.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Carbon-neutral shipping</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Recyclable packaging materials</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Ethical manufacturing partnerships</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Experience Premium Quality
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join thousands of satisfied customers who've discovered the TrendifyMart difference. 
            Shop our collection of premium polo shirts and t-shirts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Shop Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}