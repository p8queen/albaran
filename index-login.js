const loading = document.getElementById("loading");
  const app = document.getElementById("app");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      // No hay sesión -> volver al login
      window.location.href = "login.html";
      return;
    }

    // Doble verificación por si el usuario fue quitado de la lista
    // después de haber iniciado sesión. La validación REAL la hacen
    // las reglas de Firestore, que consultan el mismo documento
    // config/allowedEmails.
    const allowed = await isEmailAllowed(user.email);
    if (!allowed) {
      await auth.signOut();
      window.location.href = "login.html";
      return;
    }

    document.getElementById("userName").textContent = user.displayName || user.email;
    document.getElementById("userPhoto").src = user.photoURL || "";

    loading.classList.add("hidden");
    app.classList.remove("hidden");

    cargarDatos();
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await auth.signOut();
    window.location.href = "login.html";
  });

  // Carga las tareas del usuario desde la colección "tasks".
  // Si el email no está permitido, esta llamada fallará con
  // "permission-denied" aunque el chequeo del cliente se salte,
  // porque las reglas de Firestore son la barrera real.
  async function cargarDatos() {
    const dataDiv = document.getElementById("data");
    try {
      const snap = await db.collection("tasks").limit(20).get();
      if (snap.empty) {
        dataDiv.textContent = "No hay tareas para mostrar.";
        return;
      }
      const ul = document.createElement("ul");
      snap.forEach(doc => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(doc.data());
        ul.appendChild(li);
      });
      dataDiv.innerHTML = "";
      dataDiv.appendChild(ul);
    } catch (err) {
      console.error(err);
      dataDiv.textContent = "Error al cargar las tareas: " + err.message;
    }
  }