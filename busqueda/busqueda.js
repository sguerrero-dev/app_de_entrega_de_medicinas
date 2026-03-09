// busqueda.js - Funcionalidad de búsqueda de medicamentos

// Base de datos simulada de farmacias
const farmaciasDB = [
    {
        id: 1,
        nombre: "Farmacia La Salud",
        distancia: "0.8 km",
        calificacion: 4.8,
        medicamentos: [
            { nombre: "Acetaminofen 500mg", precio: 3500, stock: 50, estado: "disponible" },
            { nombre: "Ibuprofeno 400mg", precio: 4200, stock: 30, estado: "disponible" },
            { nombre: "Amoxicilina 500mg", precio: 8500, stock: 0, estado: "agotado" }
        ]
    },
    {
        id: 2,
        nombre: "Farmacia Central",
        distancia: "2.5 km",
        calificacion: 4.5,
        medicamentos: [
            { nombre: "Acetaminofen 500mg", precio: 3800, stock: 0, estado: "no disponible" },
            { nombre: "Ibuprofeno 400mg", precio: 4500, stock: 15, estado: "disponible" },
            { nombre: "Omeprazol 20mg", precio: 6200, stock: 8, estado: "pocas unidades" }
        ]
    },
    {
        id: 3,
        nombre: "Farmacia San José",
        distancia: "3.1 km",
        calificacion: 4.7,
        medicamentos: [
            { nombre: "Acetaminofen 500mg", precio: 3600, stock: 3, estado: "pocas unidades" },
            { nombre: "Losartan 50mg", precio: 7200, stock: 12, estado: "disponible" },
            { nombre: "Metformina 850mg", precio: 5400, stock: 20, estado: "disponible" }
        ]
    },
    {
        id: 4,
        nombre: "Farmacia Popular",
        distancia: "4.0 km",
        calificacion: 4.2,
        medicamentos: [
            { nombre: "Acetaminofen 500mg", precio: 3300, stock: 0, estado: "agotado" },
            { nombre: "Dolex 500mg", precio: 4200, stock: 25, estado: "disponible" },
            { nombre: "Naproxeno 500mg", precio: 6800, stock: 5, estado: "pocas unidades" }
        ]
    },
    {
        id: 5,
        nombre: "Farmacia El Salvador",
        distancia: "1.2 km",
        calificacion: 4.9,
        medicamentos: [
            { nombre: "Acetaminofen 500mg", precio: 3400, stock: 45, estado: "disponible" },
            { nombre: "Amoxicilina 500mg", precio: 8200, stock: 18, estado: "disponible" },
            { nombre: "Azitromicina 500mg", precio: 12500, stock: 7, estado: "pocas unidades" }
        ]
    }
];

// Variables globales
let medicamentoBuscado = "Acetaminofen 500mg";
let farmaciaSeleccionada = null;
let plataformaSeleccionada = null;

// Función para mostrar mensajes
function mostrarMensaje(tipo, texto) {
    const mensajeError = document.getElementById('mensajeError');
    const mensajeSuccess = document.getElementById('mensajeSuccess');
    
    if (tipo === 'error') {
        mensajeError.style.display = 'block';
        mensajeError.innerHTML = texto;
        mensajeSuccess.style.display = 'none';
        
        setTimeout(() => {
            mensajeError.style.display = 'none';
        }, 3000);
    } else {
        mensajeSuccess.style.display = 'block';
        mensajeSuccess.innerHTML = texto;
        mensajeError.style.display = 'none';
        
        setTimeout(() => {
            mensajeSuccess.style.display = 'none';
        }, 3000);
    }
}

// Función para buscar medicamento
function buscarMedicamento() {
    const input = document.getElementById('inputMedicamento');
    medicamentoBuscado = input.value.trim();
    
    if (!medicamentoBuscado) {
        mostrarMensaje('error', '❌ Por favor ingresa un medicamento para buscar');
        return;
    }
    
    document.getElementById('resultadosFarmacias').style.display = 'block';
    
    const farmaciasConMedicamento = farmaciasDB.map(farmacia => {
        const medicamento = farmacia.medicamentos.find(m => 
            m.nombre.toLowerCase().includes(medicamentoBuscado.toLowerCase())
        );
        
        if (medicamento) {
            return {
                ...farmacia,
                medicamentoEncontrado: medicamento
            };
        }
        return null;
    }).filter(f => f !== null);
    
    mostrarResultados(farmaciasConMedicamento);
    
    if (farmaciasConMedicamento.length === 0) {
        mostrarMensaje('error', `❌ No se encontró "${medicamentoBuscado}" en ninguna farmacia`);
    } else {
        mostrarMensaje('success', `✅ Se encontraron ${farmaciasConMedicamento.length} farmacias con "${medicamentoBuscado}"`);
    }
}

