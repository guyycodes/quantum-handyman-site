import React from 'react'
import { Wrench, Code, Home as HomeIcon, TreePine } from 'lucide-react'

const FloatingServiceCard = () => {
  const services = [
    { id: 'home-repairs', title: 'Home Repairs', icon: HomeIcon },
    { id: 'landscaping', title: 'Landscaping', icon: TreePine },
    { id: 'web-dev', title: 'Web Development', icon: Code },
    { id: 'smart-home', title: 'Smart Home', icon: Wrench }
  ]

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-30"></div>
      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <service.icon className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm font-medium">{service.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default FloatingServiceCard
