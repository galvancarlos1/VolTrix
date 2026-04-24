// Simulación de datos del dashboard
let consumoActual = 0;
let consumoHoy = 0;
let ultimoConsumo = 0;
const PRECIO_KWH = 800; // COP por kWh

// Elementos del DOM
const consumoActualEl = document.getElementById('consumo-actual');
const costoActualEl = document.getElementById('costo-actual');
const consumoHoyEl = document.getElementById('consumo-hoy');
const ahorroEl = document.getElementById('ahorro');
const alertasList = document.getElementById('alertas-list');
const recomendacionEl = document.getElementById('recomendacion');

// Configuración del gráfico
const ctx = document.getElementById('consumoChart').getContext('2d');
const consumoChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [{
            label: 'Consumo (kW)',
            data: Array(24).fill(0),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Consumo (kW)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Hora del día'
                }
            }
        }
    }
});

// Simular consumo aleatorio
function generarConsumo() {
    // Consumo base entre 0.5 y 3.5 kW (valores realistas para un hogar)
    let nuevoConsumo = Math.random() * 3 + 0.5;
    
    // Simular picos de consumo (horas pico)
    const horaActual = new Date().getHours();
    if ((horaActual >= 18 && horaActual <= 21) || (horaActual >= 12 && horaActual <= 14)) {
        nuevoConsumo *= 1.5;
    }
    
    // Suavizar cambios
    consumoActual = consumoActual * 0.7 + nuevoConsumo * 0.3;
    
    // Actualizar consumo del día
    if (ultimoConsumo === 0 || nuevoConsumo > ultimoConsumo * 1.5) {
        consumoHoy += nuevoConsumo / 3600; // Convertir a kWh por segundo simulado
    }
    ultimoConsumo = nuevoConsumo;
    
    return consumoActual;
}

// Actualizar datos del dashboard
function actualizarDashboard() {
    const consumo = generarConsumo();
    const costoPorHora = consumo * PRECIO_KWH / 1000;
    
    // Actualizar elementos
    consumoActualEl.textContent = consumo.toFixed(2);
    costoActualEl.textContent = costoPorHora.toFixed(0);
    consumoHoyEl.textContent = consumoHoy.toFixed(2);
    
    // Calcular ahorro simulado (comparado con consumo promedio)
    const consumoPromedio = 2.5; // kW promedio
    const ahorroPorcentaje = Math.max(0, ((consumoPromedio - consumo) / consumoPromedio * 100)).toFixed(0);
    ahorroEl.textContent = ahorroPorcentaje;
    
    // Actualizar gráfico
    const nuevasLabels = consumoChart.data.labels;
    const nuevosDatos = [...consumoChart.data.datasets[0].data.slice(1), consumo];
    consumoChart.data.datasets[0].data = nuevosDatos;
    consumoChart.update();
    
    // Verificar alertas
    verificarAlertas(consumo);
}

// Verificar condiciones de alerta
function verificarAlertas(consumo) {
    let alertaGenerada = false;
    
    // Consumo muy alto (> 4 kW)
    if (consumo > 4) {
        agregarAlerta('⚠️ Consumo muy alto detectado. Revisa tus electrodomésticos!', 'warning');
        alertaGenerada = true;
        mostrarRecomendacion('Desconecta electrodomésticos que no estés usando para reducir el consumo.');
    }
    // Consumo alto (> 3 kW)
    else if (consumo > 3) {
        if (Math.random() < 0.3) { // Solo mostrar ocasionalmente
            agregarAlerta('📈 Consumo elevado. Considera reducir el uso de aparatos eléctricos.', 'warning');
            alertaGenerada = true;
            mostrarRecomendacion('Revisa la temperatura de tu nevera y el uso de aire acondicionado.');
        }
    }
    // Consumo normal
    else if (consumo < 1) {
        if (Math.random() < 0.2) {
            agregarAlerta('✅ Consumo óptimo. ¡Sigue así!', 'success');
            alertaGenerada = true;
            mostrarRecomendacion('Tu consumo está en niveles excelentes. Comparte tus hábitos con tu familia.');
        }
    }
    
    // Simular detección de falla ocasional
    if (Math.random() < 0.05 && !alertaGenerada) {
        agregarAlerta('⚠️ Posible fuga de corriente detectada. Se recomienda revisión técnica.', 'danger');
        mostrarRecomendacion('Contacta a un electricista para revisar el cableado de tu hogar.');
    }
    
    // Limpiar alertas si hay muchas
    if (alertasList.children.length > 5) {
        while (alertasList.children.length > 3) {
            alertasList.removeChild(alertasList.lastChild);
        }
    }
}

// Agregar alerta al panel
function agregarAlerta(mensaje, tipo) {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alerta alerta-${tipo}`;
    alertaDiv.innerHTML = `
        <i class="fas ${tipo === 'warning' ? 'fa-exclamation-triangle' : tipo === 'danger' ? 'fa-bug' : 'fa-check-circle'}"></i>
        <span>${mensaje}</span>
        <small>${new Date().toLocaleTimeString()}</small>
    `;
    alertaDiv.style.display = 'flex';
    alertaDiv.style.justifyContent = 'space-between';
    alertaDiv.style.alignItems = 'center';
    alertaDiv.style.flexWrap = 'wrap';
    alertaDiv.style.gap = '8px';
    
    alertasList.insertBefore(alertaDiv, alertasList.firstChild);
    
    // Auto-remover después de 15 segundos
    setTimeout(() => {
        if (alertaDiv.parentNode) {
            alertaDiv.remove();
        }
    }, 15000);
}

// Mostrar recomendación
function mostrarRecomendacion(mensaje) {
    recomendacionEl.textContent = mensaje;
    recomendacionEl.style.opacity = '0';
    setTimeout(() => {
        recomendacionEl.style.transition = 'opacity 0.3s';
        recomendacionEl.style.opacity = '1';
    }, 10);
}

// Iniciar simulación
function iniciarSimulacion() {
    actualizarDashboard();
    setInterval(actualizarDashboard, 3000); // Actualizar cada 3 segundos
}

// Menú móvil
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    iniciarSimulacion();
    
    // Efecto de fade in al scroll
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
    
    document.querySelectorAll('section > .container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
