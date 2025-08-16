"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp, Send, MessageCircle, Package, Truck, RotateCcw } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this number on our tracking page or the carrier's website to monitor your package's journey. You can also log into your account to view order status and tracking information."
    },
    {
      id: 2,
      question: "What are your shipping options and costs?",
      answer: "We offer several shipping options: Standard shipping (5-7 business days) - Free on orders over $75, Express shipping (2-3 business days) - $9.99, Next-day delivery (1 business day) - $19.99. International shipping is available to select countries with rates calculated at checkout."
    },
    {
      id: 3,
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase for unworn, unwashed items with original tags. Items must be in original condition. Return shipping is free for defective items, otherwise customers are responsible for return shipping costs. Refunds are processed within 5-7 business days of receiving returned items."
    },
    {
      id: 4,
      question: "How do I exchange an item?",
      answer: "To exchange an item, initiate a return through your account or contact customer service. Once we receive your return, we'll process the exchange for your preferred size/color. If there's a price difference, we'll charge or refund accordingly. Exchanges follow the same 30-day window as returns."
    },
    {
      id: 5,
      question: "Do you offer size guides?",
      answer: "Yes! Each product page includes a detailed size guide with measurements. We recommend checking the size chart before ordering as sizes may vary between brands. If you're between sizes, we generally recommend sizing up. Our customer service team can also help with sizing questions."
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption. We also offer buy-now-pay-later options through select partners."
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    } catch (error) {
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              GET IN TOUCH
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Have questions? We're here to help. Reach out to our customer service team for quick and friendly assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                <span>support@trendifymart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-orange-500" />
                <span>1-800-TRENDY-1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-orange-500" />
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                          placeholder="Enter your full name"
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" className="text-sm text-red-500" role="alert">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                          placeholder="Enter your email"
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-sm text-red-500" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`transition-colors ${errors.subject ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                        placeholder="What's this about?"
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                      />
                      {errors.subject && (
                        <p id="subject-error" className="text-sm text-red-500" role="alert">
                          {errors.subject}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`min-h-[120px] transition-colors ${errors.message ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                        placeholder="Tell us how we can help you..."
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-sm text-red-500" role="alert">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 transition-colors"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email Us</h3>
                      <p className="text-gray-600">support@trendifymart.com</p>
                      <p className="text-sm text-gray-500">For general inquiries and support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Call Us</h3>
                      <p className="text-gray-600">1-800-TRENDY-1 (1-800-873-6391)</p>
                      <p className="text-sm text-gray-500">Toll-free customer service line</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Visit Us</h3>
                      <p className="text-gray-600">
                        123 Fashion District<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Service Hours */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <Clock className="w-6 h-6 text-orange-500" />
                    Service Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday:</span>
                      <span>9:00 AM - 8:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday:</span>
                      <span>10:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday:</span>
                      <span>12:00 PM - 5:00 PM EST</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Average Response Time:</strong><br />
                      Email: Within 24 hours<br />
                      Phone: Immediate during business hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-xl text-gray-600">
              Find quick answers to common questions about orders, shipping, and returns.
            </p>
          </div>
          
          <div className="grid gap-4">
            {faqData.map((faq) => (
              <Card key={faq.id} className="shadow-sm">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    aria-expanded={expandedFaq === faq.id}
                    aria-controls={`faq-content-${faq.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {faq.id === 1 && <Package className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                      {faq.id === 2 && <Truck className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                      {(faq.id === 3 || faq.id === 4) && <RotateCcw className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                      {faq.id > 4 && <MessageCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div
                      id={`faq-content-${faq.id}`}
                      className="px-6 pb-4 text-gray-600 animate-in slide-in-from-top-2 duration-300"
                    >
                      <div className="pl-8">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <Button 
              className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3"
              onClick={() => document.querySelector('#name').focus()}
            >
              Contact Customer Service
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}