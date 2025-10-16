import React from 'react';
import { Star, MessageSquare, ExternalLink } from 'lucide-react';
import BookingCTA from '../Components/BookingCTA';
import { useWorld } from '../contexts/WorldContext';

/**
 * REVIEW DATA TEMPLATE
 * 
 * Add your reviews to the REVIEWS array below following this format:
 * {
 *   id: 1,                                    // Unique ID for each review
 *   text: "Your review text here",            // What the customer said
 *   author: "John D.",                        // Customer name (can use initials for privacy)
 *   location: "Denver",                       // City or neighborhood
 *   rating: 5,                                // 1-5 star rating
 *   service: "Smart Home Installation",       // Type of service provided
 *   date: "March 2024",                       // When the service was provided (optional)
 *   verified: true,                           // Whether this is a verified customer (optional)
 *   highlight: "Professional and efficient"   // Short highlight phrase (optional)
 * }
 * 
 * EXAMPLE REAL REVIEW:
 * {
 *   id: 1,
 *   text: "Quantum Technician installed my entire smart home system including cameras, doorbell, and automated lights. Very professional, explained everything clearly, and cleaned up perfectly. The custom automation scripts he wrote work flawlessly!",
 *   author: "Sarah M.",
 *   location: "Highlands Ranch",  
 *   rating: 5,
 *   service: "Smart Home Installation",
 *   date: "October 2024",
 *   verified: true,
 *   highlight: "Expert installation"
 * }
 */

// Replace these placeholder reviews with real customer reviews as you get them
const REVIEWS = [
  {
    id: 1,
    text: "Morgan is reliable and efficient, he’s helped me with countless projects and has helped me put my place together to become my home. Highly recommend!",
    author: "Rachel P.",
    location: "Denver, CO",
    rating: 5,
    service: "Furniture Assembly, Smart Home Setup",
    date: "2025",
    verified: true,
    highlight: "Professional Service, Great Price"
  },
  {
    id: 2,
    text: "Excellent communication throughout the project. Fair pricing and attention to detail. Highly recommended!",
    author: "Coming Soon",
    location: "Metro Area",
    rating: 5,
    service: "Your Service",
    date: "2024",
    verified: false,
    highlight: "Quality Work"
  },
  {
    id: 3,
    text: "Solved our problem quickly and efficiently. Very knowledgeable and took time to explain everything. Great experience!",
    author: "Coming Soon",
    location: "Colorado",
    rating: 5,
    service: "Various Services",
    date: "2024",
    verified: false,
    highlight: "Problem Solver"
  }
];

const SocialProof = ({ content, reviewsRef, isVisible }) => {
  const { isTechnician, isWeb } = useWorld();
  
  // Calculate average rating
  const averageRating = REVIEWS.reduce((acc, review) => acc + review.rating, 0) / REVIEWS.length;
  const totalReviews = REVIEWS.length;
  
  // Separate real reviews from placeholders
  // Any review with author "Coming Soon" is considered a placeholder
  const realReviews = REVIEWS.filter(review => 
    review.author !== "Coming Soon"
  );
  const placeholderReviews = REVIEWS.filter(review => 
    review.author === "Coming Soon"
  );
  
  // Filter reviews by world if needed (optional - uncomment if you want world-specific reviews)
  // const filteredReviews = REVIEWS.filter(review => {
  //   if (isTechnician) return review.service.includes('Home') || review.service.includes('Furniture');
  //   if (isWeb) return review.service.includes('Web') || review.service.includes('Digital');
  //   return true;
  // });
  
  const displayReviews = REVIEWS; // or use filteredReviews if filtering
  
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            ref={reviewsRef}
            className={`animate-fade-up ${isVisible ? 'visible' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.title.split('Clients Say')[0]}
              <span className="gradient-text">Clients Say</span>
            </h2>
          </div>

          {/* Google Reviews Integration - Simplified */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Google Logo with Reviews Text and Stars */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <svg className="w-12 h-12" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  <span className="text-2xl font-bold text-gray-700">{content.googleTitle}</span>
                </div>
                {/* Star Rating Display */}
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              {/* View on Google Button */}
              <a
                href={content.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-5 h-5" />
                {content.googleButton}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Customer Reviews Grid - Mix of real reviews and loading skeletons */}
        <div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Show real reviews first */}
            {realReviews.map((review) => (
              <div 
                key={review.id} 
                className={`bg-white p-6 rounded-lg border ${
                  review.verified ? 'border-green-200' : 'border-gray-200'
                } hover:shadow-lg transition-shadow`}
              >
                {/* Star Rating */}
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < review.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`} 
                    />
                  ))}
                  {review.verified && (
                    <span className="ml-auto text-xs text-green-600 font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                
                {/* Highlight if exists */}
                {review.highlight && (
                  <p className="text-sm font-semibold text-primary mb-2">
                    "{review.highlight}"
                  </p>
                )}
                
                {/* Review Text */}
                <p className="text-gray-700 mb-3 italic">
                  "{review.text}"
                </p>
                
                {/* Author Info */}
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    - {review.author}
                  </p>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>{review.location}</span>
                    {review.date && <span>{review.date}</span>}
                  </div>
                  {review.service && (
                    <p className="text-xs text-gray-600 mt-1">
                      Service: {review.service}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Show loading skeletons for remaining placeholder reviews */}
            {placeholderReviews.map((_, idx) => (
              <div 
                key={`skeleton-${idx}`} 
                className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse"
              >
                {/* Stars skeleton */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                  ))}
                </div>
                
                {/* Highlight skeleton */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                
                {/* Review text skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
                
                {/* Author skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show loading indicator only if there are placeholder reviews */}
          {placeholderReviews.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Loading more reviews...</span>
              </div>
            </div>
          )}
          
          {/* More Reviews Link (optional - uncomment when you have more reviews) */}
          {/* {REVIEWS.length > 3 && (
            <div className="text-center mb-8">
              <button className="text-primary font-medium hover:underline">
                View all {REVIEWS.length} reviews →
              </button>
            </div>
          )} */}
          
          {/* CTA after proof */}
          <div className="text-center">
            <BookingCTA 
              buttonText={
                isTechnician ? "Get Your Quote" : 
                isWeb ? "Start Your Project" : 
                "Book a Project"
              }
              buttonStyle="primary"
              size="lg"
              showHelperText={true}
              helperText="⚡ Get instant AI estimates"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;