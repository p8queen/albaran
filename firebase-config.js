// ============================================================
// CONFIGURACIÓN DE FIREBASE
// Reemplaza estos valores con los de tu proyecto:
// Firebase Console > Configuración del proyecto > Tus apps > SDK setup
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBr-PLTsIyTzs2_ABnhjJbkNEJwdbL2h_U",
    authDomain: "checklist-4490b.firebaseapp.com",
    projectId: "checklist-4490b",
    storageBucket: "checklist-4490b.firebasestorage.app",
    messagingSenderId: "713167831717",
    appId: "1:713167831717:web:85ad7485bdb0a96245c34c"
};

// Inicializa Firebase (usa la versión "compat" para simplicidad)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ============================================================
// Verifica si un email está en la lista de permitidos.
// Estructura en Firestore:
//   Colección: "config"
//   Documento: "allowedEmails"
//   Campo:     "emails" -> array de strings, ej: ["ana@gmail.com", "juan@gmail.com"]
//
// Esta misma ruta es la que consultan las reglas de Firestore
// (config/allowedEmails), así que editar el documento en la consola
// actualiza el acceso en un solo lugar, sin tocar código ni reglas.
// ============================================================
async function isEmailAllowed(email) {
  try {
    const doc = await db.collection("config").doc("allowedEmails").get();
    if (!doc.exists) {
      console.error("No existe el documento config/allowedEmails en Firestore.");
      return false;
    }
    const emails = doc.data().emails || [];
    return emails
      .map(e => e.toLowerCase().trim())
      .includes((email || "").toLowerCase().trim());
  } catch (err) {
    console.error("Error verificando lista de emails permitidos:", err);
    return false;
  }
}
