// ========== INICIALIZAR AOS ==========
AOS.init({
    duration: 800,
    once: true
});

// ========== DEMO MINI VOLTRIX EN CASO DE ÉXITO ==========
let demoConsumo = 0.5;
const PRECIO_KWH = 800;

const demoConsumoEl = document.getElementById('demo-consumo');
const demoAhorroEl = document.getElementById('demo-ahorro');
const demoAlertaEl = document.getElementById('demo-alerta');

function actualizarDemo() {
    demoConsumo = Math.max(0.2, Math.min(5, demoConsumo + (Math.random() - 0.5) * 0.3));
    const ahorro = Math.max(0, Math.round(((2.5 - demoConsumo) / 2.5 * 100)));
    
    if (demoConsumoEl) demoConsumoEl.innerText = demoConsumo.toFixed(2);
    if (demoAhorroEl) demoAhorroEl.innerText = ahorro;
    
    if (demoConsumo > 4) {
        demoAlertaEl.innerHTML = '⚠️ ALERTA: Consumo muy elevado!';
        demoAlertaEl.style.background = '#ef444420';
    } else if (demoConsumo > 3) {
        demoAlertaEl.innerHTML = '📈 Consumo elevado. Te recomendamos revisar tus equipos.';
        demoAlertaEl.style.background = '#f59e0b20';
    } else {
        demoAlertaEl.innerHTML = '✅ Consumo óptimo. ¡Sigue así!';
        demoAlertaEl.style.background = '#10b98120';
    }
}

setInterval(actualizarDemo, 3000);
actualizarDemo();

// ========== MENÚ MÓVIL ==========
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic en enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== FORMULARIO DE CONTACTO ==========
const formContacto = document.getElementById('formContacto');
if (formContacto) {
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por contactarnos! Un asesor se comunicará contigo en menos de 24 horas para discutir tu proyecto.');
        this.reset();
    });
}

// ========== EFECTOS DE ENTRADA CON INTERSECTION OBSERVER ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animar tarjetas al aparecer
document.querySelectorAll('.servicio-card, .portafolio-card, .porque-card, .miembro-card, .testimonio-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
