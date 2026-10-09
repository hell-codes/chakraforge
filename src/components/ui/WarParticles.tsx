import React, { useEffect, useRef } from 'react';

export const WarParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        // Use type assertion to silence TS strict null checks if needed, but here canvas is known
        const width = canvas ? canvas.width : window.innerWidth;
        const height = canvas ? canvas.height : window.innerHeight;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.8;
        // Float sideways slowly
        this.speedX = Math.random() * 0.5 - 0.25;
        // Float upwards like embers/dust
        this.speedY = Math.random() * -0.8 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        
        // Mahabharata colors: gold, crimson red (war), ash grey, ember orange
        const colors = ['#d4af37', '#8a1c1c', '#a89b8c', '#ff6b35', '#c09f58'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Add subtle turbulence
        this.speedX += (Math.random() - 0.5) * 0.02;

        if (canvas) {
          // Wrap around screen
          if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
          }
          if (this.x < 0) this.x = canvas.width;
          if (this.x > canvas.width) this.x = 0;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    const init = () => {
      resizeCanvas();
      particles = [];
      // Adjust density based on screen width - balanced density
      const particleCount = Math.floor(window.innerWidth / 12);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {/* Subtle vignette to make it blend with the page */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a0705]/20 to-[#0a0705]/90 z-10 pointer-events-none"></div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen"
      />
    </div>
  );
};
