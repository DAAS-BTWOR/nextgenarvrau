import React, { useEffect, useRef } from 'react';

export default function CanvasHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle nodes
    const particleCount = Math.min(65, Math.floor((width * height) / 14000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? '#00F0FF' : (Math.random() > 0.5 ? '#8A2BE2' : '#FF007A'),
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    // 3D Hologram Cube / Headset wireframe vertices
    let angle = 0;
    const cubeVertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    const cubeEdges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw subtle glow near center
      const gradient = ctx.createRadialGradient(
        width * 0.5, height * 0.4, 10,
        width * 0.5, height * 0.4, width * 0.6
      );
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Connect and animate particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Draw lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#00F0FF';
            ctx.globalAlpha = (1 - dist / 120) * 0.18;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw rotating 3D Holographic Wireframe Cube (Spatial Anchor)
      angle += 0.008;
      const size = Math.min(width, height) * 0.18;
      const cx = width * 0.78;
      const cy = height * 0.48;

      const projected = cubeVertices.map(([vx, vy, vz]) => {
        // Rotate around Y and X axes
        const radY = angle;
        const radX = angle * 0.7;

        let x1 = vx * Math.cos(radY) + vz * Math.sin(radY);
        let z1 = -vx * Math.sin(radY) + vz * Math.cos(radY);

        let y2 = vy * Math.cos(radX) - z1 * Math.sin(radX);
        let z2 = vy * Math.sin(radX) + z1 * Math.cos(radX);

        const fov = 3.5;
        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * size * scale,
          y: cy + y2 * size * scale
        };
      });

      // Draw cube edges
      ctx.lineWidth = 1.2;
      cubeEdges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(projected[start].x, projected[start].y);
        ctx.lineTo(projected[end].x, projected[end].y);
        ctx.strokeStyle = '#00F0FF';
        ctx.globalAlpha = 0.4;
        ctx.stroke();
      });

      // Draw vertices nodes
      projected.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#8A2BE2';
        ctx.globalAlpha = 0.8;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
