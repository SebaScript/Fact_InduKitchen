import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue, remove, query, orderByChild, equalTo, get, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDd4eJa5cH32pTFTePHok6Jg2ABv-OEbvs",
  authDomain: "facturacion-indukitchen.firebaseapp.com",
  databaseURL: "https://facturacion-indukitchen-default-rtdb.firebaseio.com",
  projectId: "facturacion-indukitchen",
  storageBucket: "facturacion-indukitchen.appspot.com",
  messagingSenderId: "501517340488",
  appId: "1:501517340488:web:2641735c2231cb9d54ad7d",
  measurementId: "G-R2ZMZBY7B3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase()
const counterRef = ref(db, 'counter');

const boton_agg_prod = document.getElementById("agg-prod")
const boton_limpiar_tabla = document.getElementById("limpiar")
const boton_crear_factura = document.getElementById("crear-fact")

const span_subtotal = document.getElementById('subtotal')
const span_iva = document.getElementById('iva')
const span_descuento = document.getElementById('descuento')
const span_total = document.getElementById('total')
const table = document.getElementById('articleTable')

///////////////////////////////////////////////////////////////////////

// Obtén todas las filas de la tabla


function agregarFila(codigo, precio, cantidad, descuento) {
    // Crear un nuevo elemento tr
    const newRow = document.createElement('tr');

    // Crear y agregar nuevos td con la información proporcionada
    const codProdCell = document.createElement('th');
    codProdCell.textContent = codigo;
    newRow.appendChild(codProdCell);

    const precioCell = document.createElement('td');
    precioCell.textContent = precio;
    newRow.appendChild(precioCell);

    const cantidadCell = document.createElement('td');
    cantidadCell.textContent = cantidad;
    newRow.appendChild(cantidadCell);

    const descuentoCell = document.createElement('td');
    descuentoCell.textContent = descuento;
    newRow.appendChild(descuentoCell);

    // Agregar la nueva fila a la tabla
    table.querySelector('tbody').appendChild(newRow);
}

boton_agg_prod.addEventListener('click', () => {
    var n_cod_prod = document.getElementsByName('cod-producto')[0].value;
    var n_precio = document.getElementsByName('precio')[0].value;
    var n_cantidad = document.getElementsByName('cantidad')[0].value;
    var n_descuento = document.getElementsByName('descuento')[0].value;
    if ((n_cod_prod == "" || n_precio == "" || n_cantidad == "" || n_descuento == "") ) {
        alert("Debes llenar todos los campos")
    } else {
        agregarFila(n_cod_prod, n_precio, n_cantidad, n_descuento);}

    let subtotal = calcularSubTotal();
    span_subtotal.textContent = subtotal
    let iva = calcularIVA(subtotal)
    span_iva.textContent = iva
    let descuento = calcularDescuentoTotal()
    span_descuento.textContent = descuento
    let total = calcularTotal()
    span_total.textContent = total

    document.getElementsByName("cod-producto")[0].value = ""
    document.getElementsByName("precio")[0].value = ""
    document.getElementsByName("cantidad")[0].value = ""
    document.getElementsByName("descuento")[0].value = ""
})

// Función para calcular el total de la tabla
function calcularSubTotal() {
    let total = 0;

    // Obtener todas las filas de la tabla
    const rows = table.querySelectorAll('tbody tr');

    // Iterar sobre cada fila y calcular el subtotal
    rows.forEach(row => {
        // Obtener el precio y la cantidad de la fila actual
        const precio = parseFloat(row.cells[1].textContent); // Índice 1 es la columna de precio
        const cantidad = parseInt(row.cells[2].textContent); // Índice 2 es la columna de cantidad

        // Calcular el subtotal de esta fila (precio * cantidad)
        const subtotal = precio * cantidad;

        // Sumar el subtotal al total
        total += subtotal;
    });

    return total;
}

function calcularIVA(total) {
    const porcentajeIVA = 0.19; // Porcentaje del IVA (19%)
    const valorIVA = total * porcentajeIVA;
    return valorIVA;
}

// Función para calcular el valor del descuento por fila
function calcularDescuentoPorFila(precio, cantidad, descuento) {
    const subtotal = precio * cantidad;
    const valorDescuento = subtotal * (descuento / 100);
    return valorDescuento;
}

function calcularTotal() {
    let total = parseFloat(document.getElementById("subtotal").textContent) + parseFloat(document.getElementById("iva").textContent) - parseFloat(document.getElementById("descuento").textContent)
    return total
}

// Función para calcular el valor total del descuento en la tabla
function calcularDescuentoTotal() {
    let descuentoTotal = 0;

    // Obtener todas las filas de la tabla
    const rows = table.querySelectorAll('tbody tr');

    // Iterar sobre cada fila y calcular el descuento
    rows.forEach(row => {
        // Obtener el precio, cantidad y descuento de la fila actual
        const precio = parseFloat(row.cells[1].textContent); // Índice 1 es la columna de precio
        const cantidad = parseInt(row.cells[2].textContent); // Índice 2 es la columna de cantidad
        const descuento = parseFloat(row.cells[3].textContent); // Índice 3 es la columna de descuento

        // Calcular el valor del descuento para esta fila
        const valorDescuentoPorFila = calcularDescuentoPorFila(precio, cantidad, descuento);

        // Sumar el descuento al total
        descuentoTotal += valorDescuentoPorFila;
    });

    return descuentoTotal;
}


boton_limpiar_tabla.addEventListener('click', () => {
    const tbody = table.querySelector('tbody');

    // Eliminar todas las filas (hijos) del cuerpo de la tabla
    tbody.innerHTML = '';
})

boton_crear_factura.addEventListener('click', () => { 

    let rows = document.querySelectorAll('table tr');

    let products = [];
    
    // Itera sobre las filas de la tabla
    for (let i = 1; i < rows.length; i++) {
      let product = {};
    
      // Obtén las celdas de la fila
      let p_code = rows[i].querySelector('th')
      let cells = rows[i].querySelectorAll('td');
    
      // Asigna los valores a las propiedades del producto
      product.codigo = p_code.textContent;
      product.precio = cells[0].textContent;
      product.cantidad = cells[1].textContent;
      product.descuento = cells[2].textContent;
    
      // Agrega el producto a la lista de productos
      products.push(product);
    }

    const doc_cliente = document.getElementsByName("id-cliente")[0].value

    if (doc_cliente == ""){
        alert("Ingresa el documento del cliente")
    }
    else
        {
        const subtotal = parseFloat(document.getElementById("subtotal").textContent)
        const IVA_total = parseFloat(document.getElementById("iva").textContent)
        const descuento_total = parseFloat(document.getElementById("descuento").textContent)
        const total = parseFloat(document.getElementById("total").textContent)
        let fecha = new Date()
        let fecha_formateada = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
    
        runTransaction(counterRef, (currentData) => {
            if (currentData === null) {
              return 1;
            } else {
              return currentData + 1;
            }
          }).then(({ committed, snapshot }) => {
            if (committed) {
              // Ahora puedes usar 'snapshot.val()' como el ID para tu nueva factura
              const newInvoiceId = snapshot.val();
              const factRef = ref(db, 'facturas/' + newInvoiceId);
              set(factRef, {
                cliente: doc_cliente,
                fecha: fecha_formateada,
                subtotal: subtotal,
                IVA: IVA_total,
                descuento: descuento_total,
                total: total,
                productos: products
            })
        }});  
        document.getElementsByName("id-cliente")[0].value = ""
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        alert("Factura generada con exito")

    }
});
