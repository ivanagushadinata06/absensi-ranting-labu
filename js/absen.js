const list = document.getElementById("list");
const tanggalInput = document.getElementById("tanggal");

// default tanggal hari ini
tanggalInput.value = new Date().toISOString().slice(0, 10);

// =======================
// LOAD ANGGOTA
// =======================
function loadAnggota() {
 db.collection("anggota")
  .where("aktif", "==", true)
  .orderBy("nama")
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
              <input
                type="checkbox"
                id="cb-${id}"
                onchange="simpanOtomatis('${id}', this.checked)">
            </td>
          </tr>
        `;
      });

      loadAbsenTanggal(tanggalInput.value);
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

// init
loadAnggota();
