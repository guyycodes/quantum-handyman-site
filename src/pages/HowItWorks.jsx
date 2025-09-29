import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Calendar, Mail, User, Check, 
  Search, Eye, MessageSquare, Smartphone, 
  ArrowRight, ChevronRight, Monitor, Zap,
  Home, Calculator, BookOpen, Loader
} from 'lucide-react';
import Header from '../Components/Header'
import BookingCTA from '../Components/BookingCTA';
import { sendContactEmail } from '../services/emailService';

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    badge: 'Simple & Transparent Process',
    title: 'How It',
    titleHighlight: 'Works',
    subtitle: "Book services in minutes, track everything in one place. We've made home improvement as easy as ordering pizza! 🍕"
  },
  bookingProcess: {
    title: 'Book in 4 Simple Steps..',
    subtitle: 'No phone calls needed - book 24/7 online',
    readyText: 'Ready to book? It takes less than 60 seconds!'
  },
  specialServices: {
    badge: 'Special Options',
    title: 'Need Something Different?',
    freeEstimate: {
      title: 'Free Estimates',
      description: 'Not sure what you need? Get a free professional estimate with optional AI analysis for detailed pricing.',
      cta: 'No commitment required →'
    },
    urgentService: {
      title: 'Urgent Service',
      description: 'Need help ASAP? Select urgent booking for same-day or next-day service (rush fee applies).',
      cta: 'Available 7 days/week →'
    }
  },
  portal: {
    badge: 'Customer Portal',
    title: 'Track Everything in One Place',
    subtitle: 'Your personal dashboard for all projects, estimates, and communications',
    accessTitle: 'How to Access Your Portal',
    steps: {
      reference: {
        title: 'Get Your Reference',
        description: 'Receive a unique reference number after booking'
      },
      visit: {
        title: 'Visit Portal',
        description: 'Click the Portal button in the header'
      },
      enter: {
        title: 'Enter Details',
        description: 'Use your reference or email to view projects'
      }
    },
    ctaText: 'Go to Portal'
  },
  mobileApp: {
    badge: 'Coming Soon',
    title: 'Mobile App in Development',
    subtitle: 'Track projects, book services, communicate with your Quantum handyman, and more! - all from your device!',
    form: {
      placeholder: 'Enter your email for early access',
      submitButton: 'Get Early Access',
      submitting: 'Signing Up...',
      success: "✓ You're on the list! We'll notify you when the app launches.",
      error: 'Something went wrong. Please try again or contact us directly.'
    },
    emailSubject: 'Mobile App Early Access',
    emailMessage: 'Mobile App Pre-Release Signup Request'
  },
  bottomCTA: {
    title: 'Ready to Get Started?',
    subtitle: "Join thousands of happy customers who've simplified their home improvement"
  }
};

