const list = document.getElementById("list");

db.collection("anggota").orderBy("createdAt").onSnapshot(snap => {
  list.innerHTML = "";
  snap.forEach(doc => {
    list.innerHTML += `
      <li>
        ${doc.data().nama}
        <button onclick="hapus('${doc.id}')">❌</button>
      </li>
    `;
  });
});

function tambah() {
  db.collection("anggota").add({
    nama: nama.value,
    aktif: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  nama.value = "";
}

function hapus(id) {
  if (confirm("Hapus anggota?")) {
    db.collection("anggota").doc(id).delete();
  }
}
