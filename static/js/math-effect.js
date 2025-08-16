document.addEventListener('DOMContentLoaded', () => {
    initMathParticles();
});// 数学公式库
const MATH_FORMULAS = [
    "\\alpha", "\\beta", "\\gamma", "\\delta", "\\epsilon",
    "x", "y", "z", "n", "k",
    "a", "b", "c", "d", "e",
    "+" , "-", "×", "÷", "=",
    "\\sum", "\\prod", "\\int", "\\lim", "\\infty",
    "f(x)", "g(x)", "h(x)",
    "\\sqrt{x}", "x^2", "x^n",
    "\\frac{a}{b}", "\\cdot", "\\times",
    "\\partial", "\\nabla", "\\exists", "\\forall",
    "\\in", "\\subset", "\\cup", "\\cap",
    "\\Rightarrow", "\\Leftarrow", "\\Leftrightarrow"
];

// 配色方案
const COLORS = [
    '#0099ff', '#ff3366', '#33cc99',
    '#cc66ff', '#ff9900', '#6666ff'
];

// 粒子类
class MathParticle {
    constructor(x, y, index) {
        this.element = document.createElement('span');
        this.element.className = 'math-particle';

        // 随机选择数学公式
        const formula = MATH_FORMULAS[Math.floor(Math.random() * MATH_FORMULAS.length)];
        this.element.dataset.formula = formula;

        // 随机颜色
        this.element.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.element.style.textShadow = `0 0 2px ${this.element.style.color}88`;

        // 初始位置（点击中心点）
        this.x = x;
        this.y = y;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // 随机大小
        this.element.style.fontSize = `${Math.random() * 8 + 12}px`;

        // 扩散参数
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1.5 + 0.5;
        this.distance = 0;
        this.maxDistance = Math.random() * 30 + 20;

        // 序列延迟
        this.delay = index * 5;

        document.body.appendChild(this.element);

        // 延迟显示并渲染公式
        setTimeout(() => {
            katex.render(this.element.dataset.formula, this.element, {
                throwOnError: false
            });
            this.element.style.opacity = '1';
        }, this.delay);

        // 生命周期
        this.life = this.maxDistance / this.speed * 1.2;
        this.currentLife = 0;
    }

    update() {
        // 向外扩散
        this.distance += this.speed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // 更新位置
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // 随距离增加逐渐淡出
        const fadeRatio = this.distance / this.maxDistance;
        this.element.style.opacity = (1 - fadeRatio).toString();

        // 生命周期判断
        this.currentLife++;
        return this.distance < this.maxDistance && this.currentLife < this.life;
    }

    destroy() {
        // 先淡出再移除，避免突兀消失
        this.element.style.opacity = '0';
        setTimeout(() => this.element.remove(), 300);
    }
}

// 粒子管理器
class ParticleManager {
    constructor() {
        this.particles = [];
        this.maxParticles = 200;
        this.animate();
        this.bindEvents();
    }

    createParticles(x, y) {
        const currentCount = this.particles.length;
        const availableSlots = this.maxParticles - currentCount;
        if (availableSlots <= 0) return;

        // 每次点击生成30-50个公式粒子
        const maxNew = Math.min(Math.floor(Math.random() * 20) + 30, availableSlots);
        for (let i = 0; i < maxNew; i++) {
            this.particles.push(new MathParticle(x, y, i));
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.particles = this.particles.filter(particle => {
            const alive = particle.update();
            if (!alive) particle.destroy();
            return alive;
        });
    }

    bindEvents() {
        // 使用捕获阶段监听，确保点击事件不被加载动画覆盖
        document.addEventListener('click', (e) => {
            this.createParticles(e.clientX, e.clientY);
        }, true);
    }
}

// 直接初始化数学公式点击特效，不依赖任何加载动画
function initMathParticles() {
    // 移除所有与加载动画相关的依赖检查
    if (!window.mathParticlesInitialized) {
        window.mathParticlesInitialized = true;
        // 直接实例化粒子管理器，不等待任何事件
        new ParticleManager();
    }
}

// DOM加载完成后立即初始化，不做任何延迟或条件判断
document.addEventListener('DOMContentLoaded', () => {
    initMathParticles();
});
