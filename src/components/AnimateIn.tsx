import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
}

export default function AnimateIn({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '' 
}: AnimateInProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state based on direction
    const initialState: any = { opacity: 0 };
    const finalState: any = { opacity: 1 };

    switch (direction) {
      case 'up':
        initialState.y = 30;
        finalState.y = 0;
        break;
      case 'down':
        initialState.y = -30;
        finalState.y = 0;
        break;
      case 'left':
        initialState.x = 30;
        finalState.x = 0;
        break;
      case 'right':
        initialState.x = -30;
        finalState.x = 0;
        break;
      case 'fade':
        // Only opacity animation
        break;
    }

    gsap.set(element, initialState);
    
    const animation = gsap.to(element, {
      ...finalState,
      duration: 0.8,
      delay,
      ease: "power2.out"
    });

    return () => {
      animation.kill();
    };
  }, [delay, direction]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}