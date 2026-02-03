const list = document.getElementById("list");
const tanggalInput = document.getElementById("tanggal");

// default tanggal hari ini
tanggalInput.value = new Date().toISOString().slice(0, 10);

// load anggota
function loadAnggota() {
  db.collection("anggota")
    .where("aktif", "==", true)
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = `
          <tr>
            <td colspan="2">Belum ada anggota</td>
          </tr>`;
        return;
      }

      snapshot.forEach(doc => {
        const id = doc.id;
        const nama = doc.data().nama;

        list.innerHTML += `
          <tr>
            <td>${nama}</td>
            <td>
              <input type="checkbox" id="cb-${id}">
            </td>
          </tr>
        `;
      });

      loadAbsenTanggal(tanggalInput.value);
    });
}

// load absen berdasarkan tanggal
function loadAbsenTanggal(tanggal) {
  if (!tanggal) return;

  // 1️⃣ Reset semua checkbox (default = kosong)
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.checked = false;
  });

  // 2️⃣ Ambil data absen sesuai tanggal
  db.collection("absen").doc(tanggal).get()
    .then(doc => {

      // jika belum ada data absen di tanggal ini → selesai (semua kosong)
      if (!doc.exists) return;

      const hadir = doc.data().hadir || {};

      // 3️⃣ Set checkbox SESUAI database
      Object.entries(hadir).forEach(([anggotaId, status]) => {
        const cb = document.getElementById(`cb-${anggotaId}`);
        if (cb) {
          cb.checked = status === true;
        }
      });

    })
    .catch(err => {
      alert("Gagal load absen: " + err.message);
    });
}


// simpan absen
function simpanAbsen() {
  const tanggal = tanggalInput.value;
  if (!tanggal) {
    alert("Pilih tanggal terlebih dahulu");
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
  .then(() => alert("Absen berhasil disimpan ✅"))
  .catch(err => alert(err.message));
}

// reload saat tanggal berubah
tanggalInput.addEventListener("change", e => {
  loadAbsenTanggal(e.target.value);
});

// init
loadAnggota();
