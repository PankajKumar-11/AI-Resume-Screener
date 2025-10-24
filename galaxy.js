/**
 * Professional Galaxy Background - Pure JavaScript
 * No dependencies, lightweight, optimized for performance
 */

class GalaxyBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Configuration
    this.config = {
      starCount: options.starCount || 300,
      speed: options.speed || 0.3,
      mouseInteraction: options.mouseInteraction !== false,
      glowIntensity: options.glowIntensity || 0.5,
      colorScheme: options.colorScheme || 'purple', // purple, blue, cosmic
      twinkle: options.twinkle !== false,
      shooting: options.shooting !== false
    };

    this.stars = [];
    this.shootingStars = [];
    this.mouse = { x: 0, y: 0, active: false };
    this.time = 0;
    
    this.init();
  }

  init() {
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    
    this.container.style.position = 'relative';
    this.container.insertBefore(this.canvas, this.container.firstChild);
    
    this.resize();
    this.createStars();
    
    window.addEventListener('resize', () => this.resize());
    
    if (this.config.mouseInteraction) {
      this.container.addEventListener('mousemove', (e) => this.handleMouse(e));
      this.container.addEventListener('mouseleave', () => {
        this.mouse.active = false;
      });
    }
    
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.container.offsetWidth * dpr;
    this.canvas.height = this.container.offsetHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
  }

  getColor(intensity) {
    const schemes = {
      purple: [
        `rgba(138, 180, 248, ${intensity})`, // Blue
        `rgba(167, 139, 250, ${intensity})`, // Purple
        `rgba(196, 181, 253, ${intensity})`, // Light purple
        `rgba(255, 255, 255, ${intensity})`  // White
      ],
      blue: [
        `rgba(59, 130, 246, ${intensity})`,
        `rgba(147, 197, 253, ${intensity})`,
        `rgba(191, 219, 254, ${intensity})`,
        `rgba(255, 255, 255, ${intensity})`
      ],
      cosmic: [
        `rgba(139, 92, 246, ${intensity})`,
        `rgba(236, 72, 153, ${intensity})`,
        `rgba(251, 191, 36, ${intensity})`,
        `rgba(255, 255, 255, ${intensity})`
      ]
    };
    
    const colors = schemes[this.config.colorScheme] || schemes.purple;
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.config.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: this.getColor(1)
      });
    }
  }

  handleMouse(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.active = true;
  }

  createShootingStar() {
    if (Math.random() > 0.98 && this.config.shooting) {
      this.shootingStars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.5,
        vx: Math.random() * 8 + 4,
        vy: Math.random() * 3 + 2,
        length: Math.random() * 80 + 40,
        opacity: 1,
        life: 0
      });
    }
  }

  drawStar(star) {
    const scaleFactor = 1000 / (1000 - star.z);
    const x = (star.x - this.width / 2) * scaleFactor + this.width / 2;
    const y = (star.y - this.height / 2) * scaleFactor + this.height / 2;
    
    if (x < -50 || x > this.width + 50 || y < -50 || y > this.height + 50) {
      star.z = 1000;
      star.x = Math.random() * this.width;
      star.y = Math.random() * this.height;
      return;
    }

    let size = star.size * scaleFactor;
    let opacity = star.opacity;

    // Twinkle effect
    if (this.config.twinkle) {
      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinklePhase);
      opacity *= (0.7 + twinkle * 0.3);
    }

    // Mouse interaction - repulsion
    if (this.mouse.active && this.config.mouseInteraction) {
      const dx = x - this.mouse.x;
      const dy = y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        const force = (150 - dist) / 150;
        size *= (1 + force * 0.5);
        opacity *= (1 + force * 0.3);
      }
    }

    // Glow effect
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    gradient.addColorStop(0, star.color.replace(/[\d.]+\)$/g, `${opacity * this.config.glowIntensity})`));
    gradient.addColorStop(0.4, star.color.replace(/[\d.]+\)$/g, `${opacity * this.config.glowIntensity * 0.3})`));
    gradient.addColorStop(1, star.color.replace(/[\d.]+\)$/g, '0)'));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Core
    this.ctx.fillStyle = star.color.replace(/[\d.]+\)$/g, `${opacity})`);
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawShootingStar(star) {
    const gradient = this.ctx.createLinearGradient(
      star.x, star.y,
      star.x - star.vx * 10, star.y - star.vy * 10
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
    gradient.addColorStop(0.5, `rgba(167, 139, 250, ${star.opacity * 0.6})`);
    gradient.addColorStop(1, `rgba(167, 139, 250, 0)`);

    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(star.x, star.y);
    this.ctx.lineTo(star.x - star.vx * 10, star.y - star.vy * 10);
    this.ctx.stroke();
  }

  animate() {
    this.time += 1;
    
    // Clear with fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Update and draw stars
    this.stars.forEach(star => {
      star.z -= star.speed * this.config.speed;
      
      if (star.z <= 0) {
        star.z = 1000;
        star.x = Math.random() * this.width;
        star.y = Math.random() * this.height;
      }
      
      this.drawStar(star);
    });

    // Create and draw shooting stars
    this.createShootingStar();
    this.shootingStars = this.shootingStars.filter(star => {
      star.x += star.vx;
      star.y += star.vy;
      star.life += 1;
      star.opacity -= 0.015;
      
      if (star.opacity > 0 && star.x < this.width + 100 && star.y < this.height + 100) {
        this.drawShootingStar(star);
        return true;
      }
      return false;
    });

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Auto-initialize on body if data attribute exists
document.addEventListener('DOMContentLoaded', () => {
  const galaxyContainers = document.querySelectorAll('[data-galaxy]');
  galaxyContainers.forEach(container => {
    new GalaxyBackground(container, {
      starCount: parseInt(container.dataset.stars) || 300,
      speed: parseFloat(container.dataset.speed) || 0.3,
      colorScheme: container.dataset.colorScheme || 'purple'
    });
  });
});
