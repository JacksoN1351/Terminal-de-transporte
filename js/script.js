/* BASE DE DATOS ACTUALIZADA */
const rutas = [
    { destino: "BOGOTÁ", horario: "05:00 AM", precio: 150000, vehiculo: "Bus Heliconia", empresa: "Cootransmayo", cupos: 32 },
    { destino: "CALI", horario: "08:00 AM", precio: 133000, vehiculo: "Bus Heliconia", empresa: "Coomotor", cupos: 20 },
    { destino: "PASTO", horario: "05:15 PM", precio: 85000, vehiculo: "Bus Heliconia", empresa: "Transipiales", cupos: 15 },
    { destino: "MOCOA", horario: "07:15 AM", precio: 30000, vehiculo: "Aerovan Sprinter", empresa: "Transipiales", cupos: 8 },
    { destino: "NEIVA", horario: "09:30 AM", precio: 100000, vehiculo: "Aerovan Sprinter", empresa: "Coomotor", cupos: 12 },
    { destino: "PITALITO", horario: "10:00 AM", precio: 80000, vehiculo: "Buseta", empresa: "Cootranshuila", cupos: 18 },
    { destino: "FLORENCIA", horario: "02:00 PM", precio: 111000, vehiculo: "Aerovan Sprinter", empresa: "Cootransmayo", cupos: 5 },
    { destino: "IBAGUÉ", horario: "06:30 PM", precio: 160000, vehiculo: "Bus Heliconia", empresa: "Coomotor", cupos: 25 },
    { destino: "ORITO", horario: "06:00 AM", precio: 21000, vehiculo: "Camioneta", empresa: "Transipiales", cupos: 4 },
    { destino: "LA HORMIGA", horario: "08:30 AM", precio: 40000, vehiculo: "Buseta", empresa: "Transipiales", cupos: 10 },
    { destino: "SIBUNDOY", horario: "04:00 AM", precio: 65000, vehiculo: "Buseta", empresa: "Cootransmayo", cupos: 14 },
    { destino: "VILLAGARZÓN", horario: "11:00 AM", precio: 25000, vehiculo: "Aerovan Sprinter", empresa: "Transipiales", cupos: 9 }
];

/* BUSCADOR */
document.querySelector(".btn-buscar").addEventListener("click", buscarRuta);
document.querySelector(".destino-entrada").addEventListener("keypress", (e) => {
    if (e.key === 'Enter') buscarRuta();
});

function buscarRuta() {
    let input = document.querySelector(".destino-entrada").value.toUpperCase().trim();
    const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let resultados = rutas.filter(ruta => 
        input === "" || normalizar(ruta.destino).includes(normalizar(input))
    );
    mostrarResultados(resultados);
}

function mostrarResultados(lista) {
    let contenedor = document.getElementById("listaResultados");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p style='color:red;'>No se encontraron rutas.</p>";
        return;
    }

    // Buscamos el índice original para que la reserva afecte al objeto correcto
    lista.forEach((ruta) => {
        const indexOriginal = rutas.findIndex(r => r.destino === ruta.destino && r.horario === ruta.horario);
        
        let div = document.createElement("div");
        div.className = "resultado";
        div.innerHTML = `
            <h4>${ruta.destino}</h4>
            <p><strong>Horario:</strong> ${ruta.horario} | <strong>Empresa:</strong> ${ruta.empresa}</p>
            <p><strong>Precio:</strong> $${ruta.precio.toLocaleString()} | <strong>Vehículo:</strong> ${ruta.vehiculo}</p>
            <p><strong style="color: ${ruta.cupos > 0 ? '#28a745' : '#dc3545'};">Disponibilidad: ${ruta.cupos} asientos</strong></p>
            <button class="btn-añadir" ${ruta.cupos === 0 ? 'disabled style="background:gray;"' : ''} 
                onclick="cotizarYReservar(${indexOriginal})">
                ${ruta.cupos > 0 ? 'Cotizar y Reservar' : 'Agotado'}
            </button>
        `;
        contenedor.appendChild(div);
    });
}

function cotizarYReservar(index) {
    const ruta = rutas[index];
    const cantidad = prompt(`¿Cuántos pasajes para ${ruta.destino}?`, "1");
    const num = parseInt(cantidad);

    if (isNaN(num) || num <= 0 || num > ruta.cupos) {
        alert("Cantidad no válida o supera la disponibilidad.");
        return;
    }

    // Descontar cupos
    ruta.cupos -= num;
    
    // Generar Cotización
    const total = ruta.precio * num;
    const listaCompradas = document.getElementById("listaCompradas");
    const tiqueteDiv = document.createElement("div");
    tiqueteDiv.className = "tiquete-confirmado";
    tiqueteDiv.id = `reserva-${Date.now()}`; // ID único para poder borrarla
    
    tiqueteDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <h3>COTIZACIÓN: ${ruta.destino}</h3>
                <p><strong>Pasajeros:</strong> ${num} | <strong>Total:</strong> $${total.toLocaleString()}</p>
                <p style="font-size: 0.8em; color: #555;">Vehículo: ${ruta.vehiculo} - ${ruta.empresa}</p>
            </div>
            <button onclick="cancelarReserva('${tiqueteDiv.id}', ${index}, ${num})" 
                style="background:#dc3545; padding: 5px 10px; font-size: 0.7em;">X Cancelar</button>
        </div>
        <p style="font-size: 0.85em; margin-top: 10px; border-top: 1px dashed #91d5ff; pt-5px;">
            ⚠️ Para finalizar su reserva, por favor comuníquese con nuestra línea oficial de WhatsApp: <strong>320 934 8389</strong>. Allí le proporcionaremos los datos bancarios para su transferencia.
                Una vez enviado el soporte de pago, le haremos entrega de su tiquete oficial de forma inmediata.
        </p>
    `;

    listaCompradas.appendChild(tiqueteDiv);
    buscarRuta(); // Refrescar lista visual
    tiqueteDiv.scrollIntoView({ behavior: 'smooth' });
}

function cancelarReserva(divId, indexRuta, cantidadDevolver) {
    if(confirm("¿Desea cancelar esta pre-reserva? Los cupos se liberarán.")) {
        // Devolver cupos a la base de datos
        rutas[indexRuta].cupos += cantidadDevolver;
        
        // Eliminar el elemento visual
        document.getElementById(divId).remove();
        
        // Refrescar buscador para mostrar nuevos cupos
        buscarRuta();
    }
}