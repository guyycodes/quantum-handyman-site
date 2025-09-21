import React, { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'

const FloatingVideo = () => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef(null)

  // Set video playback speed to 80%
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.playbackRate = 0.75
    }
  }, [videoLoaded])

  return (
    <>
      {/* Background gradient blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-30"></div>
      
      {/* Glass-morphism video container */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
        {!videoError ? (
          <>
            <video 
              ref={videoRef}
              src="https://imgur.com/qWs4DVB.mp4"
              alt="Professional handyman service showcase"
              className="w-full h-[320px] object-cover transform scale-110 transition-transform duration-700"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              onLoadedData={() => {
                setVideoLoaded(true)
              }}
              onError={(e) => {
                setVideoError(true)
                console.error('Video failed to load:', e)
              }}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Play button overlay for mobile devices when video hasn't started */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10"
                   onClick={() => {
                     if (videoRef.current) {
                       videoRef.current.playbackRate = 0.8  // Set 80% speed
                       videoRef.current.play().catch(() => {
                         console.log('Video play was prevented')
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
              <h3 className="text-2xl font-bold mb-2">Quantum Handyman</h3>
              <p className="text-white/80">Professional Service • Quality Guaranteed</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default FloatingVideo
