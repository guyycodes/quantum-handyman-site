import React, { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'

const FloatingVideo = () => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  // Lazy load video when it's about to be visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          // Delay video loading slightly to prioritize critical content
          setTimeout(() => setShouldLoadVideo(true), 100)
        }
      },
      { rootMargin: '50px' } // Start loading 50px before visible
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Set video playback speed to 80%
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.playbackRate = 0.75
    }
  }, [videoLoaded])

  return (
    <div ref={containerRef}>
      {/* Background gradient blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-30"></div>
      
      {/* Glass-morphism video container */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
        {!videoError ? (
          <>
            {shouldLoadVideo ? (
              <video 
                ref={videoRef}
                src="/QH_VID1.mp4"
                alt="Professional technician service showcase"
                className="w-full h-[320px] object-cover transform scale-110 transition-transform duration-700"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata" // Only load metadata initially
                poster="/images/home-repair/repair-thumb.jpg" // Add poster frame
                aria-hidden="true"
                onLoadedData={() => {
                  setVideoLoaded(true)
                }}
                onError={() => {
                  setVideoError(true)
                  // Silently handle video error and show fallback
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              /* Placeholder before video loads */
              <div className="w-full h-[320px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center text-white p-8 animate-pulse">
                  <div className="text-2xl font-bold mb-2">Quantum Technician</div>
                  <p className="text-white/80">Professional Service • Quality Guaranteed</p>
                </div>
              </div>
            )}
            
            {/* Play button overlay for mobile devices when video hasn't started */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10"
                   onClick={() => {
                     if (videoRef.current) {
                       videoRef.current.playbackRate = 0.8  // Set 80% speed
                       videoRef.current.play().catch(() => {
                         // Silently handle autoplay prevention (common on mobile)
                       })
                     }
                   }}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </div>
              </div>
            )}
            
            {/* Subtle overlay gradient for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </>
        ) : (
          /* Fallback if video fails to load */
          <div className="w-full h-[320px] md:h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="text-2xl font-bold mb-2">Quantum Technician</div>
              <p className="text-white/80">Professional Service • Quality Guaranteed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FloatingVideo
