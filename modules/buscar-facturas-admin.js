import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue, remove, query, orderByChild, orderByKey, equalTo, get, startAt, endAt } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
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

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchType = document.getElementById('searchType');
const searchTable = document.getElementById('articleTable');


searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const searchText = searchInput.value.trim();
  const selectedSearchType = searchType.value;

  let queryRef;

  if (selectedSearchType === 'codigo') {
    queryRef = query(ref(db, 'facturas'), orderByKey(), equalTo(searchText));
  } else if (selectedSearchType === 'cliente') {
    queryRef = query(ref(db, 'facturas'), orderByChild('cliente'), equalTo(searchText));
  } else if (selectedSearchType === 'fecha') {
    const startDate = `${searchText} 00:00:00`;
    const endDate = `${searchText} 23:59:59`;
    queryRef = query(ref(db, 'facturas'), orderByChild('fecha'), startAt(startDate), endAt(endDate));
  } else if (selectedSearchType === 'valor') {
    queryRef = query(ref(db, 'facturas'), orderByChild('total'), equalTo(parseFloat(searchText)));
  }

  try {
    const snapshot = await get(queryRef);
    renderResults(snapshot);
  } catch (error) {
    console.error('Error al buscar en Firebase:', error);
  }
});

// Función para renderizar los resultados en la tabla
function renderResults(snapshot) {
  let tableContent = '';
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      tableContent += `
        <tr>
          <th>${childSnapshot.key}</th>
          <td>${data.fecha}</td>
          <td>${data.cliente}</td>
          <td>${data.total}</td>
        </tr>
      `;
    });
  } else {
    tableContent = `
      <tr>
        <td colspan="7">No se encontraron resultados</td>
      </tr>
    `;
  }

  searchTable.innerHTML = `
    <thead>
      <tr>
        <th>Código</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Valor total</th>
      </tr>
    </thead>
    <tbody>
      ${tableContent}
    </tbody>
  `;

  get_tr()
}

function get_tr() {
    const facturas = document.querySelectorAll("tr")
    facturas.forEach(function(factura_elegida) {
    factura_elegida.addEventListener('click', () => {
      window.open("ver_factura.html?id="+encodeURIComponent(factura_elegida.querySelector("th").textContent))
      })
  })
  }