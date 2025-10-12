import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, AlertCircle, Shield, Loader2, Mail, Hash, FileText, Briefcase, TrendingUp, Clock, CheckCircle2, Filter, RefreshCw, X, MapPin, Calendar, DollarSign, Bot, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import EstimateCard from '../Components/portal/EstimateCard';
import JobCard from '../Components/portal/JobCard';
import JobPaymentModal from '../Components/portal/JobPaymentModal';
import useStripe from '../hooks/useStripe';
import useGoogleScript from '../hooks/useGoogleScript';
import { useWorld } from '../contexts/WorldContext';

// Content Management
const CONTENT = {
  meta: {
    title: 'Portal | Quantum Technician',
    description: 'Track your estimates, jobs, and payments with Quantum Technician'
  },
  hero: {
    title: 'Portal',
    subtitle: 'Track your estimates, jobs, and payments in one place, no sign up required'
  },
  search: {
    title: 'Find Your Items',
    placeholder: {
      reference: 'Enter reference (e.g., QH-250922-E790-4C2)',
      email: 'Enter your email address'
    },
    buttons: {
      searchRef: 'Search by Reference',
      searchEmail: 'Search by Email',
      searching: 'Searching...'
    },
    tabs: {
      reference: 'Reference Number',
      email: 'Email Address'
    }
  },
  errors: {
    invalidReference: 'Please enter a valid reference (e.g., QH-250922-E790-4C2 or EST-250922-C2CA-9A3)',
    invalidEmail: 'Please enter a valid email address',
    notFound: 'No items found. Please check your search and try again.',
    serverError: 'Unable to connect to the server. Please try again later.'
  },
  filters: {
    all: 'All Items',
    estimates: 'Estimates',
    jobs: 'Jobs',
    needsAction: 'Needs Action'
  },
  filterControls: {
    button: 'Filters',
    active: 'Active',
    refresh: 'Refresh'
  },
  advancedFilters: {
    title: 'Advanced Filters',
    clearAll: 'Clear All',
    summary: 'Showing {filtered} of {total} items with filters applied',
    
    // Job Filters
    jobAddress: {
      label: 'Job Address Attribute',
      placeholder: 'Search by address...'
    },
    jobDate: {
      label: 'Job Date'
    },
    paymentStatus: {
      label: 'Payment Status',
      options: {
        all: 'All',
        paid: 'Paid',
        pending: 'Pending',
        completedUnpaid: 'Completed Unpaid'
      }
    },
    
    estimateType: {
      label: 'Estimate Type',
      options: {
        all: 'All',
        ai: 'AI Estimates',
        manual: 'Manual Estimates'
      }
    },
  },
  stats: {
    total: 'Total Items',
    estimates: 'Estimates',
    activeJobs: 'Active Jobs',
    needsPayment: 'Needs Payment'
  },
  empty: {
    title: 'No Items Found',
    message: 'Enter a reference number or email address to view your items.',
    noResults: 'No items match your current filter'
  },
  security: {
    title: 'Your Data is Secure',
    points: [
      'No password required - access your items with just a reference or email',
      'Secure payment processing through Stripe',
      'Your information is encrypted and protected'
    ]
  },
  navigation: {
    backToHome: 'Back to Home',
    searchAnother: 'Search Another Booking'
  }
};

