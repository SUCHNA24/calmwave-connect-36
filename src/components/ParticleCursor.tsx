import { useEffect } from 'react';

export default function ParticleCursor() {
  useEffect(() => {
    let mouseVelocity = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };

    const createParticle = (e: MouseEvent) => {
      const particleTypes = ['primary', 'secondary', 'glow', 'spark'];
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      
      const particle = document.createElement('div');
      particle.className = `particle-cursor particle-${type}`;
      
      // Calculate velocity-based offset
      const velocity = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
      const offset = Math.min(velocity * 0.1, 20);
      
      // Random position around cursor with velocity influence
      const randomX = (Math.random() - 0.5) * 20 + (mouseVelocity.x * 0.1);
      const randomY = (Math.random() - 0.5) * 20 + (mouseVelocity.y * 0.1);
      
      particle.style.left = `${e.clientX + randomX}px`;
      particle.style.top = `${e.clientY + randomY}px`;
      
      // Add size variation
      const size = type === 'glow' ? 12 + Math.random() * 8 : 4 + Math.random() * 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Add random rotation for spark particles
      if (type === 'spark') {
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      }
      
      document.body.appendChild(particle);
      
      // Variable lifetime based on particle type
      const lifetime = type === 'glow' ? 1500 : type === 'spark' ? 800 : 1000;
      
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, lifetime);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse velocity
      mouseVelocity = {
        x: e.clientX - lastMousePos.x,
        y: e.clientY - lastMousePos.y
      };
      lastMousePos = { x: e.clientX, y: e.clientY };
      
      const velocity = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
      
      // Create more particles based on mouse speed
      const particleChance = Math.min(0.3 + (velocity * 0.02), 0.8);
      
      if (Math.random() < particleChance) {
        createParticle(e);
        
        // Create additional particles for fast movement
        if (velocity > 20 && Math.random() < 0.5) {
          setTimeout(() => createParticle(e), 50);
        }
      }
    };

    const handleMouseEnter = () => {
      document.body.style.cursor = 'none';
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return null;
}