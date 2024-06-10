document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];
    const colors = ["#ff0044", "#ff6600", "#ffcc00", "#33cc33", "#3399ff", "#9900cc"];

    function Firework(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.distanceToTarget = Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 50 + 50;
        this.targetRadius = 1;
    }

    Firework.prototype.update = function (index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.acceleration;

        const vx = Math.cos(this.angle) * this.speed,
            vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.sqrt((this.x - (this.x + vx)) ** 2 + (this.y - (this.y + vy)) ** 2);

        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.targetX, this.targetY);
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }
    };

    Firework.prototype.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
    };

    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 10 + 1;
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = Math.random() * 360;
        this.brightness = Math.random() * 60 + 40;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01;
    }

    Particle.prototype.update = function (index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
    };

    function createParticles(x, y) {
        let particleCount = 30;
        while (particleCount--) {
            particles.push(new Particle(x, y));
        }
    }

    function loop() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        let i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        let j = particles.length;
        while (j--) {
            particles[j].draw();
            particles[j].update(j);
        }

        if (fireworks.length === 0 && particles.length === 0) {
            clearInterval(interval);
            document.getElementById('message').style.display = 'block';
        }

        requestAnimationFrame(loop);
    }

    let interval = setInterval(() => {
        fireworks.push(new Firework(Math.random() * canvas.width, canvas.height, Math.random() * canvas.width, Math.random() * canvas.height / 2));
    }, 500);

    loop();
});
