/**
 * DUSTBURN - Ember & Fire Particle Background Canvas
 * Simula chispas y cenizas ardientes estilo Left 4 Dead 2
 */
(function() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 75;
  const particles = [];

  const colors = [
    'rgba(255, 69, 0, ',    // Red-orange
    'rgba(255, 140, 0, ',   // Orange
    'rgba(255, 200, 0, ',   // Amber yellow
    'rgba(220, 20, 60, ',   // Crimson
    'rgba(255, 255, 255, '  // White sparks
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10 + Math.random() * 20;
      this.size = Math.random() * 2.8 + 0.8;
      this.speedY = Math.random() * 1.5 + 0.6; // Rising up
      this.speedX = (Math.random() - 0.5) * 1.2; // Drifting
      this.opacity = Math.random() * 0.7 + 0.3;
      this.fadeSpeed = Math.random() * 0.003 + 0.002;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.sinFactor = Math.random() * 0.05;
      this.sinOffset = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * this.sinFactor + this.sinOffset) * 0.5;
      this.opacity -= this.fadeSpeed;

      if (this.y < -10 || this.opacity <= 0 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + this.opacity + ')';
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = '#ff4500';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Pause when tab hidden to preserve CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });

  animate();
})();
