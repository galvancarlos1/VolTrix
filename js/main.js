// Simulación de datos en tiempo real
let consumoActual = 0.5;
let consumoHoy = 0;
let ultimoConsumo = 0;
const PRECIO_KWH = 800; // COP por kWh

// Elementos del DOM
const consumoActualEl = document.getElementById('consumo-actual');
const costoActualEl = document.getElementById('costo-actual');
const ahorroEl = document.getElementById('ahorro');
const estadoEl = document.getElementById('estado');
const alertasList = document.getElementById('alertas-list');
const meterValue = document.getElementById('meterValue');
const meterCircle = document.getElementById('meterCircle');

// Generar consumo simulado
function generarConsumo() {
    let nuevoConsumo = Math.random() * 3 + 0.5;
    
    // Simular horas pico
    const horaActual = new Date().getHours();
    if ((horaActual >= 18 && horaActual <= 21) || (horaActual >= 12 && horaActual <= 14)) {
        nuevoConsumo *= 1.5;
    }
    
    // Suavizar cambios
    consumoActual = consumoActual * 0.7 + nuevoConsumo * 0.3;
    
    // Actualizar consumo del día
    if (ultimoConsumo === 0 || nuevoConsumo > ultimoConsumo * 1.5) {
        consumoHoy += nuevoConsumo / 3600;
    }
    ultimoConsumo = nuevoConsumo;
    
    return consumoActual;
}

// Actualizar el medidor circular
function actualizarMedidor(consumo) {
    if (meterValue) {
        meterValue.innerText = consumo.toFixed(1);
    }
    
    if (meterCircle) {
        const porcentaje = Math.min(100, (consumo / 5) * 100);
        meterCircle.style.background = `conic-gradient(from 0deg, var(--primary) 0deg, var(--dark-light) ${porcentaje * 3.6}deg)`;
    }
}

// Actualizar dashboard
function actualizarDashboard() {
    const consumo = generarConsumo();
    const costoPorHora = consumo * PRECIO_KWH / 1000;
    
    // Calcular ahorro
    const consumoPromedio = 2.5;
    const ahorroPorcentaje = Math.max(0, Math.round(((consumoPromedio - consumo) / consumoPromedio * 100)));
    
    // Actualizar elementos
    if (consumoActualEl) consumoActualEl.innerText = consumo.toFixed(2);
    if (costoActualEl) costoActualEl.innerText = Math.round(costoPorHora);
    if (ahorroEl) ahorroEl.innerText = ahorroPorcentaje;
    
    // Actualizar medidor
    actualizarMedidor(consumo);
    
    // Verificar alertas
    verificarAlertas(consumo, ahorroPorcentaje);
}

// Verificar alertas
function verificarAlertas(consumo, ahorro) {
    let alertaGenerada = false;
    
    if (consumo > 4) {
        agregarAlerta('⚠️ ALERTA: Consumo muy elevado. Revisa tus electrodomésticos!', 'danger');
        if (estadoEl) estadoEl.innerText = 'Crítico';
        alertaGenerada = true;
    } else if (consumo > 3) {
        agregarAlerta('📈 Consumo elevado. Te recomendamos revisar el uso del aire acondicionado.', 'warning');
        if (estadoEl) estadoEl.innerText = 'Alerta';
        alertaGenerada = true;
    } else if (consumo < 1 && ahorro > 30) {
        if (!alertaGenerada) {
            agregarAlerta(`✅ Consumo excelente! Estás ahorrando ${ahorro}%. ¡Sigue así!`, 'success');
            if (estadoEl) estadoEl.innerText = 'Óptimo';
        }
    } else {
        if (!alertaGenerada) {
            if (estadoEl) estadoEl.innerText = 'Normal';
        }
    }
    
    // Limpiar alertas antiguas si hay muchas
    if (alertasList && alertasList.children.length > 6) {
        while (alertasList.children.length > 4) {
            alertasList.removeChild(alertasList.lastChild);
        }
    }
}

// Agregar alerta
function agregarAlerta(mensaje, tipo) {
    if (!alertasList) return;
    
    const alertaDiv = document.createElement('div');
    const colorMap = {
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    };
    
    alertaDiv.className = `alerta alerta-${tipo}`;
    alertaDiv.style.background = `${colorMap[tipo]}20`;
    alertaDiv.style.padding = '12px';
    alertaDiv.style.borderRadius = '12px';
    alertaDiv.style.marginBottom = '8px';
    alertaDiv.style.borderLeft = `4px solid ${colorMap[tipo]}`;
    alertaDiv.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'warning' ? 'fa-exclamation-triangle' : 'fa-bug'}"></i>
        <span>${mensaje}</span>
        <small style="float: right;">${new Date().toLocaleTimeString()}</small>
    `;
    
    alertasList.insertBefore(alertaDiv, alertasList.firstChild);
    
    // Auto-remover después de 12 segundos
    setTimeout(() => {
        if (alertaDiv.parentNode) {
            alertaDiv.remove();
        }
    }, 12000);
}

// Menú móvil
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

// Smooth scroll
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

// Formulario de contacto
const formContacto = document.getElementById('formContacto');
if (formContacto) {
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por tu interés! Un asesor te contactará en menos de 24 horas.');
        this.reset();
    });
}

// Iniciar simulación
setInterval(actualizarDashboard, 3000);
actualizarDashboard();

// Animación de entrada con Intersection Observer
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

document.querySelectorAll('.beneficio-card, .paso-card, .plan-card, .testimonio-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
