import React, { useState } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, Search, AlertCircle, Shield, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../Components/Footer';

// Content Management
const CONTENT = {
  meta: {
    title: 'Make a Payment | Quantum Handyman',
    description: 'Secure payment portal for Quantum Handyman services'
  },
  hero: {
    title: 'Make a Payment',
    subtitle: 'Enter your booking reference to proceed with payment'
  },
  form: {
    label: 'Booking Reference',
    placeholder: 'Enter your booking reference (e.g., QH-123456)',
    button: 'Find My Booking',
    searching: 'Searching...',
    helperText: 'You can find your booking reference in your confirmation email'
  },
  errors: {
    invalidFormat: 'Please enter a valid booking reference (e.g., QH-123456)',
    notFound: 'Booking not found. Please check your reference and try again.',
    alreadyPaid: 'This booking has already been paid.',
    serverError: 'Unable to connect to the server. Please try again later.'
  },
  booking: {
    title: 'Booking Details',
    labels: {
      reference: 'Booking Reference',
      name: 'Customer Name',
      service: 'Service',
      date: 'Date',
      time: 'Time',
      address: 'Address',
      price: 'Amount Due',
      status: 'Status'
    }
  },
  payment: {
    button: 'Pay Now',
    processing: 'Processing...',
    secure: 'Secure Payment',
    encrypted: '256-bit SSL Encrypted',
    poweredBy: 'Powered by Stripe'
  },
  security: {
    title: 'Payment Security',
    points: [
      'Your payment information is encrypted and secure',
      'We never store your credit card details',
      'All transactions are processed through Stripe',
      'PCI DSS compliant payment processing'
    ]
  }
};

// Stripe configuration
const STRIPE_CONFIG = {
  // Replace with your actual Stripe payment link or use Stripe Checkout
  paymentLinkBase: 'https://buy.stripe.com/test_YOUR_PAYMENT_LINK',
  // Or use Stripe.js for embedded checkout
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
};

const Payment = () => {
  const [bookingRef, setBookingRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);

  // Validate booking reference format
  const validateReference = (ref) => {
    // Format: QH-XXXXXX (6 digits)
    const pattern = /^QH-\d{6}$/;
    return pattern.test(ref);
  };

  // Lookup booking from Google Sheets via Apps Script
  const lookupBooking = async () => {
    setError('');
    setBookingData(null);

    // Validate format
    if (!validateReference(bookingRef)) {
      setError(CONTENT.errors.invalidFormat);
      return;
    }

    setLoading(true);

    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      
      if (!scriptUrl) {
        throw new Error('Payment system configuration missing');
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'lookupBooking',
          bookingRef: bookingRef
        })
      });

      const result = await response.json();

      if (result.success && result.booking) {
        // Check if already paid
        if (result.booking.paymentStatus === 'Paid') {
          setError(CONTENT.errors.alreadyPaid);
        } else {
          setBookingData(result.booking);
        }
      } else {
        setError(CONTENT.errors.notFound);
      }
    } catch (error) {
      console.error('Lookup error:', error);
      setError(CONTENT.errors.serverError);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment
  const handlePayment = () => {
    if (!bookingData) return;

    // Option 1: Redirect to Stripe Payment Link with metadata
    const paymentUrl = new URL(STRIPE_CONFIG.paymentLinkBase);
    paymentUrl.searchParams.set('client_reference_id', bookingData.bookingRef);
    paymentUrl.searchParams.set('prefilled_email', bookingData.email);
    
    // Add custom metadata
    const metadata = {
      booking_ref: bookingData.bookingRef,
      service: bookingData.service,
      customer_name: bookingData.name
    };
    
    // Redirect to Stripe
    window.location.href = paymentUrl.toString();

    // Option 2: Use Stripe.js for embedded checkout
    // This would require additional Stripe.js setup
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    lookupBooking();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
        <div className="container-max mx-auto px-6 py-12">
          {/* Back Button */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-500 rounded-full mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{CONTENT.hero.title}</h1>
            <p className="text-lg text-gray-600">{CONTENT.hero.subtitle}</p>
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            {!bookingData ? (
              /* Reference Lookup Form */
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="bookingRef" className="block text-sm font-medium text-gray-700 mb-2">
                      {CONTENT.form.label}
                    </label>
                    <input
                      type="text"
                      id="bookingRef"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                      placeholder={CONTENT.form.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      disabled={loading}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">{CONTENT.form.helperText}</p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !bookingRef}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {CONTENT.form.searching}
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        {CONTENT.form.button}
                      </>
                    )}
                  </button>
                </form>

                {/* Security Notice */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">{CONTENT.security.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {CONTENT.security.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* Booking Details & Payment */
              <div className="space-y-6">
                {/* Success Indicator */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-medium">Booking found! Please review the details below.</p>
                </div>

                {/* Booking Details */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{CONTENT.booking.title}</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{CONTENT.booking.labels.reference}</span>
                      <span className="font-semibold text-gray-900">{bookingData.bookingRef}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{CONTENT.booking.labels.name}</span>
                      <span className="font-medium text-gray-900">{bookingData.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{CONTENT.booking.labels.service}</span>
                      <span className="font-medium text-gray-900">{bookingData.service}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{CONTENT.booking.labels.date}</span>
                      <span className="font-medium text-gray-900">{formatDate(bookingData.date)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{CONTENT.booking.labels.time}</span>
                      <span className="font-medium text-gray-900">{formatTime(bookingData.time)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{CONTENT.booking.labels.address}</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs">{bookingData.address}</span>
                    </div>
                    <div className="flex justify-between py-4 bg-gradient-to-r from-blue-50 to-green-50 -mx-8 px-8 rounded-lg">
                      <span className="text-lg font-semibold text-gray-900">{CONTENT.booking.labels.price}</span>
                      <span className="text-2xl font-bold text-blue-600">{bookingData.price}</span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="mt-8">
                    <button
                      onClick={handlePayment}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02]"
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-lg">{CONTENT.payment.button}</span>
                    </button>
                    
                    {/* Payment Security Badges */}
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span>{CONTENT.payment.encrypted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span>{CONTENT.payment.poweredBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back to Search */}
                <button
                  onClick={() => {
                    setBookingData(null);
                    setBookingRef('');
                    setError('');
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Search Another Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Payment;