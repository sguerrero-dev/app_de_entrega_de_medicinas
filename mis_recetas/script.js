// Referencias a elementos del DOM
const lista = document.getElementById('listaRecetas');
const nuevaBtn = document.getElementById('nuevaReceta');
const buscarBtn = document.getElementById('buscar');

let seleccionada = null;
let contador = 1;

// Función para crear una receta
function crearReceta(nombre = `Receta ${contador}`) {
  const li = document.createElement('li');
  li.className = 'receta';

  // Texto editable
  const texto = document.createElement('span');
  texto.textContent = nombre;

  const acciones = document.createElement('div');
  acciones.className = 'acciones';

  // Botón editar
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editar';
  editBtn.className = 'edit';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // evita seleccionar al editar
    const nuevoNombre = prompt("Modificar receta:", texto.textContent);
    if (nuevoNombre && nuevoNombre.trim() !== "") {
      texto.textContent = nuevoNombre; // actualiza el texto
    }
  });

  // Botón eliminar
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.className = 'delete';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    lista.removeChild(li);
    if (seleccionada === li) seleccionada = null;
  });

  acciones.appendChild(editBtn);
  acciones.appendChild(deleteBtn);

  li.appendChild(texto);
  li.appendChild(acciones);

  // Selección de receta
  li.addEventListener('click', () => {
    if (seleccionada) seleccionada.classList.remove('seleccionada');
    seleccionada = li;
    li.classList.add('seleccionada');
  });

  lista.appendChild(li);
  contador++;
}

// Crear nueva receta
nuevaBtn.addEventListener('click', () => {
  const nombre = prompt("Nombre de la receta:");
  crearReceta(nombre || `Receta ${contador}`);
});

// Buscar receta seleccionada
buscarBtn.addEventListener('click', () => {
  if (seleccionada) {
    const recetaSeleccionada = seleccionada.querySelector('span').textContent;
    localStorage.setItem("recetaSeleccionada", recetaSeleccionada);
    window.location.href = "../busqueda/busqueda.html"; // redirige a otra interfaz
  } else {
    alert("Selecciona una receta primero");
  }
});

// Recetas iniciales
crearReceta("Amoxicilina 500mg + Ibuprofeno 400mg");
crearReceta("Paracetamol 500mg + Omeprazol 20mg");
crearReceta("Metformina 850mg + Simvastatina 20mg");
