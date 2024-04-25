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
const factRef = ref(db, 'facturas');
let urlParams = new URLSearchParams(window.location.search);
let customerId = urlParams.get('id');

onValue(factRef, (snapshot) => {
    if (snapshot.exists()) {
      const invoices = snapshot.val();
  
      // Obtén la tabla
      let table = document.getElementById('articleTable');
  
      // Itera sobre las facturas
      for (let invoiceId in invoices) {
        let invoice = invoices[invoiceId];
  
        // Solo procesa las facturas del cliente
        if (invoice.cliente === customerId) {
          // Crea una nueva fila
          let row = document.createElement('tr');
          row.classList.add("fact")
  
          // Crea las celdas
          let codeCell = document.createElement('th');
          let dateCell = document.createElement('td');
          let totalValueCell = document.createElement('td');
  
          // Asigna los valores a las celdas
          codeCell.innerText = invoiceId;
          dateCell.innerText = invoice.fecha;
          totalValueCell.innerText = invoice.total;
  
          // Agrega las celdas a la fila
          row.appendChild(codeCell);
          row.appendChild(dateCell);
          row.appendChild(totalValueCell);
  
          // Agrega la fila a la tabla
          table.appendChild(row);
        }
      }
    } else {
      console.log("No data available");
    }
  
    get_tr()
});

function get_tr() {
  const facturas = document.querySelectorAll("tr")
  facturas.forEach(function(factura_elegida) {
  factura_elegida.addEventListener('click', () => {
    window.open("ver_factura.html?id="+encodeURIComponent(factura_elegida.querySelector("th").textContent))
    })
})
}