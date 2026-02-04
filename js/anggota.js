const list = document.getElementById("list");
const namaBaru = document.getElementById("namaBaru");

// load anggota
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

    // 🔤 URUTKAN A–Z
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
          <td class="aksi">
            <button onclick="edit('${a.id}')">✏️</button>
            <button onclick="simpan('${a.id}')">💾</button>
            <button onclick="hapus('${a.id}')">🗑️</button>
          </td>
        </tr>
      `;
    });
  });


// tambah anggota
function tambah() {
  if (!namaBaru.value.trim()) {
    alert("Nama tidak boleh kosong");
    return;
  }

  db.collection("anggota").add({
    nama: namaBaru.value,
    aktif: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  namaBaru.value = "";
}

// edit mode
function edit(id) {
  document.getElementById(`text-${id}`).style.display = "none";
  document.getElementById(`input-${id}`).style.display = "block";
}

// simpan edit
function simpan(id) {
  const input = document.getElementById(`input-${id}`);
  const nama = input.value.trim();

  if (!nama) {
    alert("Nama tidak boleh kosong");
    return;
  }

  db.collection("anggota").doc(id).update({ nama });

  document.getElementById(`text-${id}`).style.display = "block";
  input.style.display = "none";
}

// hapus anggota
function hapus(id) {
  if (confirm("Hapus anggota ini?")) {
    db.collection("anggota").doc(id).delete();
  }
}
