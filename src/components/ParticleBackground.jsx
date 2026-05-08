import { useEffect, useState } from 'react'

const ParticleBackground = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const particleCount = 25
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 5 + 5}s`,
      delay: `${Math.random() * 5}s`,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            top: p.top,
            left: p.left,
            '--duration': p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

export default ParticleBackground