const HowItWorks = () => {
  const [earlyAccessEmail, setEarlyAccessEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Booking process steps
  const bookingSteps = [
    {
      icon: FileText,
      title: 'Choose Service',
      description: 'Pick a package or request a free estimate',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Calendar,
      title: 'Select Date & Pick Time',
      description: 'Choose a convenient date & time',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: User,
      title: 'Your Details',
      description: 'Provide contact info and project details',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Check,
      title: 'Confirm',
      description: 'Review and submit your booking',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: Mail,
      title: 'Follow Up',
      description: 'We\'ll follow up to confirm service & answer questions',
      color: 'bg-teal-100 text-teal-600'
    }
  ];

  // Portal features
  const portalFeatures = [
    {
      icon: Search,
      title: 'Track Projects',
      description: 'View all your bookings and estimates with reference numbers',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Eye,
      title: 'Real-Time Updates',
      description: 'See job status, completion dates, and AI-generated insights',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Access notes, updates, and communicate with your handyman',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  // Handle early access signup
  const handleEarlyAccessSubmit = async (e) => {
    e.preventDefault();
    if (!earlyAccessEmail) return;
    
    setIsSubmitting(true);
    try {
      await sendContactEmail({
        name: CONTENT.mobileApp.emailSubject,
        email: earlyAccessEmail,
        message: `${CONTENT.mobileApp.emailMessage}\n\nEmail: ${earlyAccessEmail}\n\nUser wants early access to the upcoming mobile app.`,
        service: CONTENT.mobileApp.emailSubject
      });
      
      setSubmitStatus('success');
      setEarlyAccessEmail('');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting early access:', error);
      setSubmitStatus('error');
      
      // Clear error message after 5 seconds  
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            {CONTENT.hero.badge}
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {CONTENT.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">{CONTENT.hero.titleHighlight}</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {CONTENT.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Booking Process Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {CONTENT.bookingProcess.title}
            </h2>
            <p className="text-lg text-gray-600">
              {CONTENT.bookingProcess.subtitle}
            </p>
          </div>

          {/* Desktop Flow Diagram */}
          <div className="hidden lg:block mb-16">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -translate-y-1/2" />
              
              <div className="relative grid grid-cols-5 gap-4">
                {bookingSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                      <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
                        <step.icon className="w-8 h-8" />
                      </div>
                      
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        { index === 4 ? 'Follow Up' : `Step ${index + 1}` }
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    
                    {index < bookingSteps.length - 1 && (
                      <ChevronRight className="absolute top-1/2 -right-6 -translate-y-1/2 w-8 h-8 text-gray-300 z-10" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="lg:hidden space-y-4 mb-16">
            {bookingSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-100">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600">Step {index + 1}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < bookingSteps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <BookingCTA 
              buttonStyle="primary"
              className="inline-flex"
              showHelperText={false}
            />
            <p className="mt-4 text-gray-600">
              {CONTENT.bookingProcess.readyText}
            </p>
          </div>
        </div>
      </section>

      {/* Special Services Callout */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            {CONTENT.specialServices.badge}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {CONTENT.specialServices.title}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100">
              <Calculator className="w-10 h-10 text-green-600 mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">{CONTENT.specialServices.freeEstimate.title}</h4>
              <p className="text-gray-600 text-sm mb-4">
                {CONTENT.specialServices.freeEstimate.description}
              </p>
              <span className="text-green-600 font-medium text-sm">{CONTENT.specialServices.freeEstimate.cta}</span>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border border-orange-100">
              <Home className="w-10 h-10 text-orange-600 mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">{CONTENT.specialServices.urgentService.title}</h4>
              <p className="text-gray-600 text-sm mb-4">
                {CONTENT.specialServices.urgentService.description}
              </p>
              <span className="text-orange-600 font-medium text-sm">{CONTENT.specialServices.urgentService.cta}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Portal Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Monitor className="w-4 h-4" />
              {CONTENT.portal.badge}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {CONTENT.portal.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {CONTENT.portal.subtitle}
            </p>
          </div>

          {/* Portal Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {portalFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* How to Access Portal */}
          <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">
                {CONTENT.portal.accessTitle}
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-1">{CONTENT.portal.steps.reference.title}</h4>
                  <p className="text-sm text-blue-100">
                    {CONTENT.portal.steps.reference.description}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-1">{CONTENT.portal.steps.visit.title}</h4>
                  <p className="text-sm text-blue-100">
                    {CONTENT.portal.steps.visit.description}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-1">{CONTENT.portal.steps.enter.title}</h4>
                  <p className="text-sm text-blue-100">
                    {CONTENT.portal.steps.enter.description}
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Link 
                  to="/portal" 
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
                >
                  <Monitor className="w-5 h-5" />
                  {CONTENT.portal.ctaText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Coming Soon */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Smartphone className="w-4 h-4" />
            {CONTENT.mobileApp.badge}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {CONTENT.mobileApp.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {CONTENT.mobileApp.subtitle}
          </p>
          
          {/* Early Access Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleEarlyAccessSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={CONTENT.mobileApp.form.placeholder}
                value={earlyAccessEmail}
                onChange={(e) => setEarlyAccessEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !earlyAccessEmail}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {CONTENT.mobileApp.form.submitting}
                  </>
                ) : (
                  CONTENT.mobileApp.form.submitButton
                )}
              </button>
            </form>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <p className="mt-3 text-green-600 text-sm font-medium">
                {CONTENT.mobileApp.form.success}
              </p>
            )}
            {submitStatus === 'error' && (
              <p className="mt-3 text-red-600 text-sm">
                {CONTENT.mobileApp.form.error}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {CONTENT.bottomCTA.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {CONTENT.bottomCTA.subtitle}
          </p>
          <BookingCTA 
            buttonStyle="primary"
            className="inline-flex"
            showHelperText={true}
          />
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
