// js/main.js

// Variables para elementos del DOM
const nombreProductoInput = document.getElementById('nombreProducto');
const categoriaProductoInput = document.getElementById('categoriaProducto');
const cantidadProductoInput = document.getElementById('cantidadProducto');
const agregarProductoBtn = document.getElementById('agregarProducto');
const listaProductos = document.getElementById('listaProductos');
const filtroCategoriaSelect = document.getElementById('filtroCategoria');
const ordenarPorSelect = document.getElementById('ordenarPor');

// Arreglo para almacenar productos
let productos = [];

// Evento para agregar un producto cuando se hace clic en el botón "Agregar"
agregarProductoBtn.addEventListener('click', () => {
    const nombreProducto = nombreProductoInput.value.trim();
    const categoriaProducto = categoriaProductoInput.value.trim();
    const cantidadProducto = parseInt(cantidadProductoInput.value);

    if (nombreProducto && categoriaProducto && !isNaN(cantidadProducto) && cantidadProducto >= 0) {
        const productoExistente = productos.find(producto => producto.nombre === nombreProducto);
        if (productoExistente) {
            // Si el producto ya existe, preguntar si desea sumar al stock existente
            const confirmar = confirm(`El producto "${nombreProducto}" ya existe. ¿Desea sumar al stock existente?`);
            if (confirmar) {
                productoExistente.cantidad += cantidadProducto;
            }
        } else {
            // Si el producto no existe, agregarlo como nuevo
            const nuevoProducto = {
                nombre: nombreProducto,
                categoria: categoriaProducto,
                cantidad: cantidadProducto
            };
            productos.push(nuevoProducto);
        }
        
        actualizarListaProductos();
        actualizarListaCategorias();
        nombreProductoInput.value = '';
        categoriaProductoInput.value = '';
        cantidadProductoInput.value = '';
    }
});

// Evento para filtrar productos por categoría
filtroCategoriaSelect.addEventListener('change', () => {
    actualizarListaProductos();
});

// Evento para ordenar productos
ordenarPorSelect.addEventListener('change', () => {
    actualizarListaProductos();
});

// Función para actualizar la lista de productos en la interfaz de usuario
function actualizarListaProductos() {
    const filtroCategoria = filtroCategoriaSelect.value;
    const ordenarPor = ordenarPorSelect.value;
    let productosFiltrados = productos;

    // Filtrar por categoría
    if (filtroCategoria !== 'todos') {
        productosFiltrados = productosFiltrados.filter(producto =>
            producto.categoria === filtroCategoria
        );
    }

    // Ordenar productos
    if (ordenarPor === 'nombre') {
        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (ordenarPor === 'cantidad') {
        productosFiltrados.sort((a, b) => a.cantidad - b.cantidad);
    } else if (ordenarPor === 'categoria') {
        productosFiltrados.sort((a, b) => a.categoria.localeCompare(b.categoria));
    }

    // Actualizar la lista de productos en la interfaz de usuario
    listaProductos.innerHTML = '';
    productosFiltrados.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${producto.cantidad}</td>
            <td>
                <button class="btn btn-warning btn-sm editar" data-nombre="${producto.nombre}" data-categoria="${producto.categoria}" data-cantidad="${producto.cantidad}">Editar</button>
                <button class="btn btn-danger btn-sm eliminar" data-nombre="${producto.nombre}">Eliminar</button>
                <button class="btn btn-success btn-sm sumar-stock" data-nombre="${producto.nombre}">+</button>
                <button class="btn btn-danger btn-sm restar-stock" data-nombre="${producto.nombre}">-</button>
            </td>
        `;
        listaProductos.appendChild(fila);
    });

    // Eventos para editar y eliminar productos
    const botonesEditar = document.querySelectorAll('.editar');
    botonesEditar.forEach(btn => {
        btn.addEventListener('click', () => {
            const nombre = btn.getAttribute('data-nombre');
            const categoria = btn.getAttribute('data-categoria');
            const cantidad = parseInt(btn.getAttribute('data-cantidad'));

            // Llenar los campos de edición con los datos del producto
            nombreProductoInput.value = nombre;
            categoriaProductoInput.value = categoria;
            cantidadProductoInput.value = cantidad;

            // Eliminar el producto de la lista
            productos = productos.filter(producto => producto.nombre !== nombre);

            // Actualizar la lista de productos
            actualizarListaProductos();
            actualizarListaCategorias();
        });
    });

    const botonesEliminar = document.querySelectorAll('.eliminar');
    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            const nombre = btn.getAttribute('data-nombre');

            // Eliminar el producto de la lista
            productos = productos.filter(producto => producto.nombre !== nombre);

            // Actualizar la lista de productos
            actualizarListaProductos();
            actualizarListaCategorias();
        });
    });

    const botonesSumarStock = document.querySelectorAll('.sumar-stock');
    botonesSumarStock.forEach(btn => {
        btn.addEventListener('click', () => {
            const nombre = btn.getAttribute('data-nombre');
            const productoExistente = productos.find(producto => producto.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            }

            // Actualizar la lista de productos
            actualizarListaProductos();
        });
    });

    const botonesRestarStock = document.querySelectorAll('.restar-stock');
    botonesRestarStock.forEach(btn => {
        btn.addEventListener('click', () => {
            const nombre = btn.getAttribute('data-nombre');
            const productoExistente = productos.find(producto => producto.nombre === nombre);

            if (productoExistente && productoExistente.cantidad > 0) {
                productoExistente.cantidad -= 1;
            }

            // Actualizar la lista de productos
            actualizarListaProductos();
        });
    });
}

// Función para actualizar la lista de categorías en el filtro
function actualizarListaCategorias() {
    filtroCategoriaSelect.innerHTML = '';
    const categorias = Array.from(new Set(productos.map(producto => producto.categoria)));
    categorias.unshift('todos'); // Agregar opción "todos"
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        filtroCategoriaSelect.appendChild(option);
    });
}

// Inicialización de la lista de productos
actualizarListaProductos();
