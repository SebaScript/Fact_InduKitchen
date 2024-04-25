import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue, remove, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
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


let urlParams = new URLSearchParams(window.location.search);
let invoiceCode = urlParams.get('id');

document.getElementById("cod-fact").textContent = invoiceCode

const factRef = ref(db, 'facturas/' + invoiceCode);

// Obtén los datos de la factura
get(factRef).then((snapshot) => {
  if (snapshot.exists()) {
    const invoice = snapshot.val();
    const total = invoice.total
    const span_total = document.getElementById("total")
    span_total.textContent = total

    const iva = invoice.IVA
    const span_iva = document.getElementById("iva")
    span_iva.textContent = iva

    const fecha = invoice.fecha
    const span_fecha = document.getElementById("fecha")
    span_fecha.textContent = fecha

    const cliente = invoice.cliente
    const span_cliente = document.getElementById("cliente")
    span_cliente.textContent = cliente

    const descuento = invoice.descuento
    const span_descuento = document.getElementById("desc")
    span_descuento.textContent = descuento

    const products = invoice.productos;

    // Obtén la tabla
    let table = document.getElementById('articleTable');

    // Itera sobre los productos
    for (let product of products) {
      // Crea una nueva fila
      let row = document.createElement('tr');

      // Crea las celdas
      let quantityCell = document.createElement('td');
      let productCell = document.createElement('td');
      let unitValueCell = document.createElement('td');
      let discountCell = document.createElement('td');
      let totalValueCell = document.createElement('td');

      // Asigna los valores a las celdas
      quantityCell.innerText = product.cantidad;
      productCell.innerText = product.codigo;
      unitValueCell.innerText = product.precio;
      discountCell.innerText = product.descuento;
      totalValueCell.innerText = (parseFloat(product.precio) * parseFloat(product.cantidad) * (100-parseFloat(product.descuento)))/100 ;

      // Agrega las celdas a la fila
      row.appendChild(quantityCell);
      row.appendChild(productCell);
      row.appendChild(unitValueCell);
      row.appendChild(discountCell);
      row.appendChild(totalValueCell);

      // Agrega la fila a la tabla
      table.appendChild(row);
    }
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});