const Portal = () => {
  const [searchType, setSearchType] = useState('reference'); // 'reference' or 'email'
  const [searchValue, setSearchValue] = useState('');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Always starts closed
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [paymentPopupBlocked, setPaymentPopupBlocked] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  
  // Job-specific filters
  const [addressFilter, setAddressFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  
  // Estimate-specific filters
  const [estimateTypeFilter, setEstimateTypeFilter] = useState('all');
  
  const [isMobile, setIsMobile] = useState(false);
  
  // Use custom hooks
  const { createJobPayment, openStripeCheckout } = useStripe();
  const { loading, error, setError, lookupByReference, lookupByEmail } = useGoogleScript();
  
  // Use world context to determine the correct home path
  const { currentWorld } = useWorld();
  const location = useLocation();
  
  // Get the world-aware home path
  const getHomePath = () => {
    // Check if we're in a world-specific route
    if (location.pathname.includes('/technician')) {
      return '/technician';
    } else if (location.pathname.includes('/web')) {
      return '/web';
    } else if (currentWorld) {
      // Use the current world context
      return `/${currentWorld}`;
    }
    // Default to root
    return '/';
  };
  
  // Initialize and scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobile(isMobileDevice());
    
    // Ensure filters are closed on component mount
    setShowFilters(false);
    // Optionally clear all filters on mount (uncomment if desired)
    clearAllFilters();
  }, []);
  
  // Validate reference format
  const validateReference = (ref) => {
    // Updated formats:
    // Job: QH-YYMMDD-XXXX-XXX (e.g., QH-250922-E790-4C2)
    // Estimate: EST-YYMMDD-XXXX-XXX (e.g., EST-250922-C2CA-9A3)
    // Also support legacy format: QH-XXXXXX or EST-XXXXXX
    const patterns = [
      /^QH-\d{6}-[A-Z0-9]{4}-[A-Z0-9]+$/i,   // New job format
      /^EST-\d{6}-[A-Z0-9]{4}-[A-Z0-9]+$/i,  // New estimate format
      /^QH-\d{6}$/,                           // Legacy job format
      /^EST-\d{6}$/                           // Legacy estimate format
    ];
    
    return patterns.some(pattern => pattern.test(ref));
  };

  // Better mobile detection
  const isMobileDevice = () => {
    // Method 1: Touch capability + screen size
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    
    // Method 2: User agent (as backup)
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Method 3: Check for mobile-specific APIs
    const hasMobileApis = 'orientation' in window || 'DeviceMotionEvent' in window;
    
    // Combine checks: must have touch AND (small screen OR mobile user agent OR mobile APIs)
    return hasTouchScreen && (isSmallScreen || mobileUserAgent || hasMobileApis);
  };
  
  // Validate email format
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };
  
  // Search function
  const handleSearch = async () => {
    setError('');
    setItems([]);
    
    // Reset filters when performing a new search
    setShowFilters(false); // Close the filter panel
    clearAllFilters(); // Clear all filter values
   
    // Validate input
    if (searchType === 'reference') {
      if (!validateReference(searchValue)) {
        setError(CONTENT.errors.invalidReference);
        return;
      }
    } else {
      if (!validateEmail(searchValue)) {
        setError(CONTENT.errors.invalidEmail);
        return;
      }
    }
    
    // Use the hook to perform the lookup
    const result = searchType === 'reference'
      ? await lookupByReference(searchValue)
      : await lookupByEmail(searchValue);
    
    if (result.success) {
      if (result.items && result.items.length > 0) {
        setItems(result.items);
      } else {
        setError(CONTENT.errors.notFound);
      }
    } else {
      setError(result.error || CONTENT.errors.notFound);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    if (!searchValue || loading) return;
    setRefreshing(true);
    await handleSearch();
    setRefreshing(false);
  };
  
  // Handle payment navigation - shows intermediate modal
  const handlePayment = async (job) => {
    // Reset any previous payment state
    setPaymentPopupBlocked(false);
    setCheckoutUrl(null);
    // Set selected job and show payment modal
    setSelectedJob(job);
    setShowPaymentModal(true);
  };
  
  // Handle Stripe payment from modal
  const handleStripePayment = async (paymentDetails) => {
    console.log('💳 Processing Stripe payment with tip:', paymentDetails);
    
    // If we already have a checkout URL (popup was blocked), just retry with existing URL
    if (paymentPopupBlocked && checkoutUrl) {
      handleRetryPayment();
      return;
    }
    
    try {
      // Use the useStripe hook to create job payment with tip
      const result = await createJobPayment(selectedJob['Booking Reference'], paymentDetails.tipAmount);
      
      if (result.success) {
        // Store the checkout URL in case we need it for retry
        setCheckoutUrl(result.url);
        
        // Show payment details briefly (optional)
        if (result.jobDetails) {
          console.log('Payment details:', {
            total: `$${result.jobDetails.totalAmount}`,
            depositPaid: `$${result.jobDetails.depositPaid}`,
            amountDue: `$${result.jobDetails.amountDue}`,
            tip: `$${paymentDetails.tipAmount}`
          });
        }
        
        // Open Stripe checkout in popup
        const checkoutResult = openStripeCheckout(
          result.url,
          async (paymentResult) => {
            if (paymentResult.success) {
              // Payment successful - refresh the list to update payment status
              setShowPaymentModal(false);
              setSelectedJob(null);
              setPaymentPopupBlocked(false);
              setCheckoutUrl(null);
              await handleRefresh();
              alert('Payment successful! Thank you for your payment.');
            } else if (paymentResult.cancelled) {
              // Payment cancelled
              alert('Payment was cancelled. You can try again when ready.');
            } else if (paymentResult.closed) {
              // Popup was closed
              alert('Payment window was closed. You can try again when ready.');
            }
          },
          (blockedInfo) => {
            // Popup was blocked - show in modal instead of alert
            setPaymentPopupBlocked(true);
            // checkoutUrl already set above
          }
        );
      } else {
        alert(result.error || 'Unable to process payment. Please try again or contact support.');
        console.error('Payment error:', result.error);
      }
    } catch (error) {
      alert('Payment system error. Please contact support.');
      console.error('Payment error:', error);
    }
  };
  
  // Handle retry payment after popup was blocked
  const handleRetryPayment = () => {
    if (checkoutUrl) {
      const checkoutResult = openStripeCheckout(
        checkoutUrl,
        async (result) => {
          if (result.success) {
            console.log('✅ Job payment completed successfully!');
            setShowPaymentModal(false);
            setSelectedJob(null);
            setPaymentPopupBlocked(false);
            setCheckoutUrl(null);
            await handleRefresh();
            alert('Payment successful! Thank you for your payment.');
          } else if (result.cancelled) {
            console.log('❌ Payment cancelled');
            // Keep modal open so user can try again
          } else if (result.closed) {
            console.log('🔴 Payment window closed');
            // Keep modal open so user can try again
          }
        },
        (blockInfo) => {
          // alert('Popup still blocked...');
          console.warn('🚫 Payment popup still blocked');
          // Keep the blocked state - popup is still blocked
        }
      );
    }
  };
  
  // Handle Venmo payment from modal
  const handleVenmoPayment = (paymentDetails) => {
    console.log('💜 Venmo payment selected with details:', paymentDetails);
    
    const venmoUsername = "QuantumTechnician";
    const note = `Payment for Job ${selectedJob['Booking Reference']} - ${selectedJob['Service']}`;
    
    const amount = paymentDetails.totalAmount.toFixed(2);
    
    const venmoAppLink = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${encodeURIComponent(note)}`;
    const venmoWebLink = `https://venmo.com/${venmoUsername}`;
    
    console.log('📱 Mobile detection details:', {
      isMobile,
      hasTouchScreen: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      isSmallScreen: window.matchMedia("(max-width: 768px)").matches,
      userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints
    });
    
    if (isMobile) {
      // Try app first
      window.location.href = venmoAppLink;
      
      // Fallback to web
      // setTimeout(() => {
      //   window.open(venmoWebLink, '_blank');
      // }, 100);
    } else {
      // Desktop: go straight to web
      window.open(venmoWebLink, '_blank');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  
  // Clear all filters
  const clearAllFilters = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Clear all filter states
    setAddressFilter('');
    setDateFilter('');
    setPaymentStatusFilter('all');
    setEstimateTypeFilter('all');
    
    // Force state update by using a callback
    setTimeout(() => {
      // This forces React to re-evaluate hasActiveFilters
      setShowFilters(prevState => prevState);
    }, 0);
  };
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return addressFilter || dateFilter || paymentStatusFilter !== 'all' || 
           estimateTypeFilter !== 'all';
  };
  
  // Filter items based on selected filter and additional filters
  const getFilteredItems = () => {
    if (!items || items.length === 0) return [];
    
    let filtered = items;
    
    // First apply main category filter
    switch (filter) {
      case 'estimates':
        filtered = items.filter(item => item.itemType === 'estimate');
        break;
      case 'jobs':
        filtered = items.filter(item => item.itemType === 'booking');
        break;
      case 'needsAction':
        filtered = items.filter(item => 
          (item.itemType === 'estimate' && item.displayStatus === 'pending') ||
          (item.itemType === 'booking' && item['Payment Status'] === 'completed_unpaid') ||
          (item.itemType === 'booking' && item['Progress'].toLowerCase().includes('on hold'))
        );
        break;
    }
    
    // Apply additional filters for jobs
    filtered = filtered.filter(item => {
      if (item.itemType === 'booking') {
        // Address filter for jobs
        if (addressFilter && !item['Address']?.toLowerCase().includes(addressFilter.toLowerCase())) {
          return false;
        }
        
        // Date filter for jobs
        if (dateFilter) {
          // Extract just the date part (YYYY-MM-DD) from the ISO string
          const jobDateOnly = item['Date'] ? item['Date'].split('T')[0] : '';
          if (jobDateOnly !== dateFilter) {
            return false;
          }
        }
        
        // Payment status filter
        if (paymentStatusFilter !== 'all') {
          const paymentStatus = item['Payment Status'] || 'Pending';
          if (paymentStatusFilter === 'paid' && paymentStatus !== 'Paid') return false;
          if (paymentStatusFilter === 'pending' && paymentStatus !== 'Pending') return false;
          if (paymentStatusFilter === 'completedUnpaid' && paymentStatus !== 'completed_unpaid') return false;
        }
      }
      
      // Apply additional filters for estimates
      if (item.itemType === 'estimate') {
        // Estimate type filter
        if (estimateTypeFilter !== 'all') {
          const isAI = item['Type'] === 'AI' || item['AI Processed'] === 'Yes';
          if (estimateTypeFilter === 'ai' && !isAI) return false;
          if (estimateTypeFilter === 'manual' && isAI) return false;
        }
      }
      
      return true;
    });
    
    return filtered;
  };
  
  // Calculate stats
  const getStats = () => {
    const estimates = items.filter(item => item.itemType === 'estimate');
    const jobs = items.filter(item => item.itemType === 'booking');
    const activeJobs = jobs.filter(job => 
      job.displayStatus === 'upcoming' || job.displayStatus === 'in_progress'
    );
    const needsPayment = jobs.filter(job => job.displayStatus === 'completed_unpaid');
    
    return {
      total: items.length,
      estimates: estimates.length,
      activeJobs: activeJobs.length,
      needsPayment: needsPayment.length
    };
  };
  
  const filteredItems = getFilteredItems();
  const stats = getStats();
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-6">
        <div className="container-max mx-auto px-6 py-4">
          {/* Back Button - World Aware */}
          <Link 
            to={getHomePath()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{CONTENT.navigation.backToHome}</span>
          </Link>
          
          {/* Hero Section */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-500 rounded-full mb-6 shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{CONTENT.hero.title}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{CONTENT.hero.subtitle}</p>
          </div>
          
          {/* Search Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{CONTENT.search.title}</h2>
              
              {/* Search Type Tabs */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => {
                      setSearchType('reference');
                      setSearchValue('');
                      setError('');
                      setItems([]); // Clear previous results
                      setShowFilters(false); // Close filters when switching search type
                    }}
                    className={`px-6 py-2 rounded-md transition-all ${
                      searchType === 'reference'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Hash className="w-4 h-4 inline mr-2" />
                    {CONTENT.search.tabs.reference}
                  </button>
                  <button
                    onClick={() => {
                      setSearchType('email');
                      setSearchValue('');
                      setError('');
                      setItems([]); // Clear previous results
                      setShowFilters(false); // Close filters when switching search type
                    }}
                    className={`px-6 py-2 rounded-md transition-all ${
                      searchType === 'email'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    {CONTENT.search.tabs.email}
                  </button>
                </div>
              </div>
              
              {/* Search Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type={searchType === 'email' ? 'email' : 'text'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(searchType === 'reference' ? e.target.value.toUpperCase() : e.target.value)}
                    placeholder={searchType === 'reference' ? CONTENT.search.placeholder.reference : CONTENT.search.placeholder.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    disabled={loading}
                    required
                  />
                </div>
                
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !searchValue}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {CONTENT.search.buttons.searching}
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      {searchType === 'reference' ? CONTENT.search.buttons.searchRef : CONTENT.search.buttons.searchEmail}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Results Section */}
          {items.length > 0 && (
            <div className="max-w-7xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{CONTENT.stats.total}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{CONTENT.stats.estimates}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.estimates}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-500 opacity-50" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{CONTENT.stats.activeJobs}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{CONTENT.stats.needsPayment}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.needsPayment}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
                  </div>
                </div>
              </div>
              
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  {Object.entries(CONTENT.filters).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setFilter(key);
                        // Close filters panel if switching to All Items or Needs Action
                        if (key === 'all' || key === 'needsAction') {
                          setShowFilters(false);
                          // Optionally clear filters when switching to All Items
                          if (key === 'all') {
                            clearAllFilters();
                          }
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === key
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                      }`}
                    >
                      {label}
                      {key === 'needsAction' && stats.needsPayment > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {stats.needsPayment}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {filter !== 'needsAction' && filter !== 'all' && (
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2 ${showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-lg shadow hover:shadow-lg transition-all`}
                    >
                      <Filter className="w-4 h-4" />
                      {CONTENT.filterControls.button}
                      {hasActiveFilters() && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {CONTENT.filterControls.active}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {CONTENT.filterControls.refresh}
                  </button>
                </div>
              </div>
              
              {/* Advanced Filters Panel */}
              {showFilters && filter !== 'needsAction' && filter !== 'all' && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-fadeIn">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{CONTENT.advancedFilters.title}</h3>
                    <div className="flex gap-2">
                      {hasActiveFilters() && (
                        <button
                          onClick={(e) => clearAllFilters(e)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          type="button"
                        >
                          {CONTENT.advancedFilters.clearAll}
                        </button>
                      )}
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Job Filters - Show when viewing all or jobs */}
                    {(filter === 'all' || filter === 'jobs') && (
                      <>
                        {/* Address Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {CONTENT.advancedFilters.jobAddress.label}
                          </label>
                          <input
                            type="text"
                            value={addressFilter}
                            onChange={(e) => setAddressFilter(e.target.value)}
                            placeholder={CONTENT.advancedFilters.jobAddress.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        
                        {/* Date Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {CONTENT.advancedFilters.jobDate.label}
                          </label>
                          <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        
                        {/* Payment Status Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            {CONTENT.advancedFilters.paymentStatus.label}
                          </label>
                          <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="all">{CONTENT.advancedFilters.paymentStatus.options.all}</option>
                            <option value="paid">{CONTENT.advancedFilters.paymentStatus.options.paid}</option>
                            <option value="pending">{CONTENT.advancedFilters.paymentStatus.options.pending}</option>
                            <option value="completedUnpaid">{CONTENT.advancedFilters.paymentStatus.options.completedUnpaid}</option>
                          </select>
                        </div>
                        
                      </>
                    )}
                    
                    {/* Estimate Filters - Show when viewing all or estimates */}
                    {(filter === 'all' || filter === 'estimates') && (
                      <>
                        {/* Estimate Type Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Bot className="w-4 h-4 inline mr-1" />
                            {CONTENT.advancedFilters.estimateType.label}
                          </label>
                          <select
                            value={estimateTypeFilter}
                            onChange={(e) => setEstimateTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="all">{CONTENT.advancedFilters.estimateType.options.all}</option>
                            <option value="ai">{CONTENT.advancedFilters.estimateType.options.ai}</option>
                            <option value="manual">{CONTENT.advancedFilters.estimateType.options.manual}</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Active Filters Summary */}
                  {hasActiveFilters() && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        {CONTENT.advancedFilters.summary
                          .replace('{filtered}', filteredItems.length.toString())
                          .replace('{total}', items.length.toString())}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Items Grid */}
              {filteredItems.length > 0 ? (
                <div className="grid gap-6">
                  {filteredItems.map((item, index) => (
                    <div key={`${item.itemType}-${item['Booking Reference'] || item['Estimate Reference']}-${index}`}>
                      {item.itemType === 'estimate' ? (
                        <EstimateCard estimate={item} onRefresh={handleRefresh} />
                      ) : (
                        <JobCard job={item} onPayment={handlePayment} onRefresh={handleRefresh} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{CONTENT.empty.noResults}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && items.length === 0 && !error && (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-xl shadow-lg p-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{CONTENT.empty.title}</h3>
                <p className="text-gray-600">{CONTENT.empty.message}</p>
              </div>
            </div>
          )}
          
          {/* Security Notice */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{CONTENT.security.title}</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {CONTENT.security.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Payment Modal */}
      <JobPaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedJob(null);
          setPaymentPopupBlocked(false);
          setCheckoutUrl(null); // Clear checkout URL when closing
        }}
        job={selectedJob}
        onStripePayment={handleStripePayment}
        onVenmoPayment={handleVenmoPayment}
        popupBlocked={paymentPopupBlocked}
        onRetryPayment={handleRetryPayment}
        isMobile={isMobile}
      />
    </>
  );
};

export default Portal;