import React, { useEffect, useRef } from 'react'
import { Code, Wifi, Wrench, Home, Hammer, Settings, Zap, Shield, Car, GlassWater } from 'lucide-react'

/**
 * Represents a Fibonacci sphere.
 * @class
 */
class FibonacciSphere {
  #points

  get points() {
    return this.#points
  }

  constructor(N) {
    this.#points = []
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const radius = Math.sqrt(1 - y ** 2)
      const a = goldenAngle * i
      const x = Math.cos(a) * radius
      const z = Math.sin(a) * radius

      this.#points.push([x, y, z])
    }
  }
}

/**
 * Represents a 3D quantum sphere animation.
 * @class
 */
class QuantumCloud {
  constructor(root) {
    this.root = root
    this.size = this.root.offsetWidth
    this.elements = root.querySelectorAll('.quantum-element')
    this.sphere = new FibonacciSphere(this.elements.length)
    this.rotationAxis = [1, 0, 0]
    this.rotationAngle = 0
    this.rotationSpeed = 0.005
    this.frameRequestId = null
    this.mouseX = 0
    this.mouseY = 0
    this.targetRotationSpeed = 0.005

    this.updatePositions()
    this.initEventListeners()
    this.root.classList.add('sphere-loaded')
  }

  initEventListeners() {
    window.addEventListener('resize', this.handleResize.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  handleResize() {
    this.size = this.root.offsetWidth
    this.updatePositions()
  }

  updatePositions() {
    const sin = Math.sin(this.rotationAngle)
    const cos = Math.cos(this.rotationAngle)
    const ux = this.rotationAxis[0]
    const uy = this.rotationAxis[1]
    const uz = this.rotationAxis[2]

    const rotationMatrix = [
      [
        cos + (ux ** 2) * (1 - cos),
        ux * uy * (1 - cos) - uz * sin,
        ux * uz * (1 - cos) + uy * sin,
      ],
      [
        uy * ux * (1 - cos) + uz * sin,
        cos + (uy ** 2) * (1 - cos),
        uy * uz * (1 - cos) - ux * sin,
      ],
      [
        uz * ux * (1 - cos) - uy * sin,
        uz * uy * (1 - cos) + ux * sin,
        cos + (uz ** 2) * (1 - cos)
      ]
    ]

    const N = this.elements.length

    for (let i = 0; i < N; i++) {
      const x = this.sphere.points[i][0]
      const y = this.sphere.points[i][1]
      const z = this.sphere.points[i][2]

      const transformedX =
        rotationMatrix[0][0] * x +
        rotationMatrix[0][1] * y +
        rotationMatrix[0][2] * z
      const transformedY =
        rotationMatrix[1][0] * x +
        rotationMatrix[1][1] * y +
        rotationMatrix[1][2] * z
      const transformedZ =
        rotationMatrix[2][0] * x +
        rotationMatrix[2][1] * y +
        rotationMatrix[2][2] * z

      const translateX = this.size * transformedX / 1.55 +20
      const translateY = this.size * transformedY / 2.25
      const scale = (transformedZ + 2) / 3
      const transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`
      const opacity = (transformedZ + 1.5) / 2.5

      this.elements[i].style.transform = transform
      this.elements[i].style.opacity = opacity
      this.elements[i].style.zIndex = Math.floor((transformedZ + 1) * 100)
    }
  }

  onMouseMove(e) {
    const rootRect = this.root.getBoundingClientRect()
    const deltaX = e.clientX - (rootRect.left + this.root.offsetWidth / 2)
    const deltaY = e.clientY - (rootRect.top + this.root.offsetHeight / 2)
    const a = Math.atan2(deltaX, deltaY) - Math.PI / 2
    const axis = [Math.sin(a), Math.cos(a), 0]
    const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    const speed = delta / Math.max(window.innerHeight, window.innerWidth) / 100

    this.rotationAxis = axis
    this.targetRotationSpeed = Math.min(speed, 0.02) // Cap the speed
  }

  update() {
    // Smooth rotation speed transitions
    this.rotationSpeed += (this.targetRotationSpeed - this.rotationSpeed) * 0.05
    this.rotationAngle += this.rotationSpeed

    this.updatePositions()
  }

  start() {
    this.update()
    this.frameRequestId = requestAnimationFrame(this.start.bind(this))
  }

  stop() {
    if (this.frameRequestId) {
      cancelAnimationFrame(this.frameRequestId)
    }
  }

  destroy() {
    this.stop()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousemove', this.onMouseMove)
  }
}

const QuantumSphere = ({ children, className = '' }) => {
  const sphereRef = useRef(null)
  const cloudInstanceRef = useRef(null)

  // Service icons and labels for the quantum sphere
  const quantumElements = [
    { icon: Code, label: 'Web Development', color: '#a855f7' },
    { icon: Wifi, label: 'Smart Home', color: '#06b6d4' },
    { icon: Wrench, label: 'Home Repairs', color: '#3b82f6' },
    { icon: Home, label: 'Landscape', color: '#10b981' },
    { icon: Hammer, label: 'Furniture', color: '#f97316' },
    { icon: Settings, label: 'Tech Solutions', color: '#ec4899' },
    { icon: Car, label: 'Paint Correction', color: '#eab308' },
    { icon: GlassWater, label: 'Irrigation', color: '#6366f1' }
  ]

  useEffect(() => {
    if (sphereRef.current && !cloudInstanceRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        cloudInstanceRef.current = new QuantumCloud(sphereRef.current)
        cloudInstanceRef.current.start()
      }, 100)
    }

    return () => {
      if (cloudInstanceRef.current) {
        cloudInstanceRef.current.destroy()
        cloudInstanceRef.current = null
      }
    }
  }, [])

  // Container styles
  const containerStyles = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  // Sphere wrapper styles
  const sphereStyles = {
    position: 'absolute',
    width: '600px',
    height: '600px',
    pointerEvents: 'none'
  }

  // Element styles
  const elementStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '60px',
    height: '60px',
    marginLeft: '-30px',
    marginTop: '-30px',
    pointerEvents: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
  }

  const elementInnerStyles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    padding: '8px',
    transition: 'all 0.3s ease'
  }

  const labelStyles = {
    fontSize: '9px',
    color: 'white',
    marginTop: '4px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    opacity: 0.9
  }

  return (
    <div style={containerStyles} className={className}>
      {/* The nucleus - children content */}
      <div style={{ position: 'relative', zIndex: 50 }}>
        {children}
      </div>
      
      {/* The orbiting sphere */}
      <div 
        ref={sphereRef}
        style={sphereStyles}
        className="quantum-sphere"
      >
        {quantumElements.map((element, index) => (
          <div
            key={index}
            className="quantum-element"
            style={elementStyles}
          >
            <div 
              style={{
                ...elementInnerStyles,
                background: `radial-gradient(circle at center, ${element.color}ff 0%, ${element.color}bb 20%, ${element.color}66 40%, ${element.color}33 60%, transparent 75%)`,
                boxShadow: `
                  0 0 25px ${element.color}dd,
                  0 0 50px ${element.color}99,
                  0 0 75px ${element.color}55,
                  inset 0 0 15px ${element.color}77
                `,
                backdropFilter: 'blur(2px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)'
                e.currentTarget.style.boxShadow = `
                  0 0 35px ${element.color},
                  0 0 70px ${element.color}dd,
                  0 0 100px ${element.color}99,
                  inset 0 0 25px ${element.color}aa
                `
                e.currentTarget.style.filter = 'brightness(1.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = `
                  0 0 25px ${element.color}dd,
                  0 0 50px ${element.color}99,
                  0 0 75px ${element.color}55,
                  inset 0 0 15px ${element.color}77
                `
                e.currentTarget.style.filter = 'brightness(1)'
              }}
            >
              <element.icon style={{ 
                width: '24px', 
                height: '24px', 
                color: 'white',
                filter: `drop-shadow(0 0 6px ${element.color}) drop-shadow(0 0 3px rgba(255,255,255,0.8))`,
                zIndex: 2
              }} />
              <span style={{
                ...labelStyles,
                textShadow: `0 0 8px ${element.color}, 0 0 4px rgba(255,255,255,0.6)`
              }}>{element.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuantumSphere