const mouseTrail = {
    canvas: null,
    ctx: null,
    particles: [],
    lastX: 0,
    lastY: 0,

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    },

    addTrail(x, y) {
        const dx = x - this.lastX;
        const dy = y - this.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) {
            const themeHues = [180, 195, 210, 240, 270, 285];
            const hue = themeHues[this.particles.length % themeHues.length];
            
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 4 + 2,
                life: 1.0,
                rotation: Math.random() * Math.PI * 2,
                hue: hue
            });
            
            this.lastX = x;
            this.lastY = y;
        }

        if (this.particles.length > 120) {
            this.particles.shift();
        }
    },

    drawTriangle(x, y, size, rotation, hue, opacity) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;

        const gradient = this.ctx.createLinearGradient(-size, -size, size, size);
        gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 50%)`);
        this.ctx.fillStyle = gradient;

        this.ctx.beginPath();
        this.ctx.moveTo(0, -size * 1.5);
        this.ctx.lineTo(size * 1.2, size);
        this.ctx.lineTo(-size * 1.2, size);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.life -= 0.025;
            p.rotation += 0.08;
            
            const scale = 1 + Math.sin(p.life * Math.PI * 2) * 0.3;
            
            this.drawTriangle(p.x, p.y, p.size * scale, p.rotation, p.hue, p.life);
        }

        this.particles = this.particles.filter(p => p.life > 0);
        requestAnimationFrame(() => this.animate());
    },

    init() {
        this.setupCanvas();
        document.addEventListener('mousemove', (e) => {
            this.addTrail(e.clientX, e.clientY);
        });
        this.animate();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mouseTrail.init());
} else {
    mouseTrail.init();
}
