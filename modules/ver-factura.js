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
const factRef = ref(db, 'factura');