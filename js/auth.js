import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración web pública para el navegador
const firebaseConfig = {
  apiKey: "TU_API_KEY_WEB_AQUÍ", // Consíguela en Firebase Console > Configuración del proyecto > Aplicaciones Web
  authDomain: "amugenalapp.firebaseapp.com",
  projectId: "amugenalapp",
  storageBucket: "amugenalapp.appspot.com",
  messagingSenderId: "115776568657190082946", // ID extraído de tus credenciales
  appId: "TU_APP_ID_WEB" // Consíguelo en Firebase Console
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Correos electrónicos autorizados para administrar
const ADMIN_EMAILS = ["tu-email@gmail.com", "admin@gibbor.com"];

// Funciones globales para el HTML
window.openAuthModal = () => document.getElementById('auth-modal')?.classList.remove('hidden');
window.closeAuthModal = () => document.getElementById('auth-modal')?.classList.add('hidden');

window.loginGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
    window.closeAuthModal();
  } catch (error) {
    console.error("Error al autenticar:", error);
  }
};

window.logoutGoogle = () => signOut(auth);

// Escuchar cambios de estado del usuario
onAuthStateChanged(auth, (user) => {
  const btnLogin = document.getElementById('btn-login');
  const userProfile = document.getElementById('user-profile');
  const userAvatar = document.getElementById('user-avatar');
  const navAdmin = document.getElementById('nav-admin');
  const mobileNavAdmin = document.getElementById('mobile-nav-admin');

  if (user) {
    if (btnLogin) btnLogin.classList.add('hidden');
    if (userProfile) userProfile.classList.remove('hidden');
    if (userAvatar) userAvatar.src = user.photoURL || '';

    // Verificar si es administrador
    if (ADMIN_EMAILS.includes(user.email)) {
      if (navAdmin) navAdmin.classList.remove('hidden');
      if (mobileNavAdmin) mobileNavAdmin.classList.remove('hidden');
    }
  } else {
    if (btnLogin) btnLogin.classList.remove('hidden');
    if (userProfile) userProfile.classList.add('hidden');
    if (navAdmin) navAdmin.classList.add('hidden');
    if (mobileNavAdmin) mobileNavAdmin.classList.add('hidden');
  }
});

// Guardar producto en Firestore
window.saveProduct = async (event) => {
  event.preventDefault();
  
  const name = document.getElementById('prod-name').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const category = document.getElementById('prod-category').value;
  const image = document.getElementById('prod-image').value;
  const sizes = document.getElementById('prod-sizes').value.split(',').map(s => s.trim());

  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      category,
      image,
      sizes,
      createdAt: new Date()
    });
    alert("Producto guardado correctamente");
    document.getElementById('add-product-form').reset();
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Hubo un error al guardar el producto");
  }
};