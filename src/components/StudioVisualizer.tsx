import React, { useEffect, useRef } from 'react';

interface StudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  className?: string;
}

export const StudioVisualizer: React.FC<StudioVisualizerProps> = ({
  isPlaying,
  barCount = 18,
  height = 36,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          // Dynamic harmonic movement
          const wave1 = Math.sin(phase + i * 0.45) * 0.5 + 0.5;
          const wave2 = Math.cos(phase * 1.3 + i * 0.3) * 0.5 + 0.5;
          const randomJitter = Math.random() * 0.25;
          const intensity = Math.min(1, Math.max(0.12, (wave1 * 0.6 + wave2 * 0.3 + randomJitter)));
          barHeight = Math.max(4, intensity * (canvas.height - 4));
        } else {
          // Subtle resting breathing wave
          barHeight = 4 + Math.sin(phase * 0.4 + i * 0.2) * 2;
        }

        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        // Gradient from crimson red (#e02434) to studio gold (#e8bb4a)
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#e8bb4a');
        grad.addColorStop(0.4, '#e02434');
        grad.addColorStop(1, '#1e4976');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();
      }

      phase += isPlaying ? 0.18 : 0.03;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 8}
      height={height}
      className={`inline-block ${className}`}
      title={isPlaying ? 'Visualizador de Frequência Ativo' : 'Visualizador em Repouso'}
    />
  );
};