// Mostrar resultados en el grid
function mostrarResultados(farmacias) {
    const grid = document.getElementById('farmaciasGrid');
    
    if (farmacias.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <p style="font-size: 18px; color: #666;">❌ No se encontró "${medicamentoBuscado}" en ninguna farmacia</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = farmacias.map(farmacia => {
        const medicamento = farmacia.medicamentoEncontrado;
        const estadoClass = medicamento.estado === 'disponible' ? 'disponible' : 
                           medicamento.estado === 'pocas unidades' ? 'pocas-unidades' : 'no-disponible';
        
        const estadoTexto = medicamento.estado === 'disponible' ? '✅ Disponible' :
                           medicamento.estado === 'pocas unidades' ? '⚠️ Pocas unidades' : '❌ No disponible';
        
        const habilitado = medicamento.estado !== 'no disponible' && medicamento.estado !== 'agotado' && medicamento.stock > 0;
        
        return `
            <div class="tarjeta-farmacia" onclick="seleccionarFarmacia(${farmacia.id}, this, ${habilitado})" id="farmacia-${farmacia.id}">
                <div class="farmacia-header">
                    <span class="farmacia-nombre">${farmacia.nombre}</span>
                    <span class="farmacia-distancia">⭐ ${farmacia.calificacion} • ${farmacia.distancia}</span>
                </div>
                <div class="medicamento-info">
                    <div class="medicamento-nombre">${medicamento.nombre}</div>
                    <div class="estado-disponibilidad">
                        <span class="${estadoClass}">${estadoTexto}</span>
                        <span class="precio">$${medicamento.precio.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn-ver-mas" ${!habilitado ? 'disabled' : ''}>
                    ${habilitado ? '📦 Seleccionar' : '🚫 No disponible'}
                </button>
            </div>
        `;
    }).join('');
}

// Seleccionar farmacia
function seleccionarFarmacia(id, elemento, habilitado) {
    if (!habilitado) {
        mostrarMensaje('error', '❌ Esta farmacia no tiene stock disponible');
        return;
    }
    
    document.querySelectorAll('.tarjeta-farmacia').forEach(el => {
        el.classList.remove('seleccionada');
    });
    
    elemento.classList.add('seleccionada');
    farmaciaSeleccionada = farmaciasDB.find(f => f.id === id);
    
    document.getElementById('plataformasEnvio').style.display = 'block';
    mostrarMensaje('success', `✅ Farmacia "${farmaciaSeleccionada.nombre}" seleccionada.`);
    document.getElementById('plataformasEnvio').scrollIntoView({ behavior: 'smooth' });
}

// Seleccionar plataforma de envío
function seleccionarPlataforma(plataforma) {
    document.querySelectorAll('.plataforma-btn').forEach(el => {
        el.classList.remove('seleccionada');
    });
    
    const elementoPlataforma = document.getElementById(`plataforma-${plataforma}`);
    if (elementoPlataforma) {
        elementoPlataforma.classList.add('seleccionada');
    }
    
    plataformaSeleccionada = plataforma;
    
    const btnConfirmar = document.getElementById('btnConfirmar');
    btnConfirmar.style.display = 'block';
    btnConfirmar.disabled = false;
    
    mostrarMensaje('success', `✅ Plataforma seleccionada: ${getNombrePlataforma(plataforma)}`);
}

function getNombrePlataforma(plataforma) {
    const nombres = {
        'didi': 'DiDi Food',
        'uber': 'UBER EATS',
        'rappi': 'Rappi'
    };
    return nombres[plataforma] || plataforma;
}

// Confirmar pedido y redirigir con la ruta corregida
function confirmarPedido() {
    if (!farmaciaSeleccionada) {
        mostrarMensaje('error', '⚠️ Debes seleccionar una farmacia');
        return;
    }
    
    if (!plataformaSeleccionada) {
        mostrarMensaje('error', '⚠️ Debes seleccionar una plataforma de envío');
        return;
    }
    
    const medicamento = farmaciaSeleccionada.medicamentos.find(m => 
        m.nombre.toLowerCase().includes(medicamentoBuscado.toLowerCase())
    );
    
    const pedidoData = {
        farmacia: {
            id: farmaciaSeleccionada.id,
            nombre: farmaciaSeleccionada.nombre,
            distancia: farmaciaSeleccionada.distancia
        },
        plataforma: {
            id: plataformaSeleccionada,
            nombre: getNombrePlataforma(plataformaSeleccionada)
        },
        medicamento: {
            nombre: medicamento.nombre,
            precio: medicamento.precio,
            estado: medicamento.estado
        },
        fecha: new Date().toLocaleString(),
        id: Date.now()
    };
    
    localStorage.setItem("pedidoActual", JSON.stringify(pedidoData));
    mostrarMensaje('success', '✅ Pedido confirmado. Redirigiendo...');
    
    // REDIRECCIÓN CORREGIDA: Sube un nivel y entra a la carpeta "final"
    setTimeout(() => {
        window.location.href = "../final/final.html";
    }, 1000);
}

function limpiarSeleccion() {
    farmaciaSeleccionada = null;
    plataformaSeleccionada = null;
    
    document.querySelectorAll('.tarjeta-farmacia').forEach(el => {
        el.classList.remove('seleccionada');
    });
    
    document.querySelectorAll('.plataforma-btn').forEach(el => {
        el.classList.remove('seleccionada');
    });
    
    document.getElementById('plataformasEnvio').style.display = 'none';
    document.getElementById('btnConfirmar').style.display = 'none';
    document.getElementById('btnConfirmar').disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Escuchar el botón de búsqueda si existe en el HTML
    const btnBuscar = document.querySelector('.btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarMedicamento);
    }

    const input = document.getElementById('inputMedicamento');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarMedicamento();
            }
        });
    }
});