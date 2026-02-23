import { useEffect, useRef } from 'react';

interface NeonBackgroundProps {
  intensity: number;
  purimMode: boolean;
}

export const NeonBackground = ({ intensity, purimMode }: NeonBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetIntensityRef = useRef(intensity);
  const intensityRef = useRef(intensity);
  const targetBlendRef = useRef(purimMode ? 1 : 0);
  const blendRef = useRef(purimMode ? 1 : 0);
  const targetParticleCountRef = useRef(purimMode ? 50 : 30);
  const speedRef = useRef(2);

  useEffect(() => {
    targetIntensityRef.current = intensity;
    targetBlendRef.current = purimMode ? 1 : 0;
    targetParticleCountRef.current = purimMode ? 50 : 30;
  }, [intensity, purimMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      r: number;
      g: number;
      b: number;
      emoji?: string;
    }> = [];

    const emojis = ['🎭', '🍬', '🥳', '✨', '🎪', '🎉', '🪩'];
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#00ff00'];

    const hexToRgb = (hex: string) => {
      const value = hex.replace('#', '');
      const r = parseInt(value.slice(0, 2), 16);
      const g = parseInt(value.slice(2, 4), 16);
      const b = parseInt(value.slice(4, 6), 16);
      return { r, g, b };
    };

    const createParticle = () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rgb = hexToRgb(color);
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        color,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        emoji: Math.random() > 0.7 ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
      };
    };

    const initialCount = targetParticleCountRef.current;
    for (let i = 0; i < initialCount; i++) {
      particles.push(createParticle());
    }

    let animationId: number;
    const animate = () => {
      intensityRef.current +=
        (targetIntensityRef.current - intensityRef.current) * 0.08;
      blendRef.current += (targetBlendRef.current - blendRef.current) * 0.06;
      speedRef.current = 2;

      const targetCount = targetParticleCountRef.current;
      if (particles.length < targetCount) {
        const addCount = Math.min(2, targetCount - particles.length);
        for (let i = 0; i < addCount; i++) {
          particles.push(createParticle());
        }
      } else if (particles.length > targetCount) {
        particles.splice(0, Math.min(2, particles.length - targetCount));
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const blend = blendRef.current;
      const glowBoost = 10 + blend * 12;
      const brighten = 0.15 + blend * 0.25;

      particles.forEach((p) => {
        p.x += p.vx * intensityRef.current * speedRef.current;
        p.y += p.vy * intensityRef.current * speedRef.current;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (p.emoji) {
          ctx.font = `${p.size * 8}px Arial`;
          ctx.fillText(p.emoji, p.x, p.y);
        } else {
          const r = Math.round(p.r + (255 - p.r) * brighten);
          const g = Math.round(p.g + (255 - p.g) * brighten);
          const b = Math.round(p.b + (255 - p.b) * brighten);
          const color = `rgb(${r}, ${g}, ${b})`;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = glowBoost;
          ctx.shadowColor = color;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="neon-background" />;
};
