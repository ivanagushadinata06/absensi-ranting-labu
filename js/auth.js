function login() {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(emailInput, passwordInput)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      alert("Login gagal: " + err.message);
    });
}

// proteksi halaman selain login
auth.onAuthStateChanged(user => {
  if (!user && !location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
  }
});
