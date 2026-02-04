const rekapBody = document.getElementById("rekapBody");
const bulanSelect = document.getElementById("bulan");
const tahunSelect = document.getElementById("tahun");

// isi dropdown tahun (mis. 2024–2030)
const tahunSekarang = new Date().getFullYear();
for (let t = tahunSekarang - 1; t <= tahunSekarang + 5; t++) {
  const opt = document.createElement("option");
  opt.value = t;
  opt.textContent = t;
  tahunSelect.appendChild(opt);
}

// set default bulan & tahun sekarang
bulanSelect.value = String(new Date().getMonth() + 1).padStart(2, "0");
tahunSelect.value = tahunSekarang;

async function loadRekap() {
  rekapBody.innerHTML = "Loading...";

  const bulan = bulanSelect.value; // MM
  const tahun = tahunSelect.value; // YYYY
  const prefix = `${tahun}-${bulan}`; // YYYY-MM

  const anggotaSnap = await db.collection("anggota")
    .where("aktif", "==", true)
    .get();

  const anggota = {};
  anggotaSnap.forEach(doc => {
    anggota[doc.id] = {
      nama: doc.data().nama,
      hadir: 0
    };
  });

  const absenSnap = await db.collection("absen").get();

  let totalHari = 0;

  absenSnap.forEach(doc => {
    if (doc.id.startsWith(prefix)) {
      totalHari++;
      const hadirData = doc.data().hadir || {};
      Object.keys(hadirData).forEach(id => {
        if (hadirData[id] && anggota[id]) {
          anggota[id].hadir++;
        }
      });
    }
  });

  rekapBody.innerHTML = "";

  Object.values(anggota)
  .sort((a, b) => a.nama.localeCompare(b.nama))
  .forEach(a => {

    const full = totalHari > 0 && a.hadir === totalHari;
    rekapBody.innerHTML += `
      <tr class="${full ? "full" : ""}">
        <td>${a.nama}</td>
        <td>${a.hadir}</td>
        <td>${full ? "⭐ Full" : "-"}</td>
      </tr>
    `;
  });
}
