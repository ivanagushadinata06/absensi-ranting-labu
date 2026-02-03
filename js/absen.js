const list = document.getElementById("list");
const tanggalInput = document.getElementById("tanggal");

// set default tanggal hari ini
const today = new Date().toISOString().slice(0, 10);
tanggalInput.value = today;

// render daftar anggota
function loadAnggota() {
  db.collection("anggota")
    .where("aktif", "==", true)
    .onSnapshot(snap => {
      list.innerHTML = "";

      if (snap.empty) {
        list.innerHTML = "<p>Belum ada anggota</p>";
        return;
      }

      snap.forEach(doc => {
        const id = doc.id;
        const nama = doc.data().nama;

        list.innerHTML += `
          <div class="item">
            <input type="checkbox" id="cb-${id}">
            <label for="cb-${id}">${nama}</label>
          </div>
        `;
      });

      // setelah render anggota, load absen tanggal terpilih
      loadAbsenTanggal(tanggalInput.value);
    }, err => {
      alert("Gagal load anggota: " + err.message);
    });
}

// load absen berdasarkan tanggal
function loadAbsenTanggal(tanggal) {
  if (!tanggal) return;

  db.collection("absen").doc(tanggal).get()
    .then(doc => {
      if (!doc.exists) return;

      const hadir = doc.data().hadir || {};
      Object.keys(hadir).forEach(anggotaId => {
        const cb = document.getElementById(`cb-${anggotaId}`);
        if (cb) cb.checked = hadir[anggotaId];
      });
    });
}

// simpan absen
function simpanAbsen() {
  const tanggal = tanggalInput.value;
  if (!tanggal) {
    alert("Pilih tanggal dulu");
    return;
  }

  const hadir = {};
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    const id = cb.id.replace("cb-", "");
    hadir[id] = cb.checked;
  });

  db.collection("absen").doc(tanggal).set({
    tanggal,
    hadir,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => alert("Absen tersimpan ✅"))
  .catch(err => alert(err.message));
}

// reload absen saat tanggal diganti
tanggalInput.addEventListener("change", e => {
  loadAbsenTanggal(e.target.value);
});

// init
loadAnggota();
