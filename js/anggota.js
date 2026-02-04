const list = document.getElementById("list");
const namaBaru = document.getElementById("namaBaru");

// load anggota
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
          <td>
            <span id="text-${id}">${nama}</span>
            <input id="input-${id}" value="${nama}" style="display:none;width:100%">
          </td>
          <td class="aksi">
            <button onclick="edit('${id}')">✏️</button>
            <button onclick="simpan('${id}')">💾</button>
            <button onclick="hapus('${id}')">🗑️</button>
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
