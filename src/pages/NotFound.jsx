import React from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, ArrowLeft, Wrench } from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  errorCode: '404',
  title: 'Page Not Found',
  message: 'Looks like this page needs fixing! The page you\'re looking for doesn\'t exist or has been moved.',
  buttons: {
    goHome: 'Go Home',
    goBack: 'Go Back'
  }
}

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="relative mb-6">
          <div className="text-9xl font-bold text-gray-200">{CONTENT.errorCode}</div>
          <Wrench className="w-16 h-16 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <h1 className="text-2xl font-bold text-near-black mb-4">
          {CONTENT.title}
        </h1>
        
        <p className="text-muted mb-8">
          {CONTENT.message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
          >
            <HomeIcon className="w-5 h-5" />
            {CONTENT.buttons.goHome}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {CONTENT.buttons.goBack}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
