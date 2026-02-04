const list = document.getElementById("list");
const tanggalInput = document.getElementById("tanggal");

// default tanggal hari ini
tanggalInput.value = new Date().toISOString().slice(0, 10);

// =======================
// LOAD ANGGOTA (URUT A–Z)
// =======================
function loadAnggota() {
  db.collection("anggota")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      let data = [];

      snapshot.forEach(doc => {
        const d = doc.data();
        if (d.aktif === true) {
          data.push({
            id: doc.id,
            nama: d.nama
          });
        }
      });

      // 🔤 urutkan nama A–Z
      data.sort((a, b) => a.nama.localeCompare(b.nama));

      if (data.length === 0) {
        list.innerHTML = `
          <tr>
            <td colspan="2">Belum ada anggota</td>
          </tr>`;
        return;
      }

      data.forEach(a => {
        list.innerHTML += `
          <tr>
            <td>${a.nama}</td>
            <td>
              <input
                type="checkbox"
                id="cb-${a.id}"
                onchange="simpanOtomatis('${a.id}', this.checked)">
            </td>
          </tr>
        `;
      });

      // load absen sesuai tanggal aktif
      loadAbsenTanggal(tanggalInput.value);
    }, err => {
      alert("Gagal load anggota: " + err.message);
    });
}

// =======================
// LOAD ABSEN PER TANGGAL
// =======================
function loadAbsenTanggal(tanggal) {
  if (!tanggal) return;

  // reset semua checkbox
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.checked = false;
  });

  db.collection("absen").doc(tanggal).get()
    .then(doc => {
      if (!doc.exists) return;

      const hadir = doc.data().hadir || {};
      Object.entries(hadir).forEach(([id, status]) => {
        const cb = document.getElementById(`cb-${id}`);
        if (cb) cb.checked = status === true;
      });
    })
    .catch(err => {
      alert("Gagal load absen: " + err.message);
    });
}

// =======================
// SIMPAN OTOMATIS SAAT CHECKBOX DIUBAH
// =======================
function simpanOtomatis(anggotaId, status) {
  const tanggal = tanggalInput.value;
  if (!tanggal) return;

  const ref = db.collection("absen").doc(tanggal);

  ref.get().then(doc => {
    let data = {
      tanggal,
      hadir: {},
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (doc.exists) {
      data.hadir = doc.data().hadir || {};
    }

    data.hadir[anggotaId] = status;

    ref.set(data);
  });
}

// =======================
// GANTI TANGGAL
// =======================
tanggalInput.addEventListener("change", e => {
  loadAbsenTanggal(e.target.value);
});

// =======================
// INIT
// =======================
loadAnggota();
